"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";

const storageKey = "breckline-cookie-consent-v1";
type Consent = "accepted" | "rejected" | "pending" | "loading";

function readConsent(): Consent {
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "accepted" || saved === "rejected" ? saved : "pending";
  } catch {
    return "pending";
  }
}

export function CookieConsent() {
  const [consent, setConsent] = useState<Consent>("loading");
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  const validGtmId = gtmId && /^GTM-[A-Z0-9]+$/i.test(gtmId) ? gtmId : undefined;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setConsent(readConsent()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const saveConsent = (value: Exclude<Consent, "pending" | "loading">) => {
    try {
      window.localStorage.setItem(storageKey, value);
    } catch {
      // The choice still applies for the current page when storage is unavailable.
    }
    setConsent(value);
  };

  return (
    <>
      {consent === "accepted" && validGtmId ? (
        <>
          <Script id="gtm-bootstrap" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
          </Script>
          <Script
            id="gtm-script"
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(validGtmId)}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}

      {consent === "pending" ? (
        <section
          aria-label="Preferencias de privacidad"
          className="glass-panel fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 w-dvw max-w-[100dvw] overflow-x-clip rounded-none border-x-0 border-b-0 border-t border-white/10 bg-indigo-950/90 p-4 text-white shadow-[0_-20px_60px_rgba(15,10,45,0.45)] backdrop-blur-2xl md:p-6 lg:bottom-0 lg:pb-[max(1.5rem,env(safe-area-inset-bottom))]"
          data-home-intro-deferred-overlay
        >
          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <p className="min-w-0 max-w-3xl [overflow-wrap:anywhere] text-sm leading-6 text-slate-300 md:text-base">
              Usamos analítica únicamente con tu permiso para entender cómo mejorar el sitio. Puedes
              consultar los detalles en nuestra{" "}
              <Link className="focus-ring text-lavender font-semibold underline decoration-violet-400/70 underline-offset-4 transition hover:text-white" href="/politica-de-privacidad">
                política de privacidad
              </Link>
              .
            </p>
            <div className="flex w-full min-w-0 flex-col gap-3 min-[360px]:flex-row sm:w-auto">
              <button
                className="focus-ring min-w-0 flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/10 sm:flex-none"
                onClick={() => saveConsent("rejected")}
                type="button"
              >
                Rechazar
              </button>
              <button
                className="focus-ring min-w-0 flex-1 rounded-xl bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-400 sm:flex-none"
                onClick={() => saveConsent("accepted")}
                type="button"
              >
                Aceptar analítica
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {consent === "accepted" || consent === "rejected" ? (
        <button
          aria-label="Cambiar preferencias de privacidad"
          className="focus-ring glass-panel bg-panel text-lavender fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] left-4 z-40 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold shadow-xl shadow-black/25 transition hover:border-violet-300/40 hover:text-white lg:bottom-[max(1rem,env(safe-area-inset-bottom))]"
          data-home-intro-deferred-overlay
          onClick={() => setConsent("pending")}
          type="button"
        >
          Privacidad
        </button>
      ) : null}
    </>
  );
}
