import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false,
  },
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="ambient-dots grid min-h-screen place-items-center px-4 py-20 text-white">
      <section className="w-full max-w-2xl text-center" aria-labelledby="not-found-title">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-brand">Error 404</p>
        <h1
          className="mt-4 font-display text-5xl font-black tracking-tight sm:text-7xl"
          id="not-found-title"
        >
          Esta página no existe
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-lavender sm:text-lg">
          Es posible que el enlace haya cambiado o que la dirección esté incompleta. Puedes volver
          al inicio para seguir explorando Breckline.
        </p>
        <Link
          className="focus-ring shimmer-pill mt-9 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 font-bold text-night transition hover:-translate-y-0.5 hover:bg-brand hover:text-white"
          href="/"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
