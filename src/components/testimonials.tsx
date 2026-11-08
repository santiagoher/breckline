import { CheckIcon } from "@/components/icons";
import { VimeoEmbed } from "@/components/vimeo-embed";
import { testimonials } from "@/data/site";

export function Testimonials() {
  return (
    <section
      aria-labelledby="resultados-title"
      className="section-light relative overflow-hidden py-16 text-slate-950 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-52 top-24 size-[32rem] rounded-full bg-indigo-200/20 blur-3xl"
      />
      <div className="section-shell relative">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violet-700">Resultados medibles</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-slate-950 sm:text-5xl" id="resultados-title">
            Estrategia respaldada por resultados
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Cada proyecto conecta creatividad, ejecución y objetivos comerciales claros.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              className="light-card interactive-card scroll-reveal overflow-hidden rounded-[2rem] border border-violet-200/70 bg-white p-5 transition duration-300 hover:border-violet-400/60 sm:p-8"
              key={testimonial.id}
            >
              <VimeoEmbed title={testimonial.video.title} videoId={testimonial.video.id} />
              <div className="p-2 pt-7 sm:p-3 sm:pt-8">
                <span className="grid size-10 place-items-center rounded-full border border-violet-200 bg-violet-100 text-violet-700">
                  <CheckIcon className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
                  {testimonial.title}
                </h3>
                <blockquote className="mt-5 text-base leading-8 text-slate-600">“{testimonial.quote}”</blockquote>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
