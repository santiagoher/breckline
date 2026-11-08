import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { ArrowIcon } from "@/components/icons";
import { LandimotosCover } from "@/components/landimotos-cover";
import { portfolioProjects } from "@/data/projects";
import { isProjectImageReady } from "@/lib/project-media";

function ProjectLink({ href, title, children }: { href?: string; title: string; children: ReactNode }) {
  return href ? (
    <Link className="focus-ring block rounded-[1.75rem]" href={href} aria-label={`Explorar ${title}`}>
      {children}
    </Link>
  ) : <div>{children}</div>;
}

export function Projects() {
  return (
    <section className="projects-stage relative overflow-hidden py-16 text-slate-950 sm:py-24" id="proyectos" aria-labelledby="proyectos-title">
      <div className="section-shell relative">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.22em] text-violet-700">
              <span aria-hidden="true" className="size-2 rounded-full bg-violet-600" />
              Nuestro trabajo
            </p>
            <h2 className="mt-4 text-balance font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl" id="proyectos-title">
              Ideas reales.<br /><span className="text-violet-700">Proyectos que destacan.</span>
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-slate-600 lg:pb-1">
            Diseño con intención, tecnología a medida y una identidad que se siente en cada detalle.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-8">
          {portfolioProjects.map((project, index) => (
            <article className="project-card group min-w-0 lg:even:mt-20" key={project.id}>
              <ProjectLink href={project.href} title={project.title}>
                {project.id === "portal-logistico-landimotos" ? <LandimotosCover number={index + 1} screenshot={project.caseStudy && isProjectImageReady(project.caseStudy.hero) ? project.caseStudy.hero : undefined} /> : <div className={`project-preview project-preview--${project.theme} relative isolate flex aspect-[6/5] items-end overflow-hidden rounded-[1.75rem] px-5 pt-16 sm:aspect-[4/3] sm:px-8`}>
                  <span className="absolute left-5 top-5 text-xs font-bold tracking-[0.16em] text-slate-900/70 sm:left-8">BRECKLINE® / 0{index + 1}</span>
                  {project.href ? <span className="absolute right-5 top-4 grid size-10 place-items-center rounded-full bg-white/70 text-slate-900 transition duration-300 group-hover:bg-violet-700 group-hover:text-white group-focus-within:bg-violet-700 group-focus-within:text-white sm:right-8">
                    <ArrowIcon className="size-5 -rotate-45" />
                  </span> : <span className="absolute right-5 top-5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold text-slate-700 sm:right-8">Concepto</span>}
                  <div aria-hidden="true" className="project-browser w-full translate-y-5 overflow-hidden rounded-t-xl border border-white/25 bg-[#100c20] text-white shadow-[0_24px_60px_rgba(27,14,55,0.25)] transition duration-500 motion-safe:group-hover:translate-y-2 motion-safe:group-hover:-rotate-1 motion-safe:group-focus-within:translate-y-2">
                    <div className="flex h-7 items-center gap-1.5 border-b border-white/10 bg-white/5 px-3">
                      <span className="size-1.5 rounded-full bg-white/40" /><span className="size-1.5 rounded-full bg-white/25" /><span className="size-1.5 rounded-full bg-white/15" />
                      <span className="mx-auto pr-6 text-[8px] tracking-widest text-white/60">BRECKLINE — DIGITAL STUDIO</span>
                    </div>
                    {project.caseStudy ? (isProjectImageReady(project.caseStudy.hero) ? (
                      <Image alt="" src={project.caseStudy.hero.src} width={project.caseStudy.hero.width} height={project.caseStudy.hero.height} sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw" className="h-auto w-full" />
                    ) : <div className="px-6 py-10 sm:py-14"><p className="text-[10px] font-bold uppercase tracking-widest text-brand-light">Software empresarial / Caso de estudio</p><p className="mt-5 max-w-sm font-display text-2xl font-black leading-tight sm:text-4xl">{project.previewTitle}</p><p className="mt-5 text-xs text-lavender">Operación · Logística · Analítica</p></div>) : <div className="relative grid min-h-56 grid-cols-[1.1fr_0.9fr] items-center gap-2 bg-[radial-gradient(ellipse_at_top_right,#50318c,transparent_75%)] px-4 py-8 sm:min-h-72 sm:px-6">
                      <div className="relative z-10">
                        <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-violet-200">Diseñamos lo que sigue</p>
                        <p className="mt-3 font-display text-xl font-black leading-[1.1] tracking-tight sm:text-3xl">{project.previewTitle}</p>
                        <span className="mt-5 inline-flex rounded-full bg-violet-500 px-3 py-2 text-[9px] font-bold">Hagámoslo realidad ↗</span>
                      </div>
                      <Image alt="" src={project.previewImage} width={375} height={420} sizes="(min-width: 1024px) 240px, 40vw" className="h-44 w-full object-contain sm:h-60" />
                    </div>}
                  </div>
                </div>}
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-slate-500">{project.category}</p>
                    <h3 className="mt-2 font-display text-2xl font-black tracking-tight transition group-hover:text-violet-700 group-focus-within:text-violet-700 sm:text-3xl">{project.title}</h3>
                  </div>
                  {project.href ? <span className="mt-1 shrink-0 border-b border-violet-300 pb-1 text-xs font-bold text-violet-700">{project.caseStudy ? "Ver proyecto" : "Explorar"} ↗</span> : null}
                </div>
              </ProjectLink>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">{project.description}</p>
              <ul aria-label="Especialidades del proyecto" className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => <li className="rounded-full border border-slate-200 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-600" key={tag}>{tag}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center lg:mt-20">
          <p className="text-lg font-semibold tracking-tight">El próximo proyecto puede ser el tuyo.</p>
          <Link className="focus-ring inline-flex items-center gap-3 rounded-full bg-violet-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-800" href="/#contacto">Hablemos de tu idea <ArrowIcon className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}
