import { ContactForm } from "@/components/contact-form";
import { contactSection } from "@/data/site";

export function ContactSection() {
  return (
    <section
      aria-labelledby="contacto-title"
      className="bg-night relative isolate overflow-hidden py-16 text-white sm:py-24"
      id={contactSection.id}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -left-48 top-10 size-96 rounded-full bg-violet-600/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 size-80 rounded-full bg-indigo-400/10 blur-3xl" />

      <div className="section-shell relative grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="scroll-reveal lg:sticky lg:top-28">
          <p className="text-lavender text-sm font-extrabold uppercase tracking-[0.22em]">Hablemos</p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-white sm:text-5xl" id="contacto-title">
            {contactSection.title}
            <span className="mt-2 block text-violet-300">{contactSection.highlight}</span>
          </h2>
          <div className="mt-7 space-y-4 text-base leading-8 text-slate-300">
            {contactSection.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-bold text-white">{contactSection.closing}</p>
          </div>
        </div>

        <div className="glass-panel interactive-card scroll-reveal bg-panel min-w-0 rounded-[2rem] border border-white/10 p-6 shadow-[0_28px_90px_rgba(30,27,75,0.38)] sm:p-9">
          <h3 className="font-display text-2xl font-black text-white">Cuéntanos sobre tu proyecto</h3>
          <p className="mb-7 mt-2 text-sm leading-6 text-slate-400">
            Todos los campos son obligatorios. Tus datos se usarán únicamente para responderte.
          </p>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
