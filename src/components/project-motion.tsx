"use client";

import { useEffect, useRef, type ReactNode } from "react";

import styles from "./project-study.module.css";

export function ProjectMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = root.current;
    if (!container || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal]"));
    const timeline = container.querySelector<HTMLElement>("[data-scroll-timeline]");
    const nodes = Array.from(container.querySelectorAll<HTMLElement>("[data-scroll-node]"));
    let frame = 0;
    // The line follows the viewport's reading point; it never runs on a timer.
    const updateTimeline = () => {
      frame = 0;
      if (!timeline || !nodes.length) return;
      if (preference.matches) {
        timeline.removeAttribute("data-scroll-ready");
        timeline.style.removeProperty("--scroll-progress");
        return;
      }
      const centers = nodes.map((node) => {
        const bounds = node.getBoundingClientRect();
        return bounds.top + bounds.height / 2;
      });
      const readingPoint = window.innerHeight * .68;
      const progress = Math.max(0, Math.min(1, (readingPoint - centers[0]) / (centers[centers.length - 1] - centers[0])));
      timeline.setAttribute("data-scroll-ready", "true");
      timeline.style.setProperty("--scroll-progress", String(progress));
      const active = centers.reduce((last, center, index) => center <= readingPoint ? index : last, -1);
      nodes.forEach((node, index) => {
        node.toggleAttribute("data-reached", index <= active);
        node.toggleAttribute("data-active", index === active);
      });
    };
    const scheduleTimeline = () => {
      if (!frame) frame = window.requestAnimationFrame(updateTimeline);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-visible", "true");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const revealAll = () => {
      scheduleTimeline();
      if (!preference.matches) return;
      targets.forEach((target) => target.setAttribute("data-visible", "true"));
      observer.disconnect();
    };
    if (!preference.matches) {
      targets.forEach((target) => {
        target.setAttribute("data-motion", "ready");
        observer.observe(target);
      });
    }
    preference.addEventListener("change", revealAll);
    window.addEventListener("scroll", scheduleTimeline, { passive: true });
    window.addEventListener("resize", scheduleTimeline, { passive: true });
    updateTimeline();
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", revealAll);
      window.removeEventListener("scroll", scheduleTimeline);
      window.removeEventListener("resize", scheduleTimeline);
      window.cancelAnimationFrame(frame);
      timeline?.removeAttribute("data-scroll-ready");
      targets.forEach((target) => target.removeAttribute("data-motion"));
    };
  }, []);
  return <div className={styles.study} ref={root}>{children}</div>;
}
