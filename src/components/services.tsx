import Image from "next/image";

import { services } from "@/data/site";

export function Services() {
  const [pwa, custom, seo] = services;

  return (
    <section
      aria-labelledby="servicios-title"
      className="section-light relative overflow-hidden py-16 text-slate-950 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 size-[34rem] rounded-full bg-violet-200/25 blur-3xl"
      />
      <div className="section-shell relative">
        <div className="scroll-reveal mb-10 max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violet-700">Soluciones digitales</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl" id="servicios-title">
            Tecnología que trabaja para tu negocio
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Construimos experiencias rápidas, claras y preparadas para crecer junto con tus objetivos.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[0.78fr_1.22fr]">
          <article
            className="light-card interactive-card scroll-reveal group flex flex-col overflow-hidden rounded-[2rem] border border-violet-200/70 bg-white p-7 transition duration-300 hover:border-violet-400/60 sm:p-9"
            id={pwa.id}
          >
            <h3 className="font-display text-2xl font-black text-slate-950">{pwa.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{pwa.description}</p>
            <Image
              alt={pwa.image.alt}
              className="mx-auto mt-8 h-auto max-h-[30rem] w-full object-contain drop-shadow-[0_24px_36px_rgba(76,29,149,0.12)] transition duration-500 group-hover:scale-[1.03]"
              height={pwa.image.height}
              loading="lazy"
              src={pwa.image.src}
              width={pwa.image.width}
            />
          </article>

          <div className="grid gap-7">
            {[custom, seo].map((service) => (
              <article
                className="light-card interactive-card scroll-reveal group grid items-center gap-6 overflow-hidden rounded-[2rem] border border-violet-200/70 bg-white p-6 transition duration-300 hover:border-violet-400/60 sm:grid-cols-[0.85fr_1.15fr] sm:p-8"
                id={service.id}
                key={service.id}
              >
                <Image
                  alt={service.image.alt}
                  className="mx-auto h-auto max-h-64 w-full object-contain drop-shadow-[0_20px_30px_rgba(76,29,149,0.12)] transition duration-500 group-hover:scale-105"
                  height={service.image.height}
                  loading="lazy"
                  src={service.image.src}
                  width={service.image.width}
                />
                <div>
                  <h3 className="font-display text-2xl font-black leading-tight text-slate-950">{service.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
