"use client";

import { useEffect, useState } from "react";

const defaultWords = ["Desarrollo Web", "Marketing Digital", "Producción Audiovisual"];

type TypewriterProps = {
  initialDelay?: number;
  words?: readonly string[];
};

export function Typewriter({ initialDelay = 1_200, words = defaultWords }: TypewriterProps) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (!words.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let wordIndex = 0;
    let characterIndex = words[0]?.length ?? 0;
    let deleting = true;
    let timer = 0;
    let active = true;

    const tick = () => {
      if (!active) return;

      const word = words[wordIndex] ?? "";

      if (deleting) {
        characterIndex -= 1;
        setText(word.slice(0, Math.max(0, characterIndex)));

        if (characterIndex <= 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          timer = window.setTimeout(tick, 350);
          return;
        }

        timer = window.setTimeout(tick, 35);
        return;
      }

      const nextWord = words[wordIndex] ?? "";
      characterIndex += 1;
      setText(nextWord.slice(0, characterIndex));

      if (characterIndex >= nextWord.length) {
        deleting = true;
        timer = window.setTimeout(tick, 1_200);
        return;
      }

      timer = window.setTimeout(tick, 70);
    };

    timer = window.setTimeout(tick, initialDelay);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [initialDelay, words]);

  return (
    <>
      <span aria-hidden="true" className="inline [overflow-wrap:anywhere]">
        {text}
        <span className="ml-1 inline-block h-[0.82em] w-[3px] animate-pulse rounded-full bg-violet-300 align-[-0.04em] shadow-[0_0_18px_rgba(196,181,253,0.85)] motion-reduce:hidden" />
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </>
  );
}
