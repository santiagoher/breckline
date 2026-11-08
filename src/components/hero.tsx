import Image from "next/image";
import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { Typewriter } from "@/components/typewriter";
import { hero } from "@/data/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-stage bg-night relative isolate overflow-hidden pb-10 pt-10 sm:pb-12 sm:pt-14 lg:pb-14 lg:pt-16"
    >
      <div aria-hidden="true" className="hero-lighting absolute inset-0">
        <div className="hero-bg-base" />
        <div className="hero-ellipse" data-home-intro-glow />
        <div className="hero-grid" data-home-intro-pattern />
        <div className="hero-vignette" data-home-intro-vignette />
      </div>

      <div className="hero-curtain relative" data-home-intro-reveal>
        <div className="section-shell relative">
          <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
            <h1
              className="hero-enter-title mt-7 max-w-6xl font-display text-[clamp(2.75rem,8.3vw,7.25rem)] font-black leading-[0.9] tracking-[-0.045em] text-white"
              data-home-intro-title
              id="hero-title"
            >
              <span className="block">{hero.title}</span>
              <span className="mt-3 block min-h-[1.9em] bg-gradient-to-r from-violet-200 via-fuchsia-200 to-indigo-200 bg-clip-text text-transparent sm:min-h-[1.8em] lg:min-h-[1.05em]">
                <Typewriter initialDelay={2_800} words={hero.rotatingWords} />
              </span>
            </h1>

            <p
              className="text-lavender hero-enter-description mt-6 max-w-2xl text-base leading-7 sm:text-lg sm:leading-8"
              data-home-intro-description
            >
              {hero.description}
            </p>

            <div
              className="hero-enter-buttons mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
              data-home-intro-buttons
            >
              <Link
                className="focus-ring group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-7 font-bold text-white shadow-[0_16px_44px_rgba(109,40,217,0.34)] transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:from-violet-500 motion-safe:hover:to-indigo-400"
                href={hero.cta.href}
              >
                {hero.cta.label}
                <ArrowIcon className="size-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
              </Link>
              <Link
                className="focus-ring glass-panel inline-flex min-h-14 items-center justify-center rounded-full border border-violet-300/20 bg-white/[0.045] px-7 font-bold text-violet-100 transition duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:border-violet-300/40 motion-safe:hover:bg-white/[0.08] motion-safe:hover:text-white"
                href="#casos-de-exito"
              >
                Ver casos de éxito
              </Link>
            </div>
          </div>

          <div
            className="interactive-card glass-panel hero-enter-visual relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2rem] border border-violet-300/15 bg-white/[0.035] p-2 shadow-[0_32px_100px_rgba(0,0,0,0.45)] sm:mt-16 sm:rounded-[2.5rem] sm:p-3"
            data-home-intro-visual
          >
            <div className="bg-panel relative isolate aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-[16/11] sm:rounded-[2rem] lg:aspect-[16/9]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,92,246,0.26),transparent_47%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(167,139,250,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(167,139,250,0.055)_1px,transparent_1px)] bg-[size:44px_44px]"
              />
              <div aria-hidden="true" className="absolute left-5 top-5 z-20 flex gap-1.5 sm:left-7 sm:top-7">
                <span className="size-2 rounded-full bg-violet-300/80" />
                <span className="size-2 rounded-full bg-fuchsia-300/60" />
                <span className="size-2 rounded-full bg-indigo-300/60" />
              </div>
              <Image
                alt={hero.image.alt}
                className="relative z-10 h-full w-full object-contain object-bottom px-3 pt-10 drop-shadow-[0_30px_45px_rgba(0,0,0,0.38)] sm:px-10 sm:pt-8 lg:px-16"
                height={hero.image.height}
                loading="eager"
                sizes="(min-width: 1280px) 64rem, (min-width: 768px) 88vw, 94vw"
                src={hero.image.src}
                width={hero.image.width}
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
