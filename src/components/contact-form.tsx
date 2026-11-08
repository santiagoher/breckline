"use client";

import Script from "next/script";
import { FormEvent, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      getResponse: (widgetId?: number) => string;
      render: (
        container: HTMLElement,
        parameters: {
          callback?: () => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          sitekey: string;
          size: "compact" | "normal";
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

type FormStatus =
  | { kind: "idle"; message: "" }
  | { kind: "submitting"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const captchaSlotRef = useRef<HTMLDivElement>(null);
  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const captchaWidgetIdRef = useRef<number | null>(null);
  const [captchaScriptReady, setCaptchaScriptReady] = useState(false);
  const [captchaSize, setCaptchaSize] = useState<"compact" | "normal" | null>(null);
  const [status, setStatus] = useState<FormStatus>({ kind: "idle", message: "" });
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  const isConfigured = Boolean(siteKey);

  useEffect(() => {
    const slot = captchaSlotRef.current;
    if (!siteKey || !slot) return;

    const updateSize = () => setCaptchaSize(slot.clientWidth < 304 ? "compact" : "normal");
    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, [siteKey]);

  useEffect(() => {
    const captcha = window.grecaptcha;
    const container = captchaContainerRef.current;
    if (!captchaScriptReady || !captchaSize || !container || !siteKey || !captcha) return;

    let widgetId: number;
    try {
      widgetId = captcha.render(container, {
        callback: () => {
          setStatus({ kind: "idle", message: "" });
        },
        "error-callback": () => {
          setStatus({
            kind: "error",
            message: "No se pudo cargar la verificación. Actualiza la página e inténtalo de nuevo.",
          });
        },
        "expired-callback": () =>
          setStatus({
            kind: "error",
            message: "La verificación expiró. Confirma nuevamente que no eres un robot.",
          }),
        sitekey: siteKey,
        size: captchaSize,
      });
      captchaWidgetIdRef.current = widgetId;
    } catch {
      const frame = window.requestAnimationFrame(() =>
        setStatus({
          kind: "error",
          message: "No se pudo iniciar la verificación. Actualiza la página e inténtalo de nuevo.",
        }),
      );
      return () => window.cancelAnimationFrame(frame);
    }

    return () => {
      try {
        captcha.reset(widgetId);
      } catch {
        // The widget can already be gone when its responsive container changes.
      }
      if (captchaWidgetIdRef.current === widgetId) captchaWidgetIdRef.current = null;
    };
  }, [captchaScriptReady, captchaSize, siteKey]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || status.kind === "submitting") return;

    const widgetId = captchaWidgetIdRef.current;
    const captchaToken = widgetId === null ? "" : (window.grecaptcha?.getResponse(widgetId) ?? "");
    if (!captchaToken) {
      setStatus({ kind: "error", message: "Confirma que no eres un robot antes de enviar." });
      return;
    }

    const formData = new FormData(formRef.current);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    setStatus({ kind: "submitting", message: "Enviando tu mensaje…" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.get("nombre"),
          titulo: formData.get("titulo"),
          mensaje: formData.get("mensaje"),
          honeypot: formData.get("honeypot"),
          captchaToken,
        }),
        cache: "no-store",
        signal: controller.signal,
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) {
        throw new Error(result?.message ?? "No pudimos enviar el mensaje. Inténtalo nuevamente.");
      }

      formRef.current.reset();
      window.grecaptcha?.reset(widgetId ?? undefined);
      setStatus({
        kind: "success",
        message: result?.message ?? "Recibimos tu mensaje. Te contactaremos pronto.",
      });
    } catch (error) {
      const message =
        error instanceof DOMException && error.name === "AbortError"
          ? "La solicitud tardó demasiado. Revisa tu conexión e inténtalo nuevamente."
          : error instanceof Error
            ? error.message
            : "No pudimos enviar el mensaje. Inténtalo nuevamente.";
      setStatus({ kind: "error", message });
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const fieldClass =
    "focus-ring mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white shadow-inner shadow-black/10 outline-none transition [color-scheme:dark] placeholder:text-slate-500 hover:border-violet-300/40 hover:bg-white/[0.08] focus:border-violet-300 focus:bg-indigo-950/70 focus:ring-4 focus:ring-violet-500/15";

  return (
    <>
      {siteKey ? (
        <Script
          onError={() =>
            setStatus({
              kind: "error",
              message: "No se pudo cargar la verificación. Actualiza la página e inténtalo de nuevo.",
            })
          }
          onReady={() => setCaptchaScriptReady(true)}
          src="https://www.google.com/recaptcha/api.js?render=explicit"
          strategy="lazyOnload"
        />
      ) : null}

      <form ref={formRef} className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="text-lavender text-sm font-bold uppercase tracking-wide" htmlFor="nombre">
            Nombre
          </label>
          <input
            autoComplete="name"
            className={fieldClass}
            id="nombre"
            maxLength={100}
            minLength={2}
            name="nombre"
            placeholder="Ej. Carlos Rodríguez"
            required
            type="text"
          />
        </div>

        <div>
          <label className="text-lavender text-sm font-bold uppercase tracking-wide" htmlFor="titulo">
            ¿Qué necesitas?
          </label>
          <input
            autoComplete="off"
            className={fieldClass}
            id="titulo"
            maxLength={140}
            minLength={3}
            name="titulo"
            placeholder="Ej. Sitio web corporativo"
            required
            type="text"
          />
        </div>

        <div>
          <label className="text-lavender text-sm font-bold uppercase tracking-wide" htmlFor="mensaje">
            Mensaje
          </label>
          <textarea
            className={`${fieldClass} min-h-36 resize-y`}
            id="mensaje"
            maxLength={3_000}
            minLength={10}
            name="mensaje"
            placeholder="Cuéntanos los objetivos y necesidades de tu proyecto…"
            required
            rows={5}
          />
        </div>

        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="honeypot">No completar este campo</label>
          <input autoComplete="off" id="honeypot" name="honeypot" tabIndex={-1} type="text" />
        </div>

        {siteKey ? (
          <div
            aria-label="Verificación de seguridad"
            className={captchaSize === "compact" ? "min-h-[144px] max-w-full" : "min-h-[78px] max-w-full"}
            ref={captchaSlotRef}
            role="group"
          >
            <div key={captchaSize ?? "pending"} ref={captchaContainerRef} />
          </div>
        ) : null}

        {!isConfigured ? (
          <p className="rounded-2xl border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">
            El formulario estará disponible al configurar reCAPTCHA en el entorno de producción.
          </p>
        ) : null}

        <button
          className="focus-ring inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-violet-500 px-7 py-3 font-bold text-white shadow-xl shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-violet-400 active:bg-violet-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          disabled={!isConfigured || status.kind === "submitting"}
          type="submit"
        >
          {status.kind === "submitting" ? "Enviando…" : "Enviar mensaje"}
        </button>
        
    
        <p
          aria-live="polite"
          className={`min-h-6 text-sm font-medium ${
            status.kind === "error"
              ? "text-red-300"
              : status.kind === "success"
                ? "text-emerald-300"
                : "text-slate-400"
          }`}
          role="status"
        >
          {status.message}
        </p>
      </form>
    </>
  );
}
     


