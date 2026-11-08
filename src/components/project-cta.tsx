import Link from "next/link";

import { ArrowIcon, iconComponents } from "@/components/icons";
import { contactChannels, projectCallToAction } from "@/data/site";

export function ProjectCta() {
  return (
    <section className="bg-night relative isolate overflow-hidden py-16 text-white sm:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="scroll-reveal">
          <div className="glass-panel interactive-card bg-panel relative overflow-hidden rounded-[2.5rem] border border-white/10 p-7 shadow-[0_30px_90px_rgba(30,27,75,0.38)] sm:p-12 lg:p-16">
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 size-80 rounded-full bg-violet-400/15 blur-3xl" />
              <h2 className="relative font-display text-5xl font-black leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
                ¿Tienes un
                <br />
                <span className="italic text-violet-300">proyecto</span>
                <br />
                en mente?
              </h2>
              <Link
                className="focus-ring group relative inline-flex min-h-14 w-fit items-center gap-3 rounded-full bg-white px-7 font-bold text-indigo-950 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:bg-violet-200"
                href={projectCallToAction.cta.href}
              >
                {projectCallToAction.cta.label}
                <ArrowIcon className="size-5 transition group-hover:translate-x-1" />
              </Link>
            </div>

            <address className="mt-16 grid min-w-0 gap-4 border-t border-white/10 pt-10 not-italic sm:grid-cols-2 lg:grid-cols-5">
              {contactChannels.map((channel) => {
                const Icon = iconComponents[channel.icon];
                const content = (
                  <>
                    <span className="mb-3 grid size-10 place-items-center rounded-xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-lavender text-[10px] font-extrabold uppercase tracking-[0.2em]">{channel.label}</span>
                    <span className="mt-2 block min-w-0 [overflow-wrap:anywhere] text-sm font-bold text-slate-100 transition group-hover:text-violet-200">
                      {channel.value}
                    </span>
                  </>
                );

                return channel.href ? (
                  <a
                    className="focus-ring interactive-card group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-violet-300/30 hover:bg-white/[0.08]"
                    href={channel.href}
                    key={channel.id}
                    rel={channel.external ? "noopener noreferrer" : undefined}
                    target={channel.external ? "_blank" : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <div className="interactive-card group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4" key={channel.id}>{content}</div>
                );
              })}
            </address>
          </div>
        </div>
      </div>
    </section>
  );
}
