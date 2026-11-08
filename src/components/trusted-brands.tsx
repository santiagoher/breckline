import Image from "next/image";

import { brands } from "@/data/site";

export function TrustedBrands() {
  return (
    <section
      aria-labelledby="marcas-title"
      className="trusted-brands-stage relative overflow-hidden bg-night pb-20 pt-8 text-white sm:pb-24 sm:pt-10 lg:pb-28 lg:pt-12"
    >
      <div
        aria-hidden="true"
        className="trusted-brands-ambient pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(91,33,182,0.2),transparent_58%),radial-gradient(circle_at_88%_70%,rgba(30,64,175,0.08),transparent_32%)]"
      />
      <div className="section-shell relative">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <h2
            className="text-balance font-display text-3xl font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-5xl"
            id="marcas-title"
          >
            Marcas que confían en Breckline
          </h2>
        </div>

        <ul className="scroll-reveal mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:mt-14 sm:grid-cols-4 sm:gap-x-8 sm:gap-y-10">
          {brands.map((brand) => (
            <li
              className="group flex h-24 items-center justify-center"
              key={brand.id}
            >
              <span className="relative block h-20 w-full max-w-44">
                <Image
                  alt={brand.logo.alt}
                  className={`object-contain opacity-80 transition duration-500 group-hover:opacity-100 group-hover:drop-shadow-[0_0_16px_rgba(196,181,253,0.28)] ${brand.monochrome ? "brightness-0 invert" : "grayscale brightness-150"}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 640px) 11rem, 42vw"
                  src={brand.logo.src}
                  unoptimized
                />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
