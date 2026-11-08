import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { VimeoEmbed } from "@/components/vimeo-embed";
import { showcaseVideos } from "@/data/site";

export function Showcase() {
  return (
    <section
      aria-labelledby="casos-title"
      className="relative overflow-hidden bg-night py-16 text-white sm:py-24"
      id="casos-de-exito"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent"
      />
      <div className="section-shell relative">
        <div className="scroll-reveal flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violet-300">Contenido que conecta</p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight sm:text-5xl" id="casos-title">
              Marcas que ya están creciendo con nosotros
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-lavender">
              Piezas audiovisuales pensadas para presentar, emocionar y convertir en los canales donde está tu audiencia.
            </p>
          </div>
          <Link
            className="focus-ring group inline-flex w-fit items-center gap-2 rounded-full border border-violet-300/30 bg-violet-400/10 px-5 py-3 font-bold text-white transition duration-300 hover:-translate-y-0.5 hover:border-violet-200/70 hover:bg-violet-500/25"
            href="#contacto"
          >
            Crear mi proyecto
            <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="scroll-reveal mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {showcaseVideos.map((video) => (
            <VimeoEmbed key={video.id} orientation="portrait" title={video.title} videoId={video.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
