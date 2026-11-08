import Image from "next/image";
import Link from "next/link";

import { InstagramIcon } from "@/components/icons";
import { footer } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-night border-t border-white/10 text-white">
      <div className="section-shell py-12 sm:py-14">
        <div className="scroll-reveal grid gap-12 lg:grid-cols-[1.1fr_1.9fr]">
          <div>
            <Link aria-label="Breckline, inicio" className="focus-ring inline-block rounded-xl bg-white/95 px-3 py-1 shadow-lg shadow-black/20" href="/">
              <Image
                alt="Breckline"
                className="h-auto w-40"
                height={64}
                loading="eager"
                src="/assets/logos/Breckline%20logo.svg"
                unoptimized
                width={190}
              />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">{footer.description}</p>
            <div className="mt-6 flex gap-3">
              {footer.socialLinks.map((link) => (
                <a
                  aria-label={link.label}
                  className="focus-ring text-lavender grid size-11 place-items-center rounded-full border border-violet-300/20 bg-white/5 transition hover:border-violet-300 hover:bg-violet-500 hover:text-white"
                  href={link.href}
                  key={link.href}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  target={link.external ? "_blank" : undefined}
                >
                  <InstagramIcon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footer.groups.map((group) => (
              <div key={group.title}>
                <h2 className="text-lavender font-display text-lg font-bold">{group.title}</h2>
                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      {link.external ? (
                        <a
                          className="focus-ring rounded text-sm text-slate-400 transition hover:text-violet-200"
                          href={link.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          className="focus-ring rounded text-sm text-slate-400 transition hover:text-violet-200"
                          href={link.href}
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {footer.copyrightHolder}. Todos los derechos reservados.</p>
          <p>Villavicencio, Colombia</p>
        </div>
      </div>
    </footer>
  );
}
