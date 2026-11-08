import Image from "next/image";

import { LandimotosHeroVideo } from "@/components/landimotos-hero-video";
import type { ProjectGalleryItem } from "@/data/projects";
import styles from "./landimotos-case-study.module.css";

export type LandimotosProductVideo = {
  src: string;
  type: "video/mp4" | "video/webm";
  width: number;
  height: number;
};

/** Show the product recording, or a still image when no video is configured. */
export function LandimotosHeroMedia({ image, video }: {
  image: ProjectGalleryItem;
  video?: LandimotosProductVideo;
}) {
  if (video) return <LandimotosHeroVideo key={video.src} poster={image.src} video={video} />;

  // The original PNG is only 205 KB: keep its native resolution and crisp UI text.
  return <Image
    src={image.src}
    alt={image.alt}
    width={image.width}
    height={image.height}
    className={styles.heroMedia}
    preload
    unoptimized
  />;
}
