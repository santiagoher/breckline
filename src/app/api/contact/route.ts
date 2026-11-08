import { NextResponse } from "next/server";

import {
  contactSchema,
  MAX_CONTACT_REQUEST_BYTES,
} from "../../../lib/contact-schema";
import { getSupabaseAdmin } from "../../../lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_TIMEOUT_MS = 5_000;

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
} as const;

type ErrorStatus = 400 | 413 | 415 | 500 | 503;

type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; message: string; status: 400 | 413 | 415 };

type CaptchaResult = "valid" | "invalid" | "unavailable";


const data = {
  nobmre: "Santiago",
  rol: "Desarrollador",
  mensaje: "confirmacion de "
}

function jsonResponse(
  body: { ok: boolean; message: string },
  status: number,
): NextResponse {
  return NextResponse.json(body, {
    headers: RESPONSE_HEADERS,
    status,
  });
}

function errorResponse(status: ErrorStatus, message: string): NextResponse {
  return jsonResponse({ ok: false, message }, status);
}

async function readLimitedJson(request: Request): Promise<JsonBodyResult> {
  const mediaType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    ?.trim()
    .toLowerCase();

  if (mediaType !== "application/json") {
    return {
      ok: false,
      message: "El contenido de la solicitud debe ser JSON.",
      status: 415,
    };
  }

  const contentLengthHeader = request.headers.get("content-length");

  if (contentLengthHeader !== null) {
    const contentLength = Number(contentLengthHeader);

    if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
      return {
        ok: false,
        message: "La solicitud no es válida.",
        status: 400,
      };
    }

    if (contentLength > MAX_CONTACT_REQUEST_BYTES) {
      return {
        ok: false,
        message: "La solicitud es demasiado grande.",
        status: 413,
      };
    }
  }

  if (!request.body) {
    return {
      ok: false,
      message: "La solicitud no es válida.",
      status: 400,
    };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      totalBytes += value.byteLength;

      if (totalBytes > MAX_CONTACT_REQUEST_BYTES) {
        await reader.cancel().catch(() => undefined);

        return {
          ok: false,
          message: "La solicitud es demasiado grande.",
          status: 413,
        };
      }

      chunks.push(value);
    }
  } catch {
    return {
      ok: false,
      message: "No se pudo leer la solicitud.",
      status: 400,
    };
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const value: unknown = JSON.parse(text) as unknown;

    return { ok: true, value };
  } catch {
    return {
      ok: false,
      message: "La solicitud no contiene JSON válido.",
      status: 400,
    };
  }
}

async function verifyRecaptcha(token: string): Promise<CaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();

  if (!secret) {
    console.error("[contact] RECAPTCHA_SECRET_KEY is not configured.");
    return "unavailable";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RECAPTCHA_TIMEOUT_MS);

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      body: new URLSearchParams({ response: token, secret }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      method: "POST",
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error("[contact] reCAPTCHA returned an unsuccessful status.");
      return "unavailable";
    }

    const result: unknown = await response.json();

    if (
      typeof result !== "object" ||
      result === null ||
      !("success" in result) ||
      typeof result.success !== "boolean"
    ) {
      console.error("[contact] reCAPTCHA returned an invalid response.");
      return "unavailable";
    }

    return result.success ? "valid" : "invalid";
  } catch {
    console.error("[contact] reCAPTCHA verification failed.");
    return "unavailable";
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  const bodyResult = await readLimitedJson(request);

  if (!bodyResult.ok) {
    return errorResponse(bodyResult.status, bodyResult.message);
  }

  const parsed = contactSchema.safeParse(bodyResult.value);

  if (!parsed.success) {
    return errorResponse(400, "Los datos enviados no son válidos.");
  }

  if (parsed.data.honeypot) {
    return jsonResponse(
      { ok: true, message: "Mensaje enviado correctamente." },
      200,
    );
  }

  const captchaResult = await verifyRecaptcha(parsed.data.captchaToken);

  if (captchaResult === "invalid") {
    return errorResponse(400, "No se pudo validar la verificación de seguridad.");
  }

  if (captchaResult === "unavailable") {
    return errorResponse(
      503,
      "El servicio no está disponible temporalmente. Inténtalo de nuevo.",
    );
  }

  try {
    const { error } = await getSupabaseAdmin().from("clientes").insert({
      mensaje: parsed.data.mensaje,
      nombre: parsed.data.nombre,
      titulo: parsed.data.titulo,
    });

    if (error) {
      console.error("[contact] Supabase insert failed.", { code: error.code });
      return errorResponse(
        500,
        "No se pudo enviar el mensaje. Inténtalo de nuevo.",
      );
    }
  } catch {
    console.error("[contact] Contact persistence failed.");
    return errorResponse(
      500,
      "No se pudo enviar el mensaje. Inténtalo de nuevo.",
    );
  }

  return jsonResponse(
    { ok: true, message: "Mensaje enviado correctamente." },
    201,
  );
}
