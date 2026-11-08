import { existsSync } from "node:fs";
import path from "node:path";

import type { ProjectGalleryItem } from "@/data/projects";

// Server-only check, evaluated when the static page is built. Missing or unapproved
// assets never reach next/image; the page supplies a conceptual visual instead.
// Rebuild after replacing assets.
export function isProjectImageReady(item: ProjectGalleryItem): boolean {
  if (item.placeholder || !item.src.startsWith("/projects/")) return false;
  const root = path.resolve(process.cwd(), "public", "projects");
  const file = path.resolve(process.cwd(), "public", `.${item.src}`);
  return file.startsWith(`${root}${path.sep}`) && existsSync(file);
}
