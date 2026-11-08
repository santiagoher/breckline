"use client";

import { gsap } from "gsap";
import { useLayoutEffect } from "react";

type HomeIntroState = {
  active: boolean;
  cleanup: (() => void) | null;
  debug: boolean;
  finish: (() => void) | null;
  finished: boolean;
  hardFinishTimer: number;
  previousScrollRestoration: ScrollRestoration;
  started: boolean;
  timeline?: gsap.core.Timeline | null;
};

type IntroWindow = Window & {
  __brecklineHomeIntro?: HomeIntroState;
};

let activeControllerGeneration = 0;

const introSelectors = [
  "[data-home-intro-reveal]",
  "[data-home-intro-glow]",
  "[data-home-intro-pattern]",
  "[data-home-intro-vignette]",
  "[data-home-intro-title]",
  "[data-home-intro-description]",
  "[data-home-intro-buttons]",
  "[data-home-intro-visual]",
].join(", ");

export function HomeIntroController() {
  useLayoutEffect(() => {
    const generation = ++activeControllerGeneration;
    const root = document.documentElement;
    const state = (window as IntroWindow).__brecklineHomeIntro;

    if (!state?.active || state.finished) return;

    const stage = document.querySelector<HTMLElement>(".hero-stage");
    const reveal = document.querySelector<HTMLElement>("[data-home-intro-reveal]");
    const glow = document.querySelector<HTMLElement>("[data-home-intro-glow]");
    const pattern = document.querySelector<HTMLElement>("[data-home-intro-pattern]");
    const vignette = document.querySelector<HTMLElement>("[data-home-intro-vignette]");
    const title = document.querySelector<HTMLElement>("[data-home-intro-title]");
    const description = document.querySelector<HTMLElement>("[data-home-intro-description]");
    const buttons = document.querySelector<HTMLElement>("[data-home-intro-buttons]");
    const visual = document.querySelector<HTMLElement>("[data-home-intro-visual]");
    const interactionRoot = document.querySelector<HTMLElement>("[data-home-intro-interactions]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scrollKeys = new Set(["ArrowDown", "ArrowUp", "End", "Home", "PageDown", "PageUp", " "]);

    if (!stage || !reveal || !glow || !pattern || !vignette || !title || !description || !buttons || !visual) {
      state.finish?.();
      return;
    }

    let finished = false;
    let fallbackTimer = 0;
    let intro: gsap.core.Timeline | null = null;
    let detachRuntimeListeners = () => {};

    const clearAnimatedProperties = () => {
      gsap.set(document.querySelectorAll<HTMLElement>(introSelectors), {
        clearProps: "opacity,transform,willChange,maskPosition,webkitMaskPosition",
      });
    };

    const completeIntro = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(fallbackTimer);
      detachRuntimeListeners();

      root.classList.remove("intro-ready", "intro-running");
      root.classList.add("intro-complete");
      clearAnimatedProperties();
      state.timeline = null;

      if (interactionRoot) interactionRoot.inert = false;
      state.finish?.();
    };

    if (reducedMotion.matches) {
      completeIntro();
      return;
    }

    if (interactionRoot) interactionRoot.inert = true;

    const preventScroll = (event: Event) => event.preventDefault();
    const preventKeyboardScroll = (event: KeyboardEvent) => {
      const target = event.target;
      const interactiveTarget =
        target instanceof HTMLElement &&
        Boolean(target.closest("a, button, input, select, textarea, [contenteditable='true']"));

      if (!interactiveTarget && scrollKeys.has(event.key)) event.preventDefault();
    };
    const handleMotionPreference = (event: MediaQueryListEvent) => {
      if (event.matches) completeIntro();
    };

    detachRuntimeListeners = () => {
      reducedMotion.removeEventListener("change", handleMotionPreference);
      window.removeEventListener("keydown", preventKeyboardScroll);
      window.removeEventListener("pagehide", completeIntro);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("wheel", preventScroll);
    };

    reducedMotion.addEventListener("change", handleMotionPreference);
    window.addEventListener("keydown", preventKeyboardScroll);
    window.addEventListener("pagehide", completeIntro, { once: true });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("wheel", preventScroll, { passive: false });

    const patternOpacity = Number.parseFloat(
      getComputedStyle(stage).getPropertyValue("--hero-pattern-opacity"),
    );
    const patternStartScale = Number.parseFloat(
      getComputedStyle(stage).getPropertyValue("--hero-pattern-start-scale"),
    );
    const mobileDurationFactor = window.matchMedia("(max-width: 639px)").matches ? 0.85 : 1;
    const timeScale = state.debug ? 0.35 : 1 / mobileDurationFactor;

    window.clearTimeout(state.hardFinishTimer);
    state.hardFinishTimer = 0;
    state.started = true;
    root.classList.add("intro-running");

    intro = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: completeIntro,
    });
    if (state.debug) state.timeline = intro;

    intro
      .fromTo(
        glow,
        { opacity: 0.42, scale: 0.97 },
        { duration: 1.27, ease: "power3.out", opacity: 1, scale: 1 },
        0.08,
      )
      .fromTo(
        pattern,
        { opacity: 0.01, scale: Number.isFinite(patternStartScale) ? patternStartScale : 1.018 },
        {
          duration: 1.06,
          ease: "power3.out",
          opacity: Number.isFinite(patternOpacity) ? patternOpacity : 0.28,
          scale: 1,
        },
        0.14,
      )
      .fromTo(
        vignette,
        { opacity: 0.6 },
        { duration: 1.27, ease: "power3.out", opacity: 1 },
        0.08,
      )
      .fromTo(
        reveal,
        { maskPosition: "0 100%", webkitMaskPosition: "0 100%" },
        {
          duration: 0.9,
          ease: "power4.inOut",
          maskPosition: "0 0%",
          webkitMaskPosition: "0 0%",
        },
        0.16,
      )
      .fromTo(
        title,
        { opacity: 0.35, y: 16 },
        { duration: 0.65, ease: "power3.out", opacity: 1, y: 0 },
        0.26,
      )
      .fromTo(
        description,
        { opacity: 0.4, y: 12 },
        { duration: 0.6, ease: "power3.out", opacity: 1, y: 0 },
        0.38,
      )
      .fromTo(
        buttons,
        { opacity: 0.5, y: 10 },
        { duration: 0.55, ease: "power3.out", opacity: 1, y: 0 },
        0.45,
      )
      .fromTo(
        visual,
        { opacity: 0.55, scale: 0.99, y: 18 },
        { duration: 0.8, ease: "power3.out", opacity: 1, scale: 1, y: 0 },
        0.52,
      );

    intro.timeScale(timeScale);
    fallbackTimer = window.setTimeout(
      completeIntro,
      (intro.duration() / timeScale) * 1_000 + 500,
    );

    const cleanupRuntime = () => {
      window.clearTimeout(fallbackTimer);
      detachRuntimeListeners();
      intro?.kill();
      state.timeline = null;
      if (interactionRoot) interactionRoot.inert = false;
    };
    state.cleanup = cleanupRuntime;

    return () => {
      cleanupRuntime();
      if (state.cleanup === cleanupRuntime) state.cleanup = null;

      window.setTimeout(() => {
        if (activeControllerGeneration === generation) completeIntro();
      }, 0);
    };
  }, []);

  return null;
}
