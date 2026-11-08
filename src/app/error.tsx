"use client";

import Link from "next/link";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ retry }: ErrorPageProps) {
  return (
    <main className="ambient-dots grid min-h-[70vh] place-items-center px-4 py-20 text-white">
      <section className="w-full max-w-2xl text-center" aria-labelledby="error-title">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-brand">
          Algo salió mal
        </p>
        <h1
          className="mt-4 font-display text-5xl font-black tracking-tight sm:text-7xl"
          id="error-title"
        >
          No pudimos cargar esta página
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-lavender sm:text-lg">
          Inténtalo de nuevo. Si el problema continúa, puedes volver al inicio y contactarnos desde
          allí.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            className="focus-ring min-h-12 rounded-full bg-white px-7 py-3 font-bold text-night transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
            onClick={retry}
            type="button"
          >
            Intentar de nuevo
          </button>
          <Link
            className="focus-ring glass-panel min-h-12 rounded-full px-7 py-3 font-bold text-white transition hover:border-brand hover:text-brand-light"
            href="/"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
