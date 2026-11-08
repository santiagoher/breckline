"use client";

import { useEffect, useRef, type ReactNode } from "react";

import styles from "./landimotos-hero-motion.module.css";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => value * value * (3 - 2 * value);

/** Scroll changes presentation only; the media stays mounted and owns playback. */
export function LandimotosHeroMotion({ copy, children }: { copy: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    const product = visual.current;
    if (!container || !product) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let needsMeasure = true;
    let disposed = false;
    let start = 0;
    let riseDistance = 1;
    let releaseDistance = 1;
    let lift = 0;
    let copyLift = 0;

    const reset = () => {
      container.style.removeProperty("--hero-copy-y");
      container.style.removeProperty("--hero-copy-opacity");
      container.style.removeProperty("--hero-visual-y");
    };

    const update = () => {
      frame = 0;
      if (preference.matches) return;

      if (needsMeasure) {
        const mobile = window.innerWidth < 768;
        const top = container.getBoundingClientRect().top + window.scrollY;
        lift = mobile ? 18 : 56;
        copyLift = mobile ? 24 : 72;
        start = Math.max(0, top - window.innerHeight * .25);
        // Read untransformed layout, so our own movement never feeds back into progress.
        const restingTop = top + product.offsetTop;
        const destination = Math.max(48, window.innerHeight * .1);
        riseDistance = Math.max(120, Math.min(mobile ? 180 : 320, restingTop - start - lift - destination));
        releaseDistance = Math.max(140, product.offsetHeight * .65);
        needsMeasure = false;
      }

      const distance = Math.max(0, window.scrollY - start);
      const progress = smoothstep(clamp(distance / riseDistance));
      const release = smoothstep(clamp((distance - riseDistance) / releaseDistance));
      container.style.setProperty("--hero-copy-y", `${-copyLift * progress}px`);
      container.style.setProperty("--hero-copy-opacity", String(1 - progress));
      // Ease back into normal flow before the next section; no extra scroll height or sticky exit.
      container.style.setProperty("--hero-visual-y", `${-lift * progress * (1 - release)}px`);
    };

    const schedule = () => {
      if (!frame && !preference.matches) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      needsMeasure = true;
      schedule();
    };
    const motionChanged = () => {
      window.removeEventListener("scroll", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (preference.matches) {
        reset();
      } else {
        window.addEventListener("scroll", schedule, { passive: true });
        measure();
      }
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("resize", measure, { passive: true });
    preference.addEventListener("change", motionChanged);
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    motionChanged();

    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      preference.removeEventListener("change", motionChanged);
      if (frame) window.cancelAnimationFrame(frame);
      reset();
    };
  }, []);

  return <div ref={root} className={styles.presentation} data-landimotos-hero>
    <div className={styles.copy}>{copy}</div>
    <div ref={visual} className={styles.visual}>{children}</div>
  </div>;
}
