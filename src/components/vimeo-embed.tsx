"use client";

import { useState } from "react";

type VimeoEmbedProps = {
  videoId: string;
  title: string;
  orientation?: "portrait" | "landscape";
};

export function VimeoEmbed({ videoId, title, orientation = "landscape" }: VimeoEmbedProps) {
  const [active, setActive] = useState(false);
  const aspectClass = orientation === "portrait" ? "aspect-[9/16]" : "aspect-video";

  return (
    <div
      className={`interactive-card relative overflow-hidden rounded-2xl border border-violet-400/25 bg-night shadow-[0_22px_60px_rgba(8,5,24,0.42)] ${aspectClass}`}
    >
      {active ? (
        <iframe
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0 bg-night"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={`https://player.vimeo.com/video/${videoId}?autoplay=1&badge=0&dnt=1`}
          title={title}
        />
      ) : (
        <button
          aria-label={`Reproducir ${title}`}
          className="focus-ring group absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#8b5cf6_0%,#312e81_34%,#090814_76%)] px-6 text-center text-white"
          onClick={() => setActive(true)}
          type="button"
        >
          <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(196,181,253,0.2)_50%,transparent_100%)] transition duration-700 group-hover:scale-110" />
          <span className="absolute inset-0 bg-gradient-to-t from-night/65 via-transparent to-violet-300/5" />
          <span className="relative grid size-16 place-items-center rounded-full border border-white/40 bg-white/95 text-violet-700 shadow-[0_16px_45px_rgba(124,58,237,0.45)] transition duration-300 group-hover:scale-110 group-hover:bg-violet-100 group-hover:text-violet-900">
            <svg aria-hidden="true" className="ml-1 size-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.5v13l10-6.5L8 5.5Z" />
            </svg>
          </span>
          <span className="relative mt-5 max-w-xs text-sm font-bold tracking-wide">{title}</span>
          <span className="relative mt-1 text-xs text-lavender/75">Video alojado en Vimeo</span>
        </button>
      )}
    </div>
  );
}
