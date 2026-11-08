"use client";

import { useEffect, useId, useRef, useState, type SyntheticEvent } from "react";

import { PlayIcon } from "@/components/icons";
import type { LandimotosProductVideo } from "./landimotos-hero-media";
import styles from "./landimotos-hero-video.module.css";

export function LandimotosHeroVideo({ poster, video }: {
  poster: string;
  video: LandimotosProductVideo;
}) {
  const element = useRef<HTMLVideoElement>(null);
  const autoplayAttempted = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = useId();

  useEffect(() => {
    const media = element.current;
    if (!media) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => {
      if (preference.matches) media.pause();
    };
    preference.addEventListener("change", motionChanged);

    // Start only once, after checking motion preferences. Renders, viewport
    // reentry and preference changes must never override a manual pause.
    if (!autoplayAttempted.current) {
      autoplayAttempted.current = true;
      if (!preference.matches) {
        media.muted = true;
        void media.play().catch(() => {
          setIsPlaying(!media.paused && !media.ended && !media.error);
        });
      }
    }
    return () => preference.removeEventListener("change", motionChanged);
  }, []);

  function synchronize(event: SyntheticEvent<HTMLVideoElement>) {
    const media = event.currentTarget;
    setIsPlaying(!media.paused && !media.ended && !media.error);
  }

  function togglePlayback() {
    const media = element.current;
    if (!media) return;
    if (!media.paused && !media.ended) {
      media.pause();
    } else {
      void media.play().catch(() => {
        setIsPlaying(!media.paused && !media.ended && !media.error);
      });
    }
  }

  const label = isPlaying ? "Pausar video" : "Reanudar video";

  return <div className={styles.frame}>
    <div className={styles.screen}>
      <video
        ref={element}
        id={videoId}
        className={styles.video}
        width={video.width}
        height={video.height}
        style={{ aspectRatio: `${video.width} / ${video.height}` }}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        aria-label="Recorrido por la intranet Landimotos"
        onPlay={synchronize}
        onPlaying={synchronize}
        onPause={synchronize}
        onEnded={synchronize}
        onEmptied={synchronize}
        onError={synchronize}
      >
        <source src={video.src} type={video.type} />
        Tu navegador no permite reproducir este video.
      </video>
      <button className={styles.toggle} type="button" onClick={togglePlayback} aria-controls={videoId} aria-label={label} title={label}>
        {isPlaying ? <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="6" width="3" height="12" rx=".75" /><rect x="14" y="6" width="3" height="12" rx=".75" /></svg> : <PlayIcon className={styles.icon} aria-hidden="true" />}
      </button>
    </div>
  </div>;
}
