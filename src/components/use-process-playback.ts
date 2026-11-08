"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import type { ProcessScenario } from "@/data/landimotos-processes";
import {
  initialProcessPlayback,
  ProcessPlaybackClock,
  reduceProcessPlayback,
  STEP_REVEAL_MS,
  type ProcessPlaybackEvent,
  type ProcessPlaybackState,
} from "./process-playback-controller";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function useProcessPlayback(processes: readonly ProcessScenario[]) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [playback, dispatch] = useReducer(
    (state: ProcessPlaybackState, event: ProcessPlaybackEvent) => reduceProcessPlayback(state, event, processes),
    initialProcessPlayback,
  );
  const [clock] = useState(() => new ProcessPlaybackClock({
    now: () => performance.now(),
    setTimeout: (callback, delay) => window.setTimeout(callback, delay),
    clearTimeout: (id) => window.clearTimeout(id),
  }));
  const reducedMotion = playback.manualReducedMotion || (playback.systemReducedMotion ?? true);
  const playing = playback.status === "running" && playback.entered && playback.visible && !reducedMotion;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    const preference = window.matchMedia(REDUCED_MOTION_QUERY);

    const updateViewport = (outside: boolean, visibleArea: number, availableArea: number) => {
      if (disposed) return;
      if (outside) clock.reset();
      dispatch({ type: "viewport", outside, sufficientlyVisible: availableArea > 0 && visibleArea / availableArea >= 0.35 });
    };
    const measure = () => {
      const bounds = root.getBoundingClientRect();
      const width = Math.max(0, Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0));
      const height = Math.max(0, Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0));
      // A tall mobile window should start when 35% of the available viewport is occupied.
      const availableArea = Math.min(bounds.width, window.innerWidth) * Math.min(bounds.height, window.innerHeight);
      updateViewport(width * height === 0, width * height, availableArea);
    };
    const updateVisibility = () => {
      const visible = document.visibilityState === "visible";
      if (!visible) clock.pause();
      else measure();
      dispatch({ type: "visibility", visible });
    };
    const updateMotion = () => {
      if (preference.matches) clock.reset();
      dispatch({ type: "system-motion", reduced: preference.matches });
    };

    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("resize", measure, { passive: true });

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry) return;
        const viewportWidth = entry.rootBounds?.width ?? window.innerWidth;
        const viewportHeight = entry.rootBounds?.height ?? window.innerHeight;
        const availableArea = Math.min(entry.boundingClientRect.width, viewportWidth)
          * Math.min(entry.boundingClientRect.height, viewportHeight);
        updateViewport(!entry.isIntersecting || entry.intersectionRatio <= 0,
          entry.intersectionRect.width * entry.intersectionRect.height, availableArea);
      }, { threshold: Array.from({ length: 101 }, (_, index) => index / 100) });
      observer.observe(root);
    } else {
      window.addEventListener("scroll", measure, { passive: true });
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      clock.pause();
    };
  }, [clock]);

  useEffect(() => {
    if (!playing) return;
    const step = processes[playback.scenarioIndex]?.steps[playback.stepIndex];
    if (!step) return;
    const phase = playback.revealedStep === playback.stepIndex ? "finish" : "reveal";
    const duration = phase === "reveal" ? STEP_REVEAL_MS
      : Math.max(1_500, Math.min(2_500, step.durationMs)) - STEP_REVEAL_MS;
    const runId = playback.runId;
    const stepIndex = playback.stepIndex;
    clock.schedule(`${runId}:${stepIndex}:${phase}`, duration, () => {
      // Visibility can change between the browser callback and React's commit.
      if (document.visibilityState !== "visible") {
        dispatch({ type: "visibility", visible: false });
        return;
      }
      dispatch({ type: phase, runId, stepIndex });
    });
    return () => clock.pause();
  }, [clock, playing, playback.runId, playback.scenarioIndex, playback.stepIndex, playback.revealedStep, processes]);

  const selectScenario = useCallback((index: number) => {
    if (!Number.isFinite(index) || processes.length === 0) return;
    clock.reset();
    dispatch({ type: "select", index });
  }, [clock, processes.length]);

  const setReducedMotion = useCallback((reduced: boolean) => {
    if (reduced) clock.reset();
    dispatch({ type: "manual-motion", reduced });
  }, [clock]);

  return {
    rootRef,
    scenarioIndex: playback.scenarioIndex,
    stepIndex: playback.stepIndex,
    completedCount: playback.completedCount,
    revealedStep: playback.revealedStep,
    completed: playback.status === "completed",
    status: playback.status,
    log: playback.log,
    runId: playback.runId,
    playing,
    reducedMotion,
    systemReducedMotion: playback.systemReducedMotion ?? false,
    selectScenario,
    setReducedMotion,
  };
}
