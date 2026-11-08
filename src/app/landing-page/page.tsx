import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CookieConsent } from "@/components/cookie-consent";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Landing pages orientadas a conversión",
  description:
    "Diseño y desarrollo de landing pages rápidas, medibles y enfocadas en convertir campañas digitales en oportunidades comerciales.",
  alternates: { canonical: "/landing-page" },
  openGraph: {
    title: "Landing pages orientadas a conversión | Breckline",
    description:
      "Convierte el tráfico de tus campañas en oportunidades con una landing page rápida, clara y medible.",
    url: "/landing-page",
  },
};

const benefits = [
  {
    title: "Mensaje claro",
    description: "Una propuesta de valor que explica rápidamente qué ofreces y por qué elegirte.",
  },
  {
    title: "Conversión medible",
    description: "Eventos y objetivos preparados para evaluar el rendimiento de tus campañas.",
  },
  {
    title: "Rendimiento real",
    description: "Experiencia responsive, accesible y optimizada para cargar con rapidez.",
  },
] as const;

const deliverables = [
  "Diseño responsive alineado con tu marca",
  "Jerarquía de contenido y llamadas a la acción",
  "Formulario de contacto seguro y validado",
  "SEO técnico y metadatos esenciales",
  "Integración de analítica con consentimiento",
  "Preparación para despliegue y dominio propio",
] as const;

const steps = [
  ["01", "Descubrimiento", "Entendemos tu oferta, audiencia y objetivo principal."],
  ["02", "Estrategia", "Definimos estructura, mensajes y recorrido de conversión."],
  ["03", "Diseño y desarrollo", "Construimos una experiencia rápida, clara y adaptable."],
  ["04", "Validación y lanzamiento", "Probamos, medimos y dejamos todo listo para publicar."],
] as const;

export default function LandingPageService() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <main className="bg-night" id="contenido">
        <section className="ambient-dots overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="section-shell grid items-center gap-12 lg:grid-cols-2">
            <div className="min-w-0">
              <p className="hero-reveal inline-flex rounded-full border border-brand/35 bg-brand/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-light">
                Landing pages
              </p>
              <h1 className="hero-reveal mt-5 min-w-0 max-w-3xl font-display text-[2.125rem] font-black leading-[0.96] tracking-tight text-white min-[360px]:text-[2.375rem] min-[390px]:text-[2.625rem] sm:text-6xl lg:text-7xl [--delay:120ms]">
                Convierte visitas en oportunidades reales
              </h1>
              <p className="hero-reveal mt-6 max-w-2xl text-lg leading-8 text-lavender [--delay:220ms]">
                Diseñamos páginas enfocadas en una sola meta: presentar tu oferta con claridad y guiar a cada visitante hacia la acción.
              </p>
              <div className="hero-reveal mt-8 flex flex-wrap gap-4 [--delay:320ms]">
                <Link
                  className="focus-ring shimmer-pill group inline-flex min-h-14 items-center gap-3 rounded-full bg-white px-7 font-bold text-night shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:bg-brand hover:text-white"
                  href="/#contacto"
                >
                  Cotizar mi landing
                  <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
                </Link>
                <Link
                  className="focus-ring glass-panel rounded-full px-6 py-4 font-bold text-white transition hover:border-brand/70 hover:text-brand-light"
                  href="/#casos-de-exito"
                >
                  Ver nuestro trabajo
                </Link>
              </div>
            </div>

            <div className="name">John Doe</div>


            <div className="hero-reveal glass-panel interactive-card relative mx-auto w-full max-w-xl rounded-[2rem] p-3 [--delay:420ms]">
              <div className="absolute inset-10 -z-10 rounded-full bg-brand/30 blur-3xl" />
              <Image
                alt="Landing page adaptable a distintos dispositivos"
                className="floating-art relative max-h-[38rem] w-full object-contain"
                height={1125}
                loading="eager"
                src="/assets/images/responsive.webp"
                width={700}
              />
            </div>
          </div>
        </section>


    
        <section aria-labelledby="beneficios-title" className="border-t border-white/5 bg-night py-16 sm:py-24">
          <div className="section-shell">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-light">Enfoque</p>
              <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl" id="beneficios-title">
                Cada elemento cumple una función
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <article className="glass-panel interactive-card scroll-reveal rounded-3xl p-7" key={benefit.title}>
                  <span className="grid size-11 place-items-center rounded-2xl bg-brand/20 text-sm font-black text-brand-light">0{index + 1}</span>
                  <h3 className="mt-6 font-display text-2xl font-black text-white">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-lavender">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="incluye-title" className="border-y border-white/5 bg-night-soft py-16 text-white sm:py-24">
          <div className="section-shell grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-light">Una entrega completa</p>
              <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl" id="incluye-title">
                Lista para recibir tráfico y generar resultados
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-lavender">
                No entregamos una plantilla aislada. Construimos una base técnica y comercial preparada para operar en producción.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {deliverables.map((item) => (
                <li className="glass-panel interactive-card scroll-reveal flex items-start gap-3 rounded-2xl p-4" key={item}>
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <CheckIcon className="size-4" />
                  </span>
                  <span className="text-sm font-semibold leading-6 text-lavender">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="proceso-title" className="grid-background py-16 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-brand-light">Proceso</p>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white min-[390px]:text-4xl sm:text-5xl" id="proceso-title">
                De la idea al lanzamiento, sin improvisaciones
              </h2>
            </div>
            <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {steps.map(([number, title, description]) => (
                <li className="glass-panel interactive-card scroll-reveal rounded-3xl p-6" key={number}>
                  <span className="font-display text-4xl font-black text-brand-light/50">{number}</span>
                  <h3 className="mt-5 font-display text-xl font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-lavender">{description}</p>
                </li>
              ))}
            </ol>

            <div className="glow-shell scroll-reveal mt-12 rounded-[2rem] border border-brand/30 bg-[linear-gradient(135deg,#1c0b35,#3d01c5_65%,#5625f7)] p-7 text-white sm:flex sm:items-center sm:justify-between sm:p-10">
              <div>
                <h2 className="font-display text-3xl font-black">¿Tienes una campaña en mente?</h2>
                <p className="mt-2 text-brand-light">Cuéntanos el objetivo y te ayudaremos a darle una estructura efectiva.</p>
              </div>
              <Link
                className="focus-ring shimmer-pill mt-6 inline-flex min-h-13 items-center gap-2 rounded-full bg-white px-6 font-bold text-night transition hover:-translate-y-1 sm:mt-0"
                href="/#contacto"
              >
                Hablemos
                <ArrowIcon className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <CookieConsent />
    </>
  );
}