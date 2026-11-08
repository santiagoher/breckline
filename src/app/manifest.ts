import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    background_color: "#080811",
    categories: ["business", "productivity", "technology"],
    description:
      "Agencia digital colombiana especializada en desarrollo web, SEO y producción audiovisual.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    id: siteUrl.toString(),
    lang: "es-CO",
    name: "Breckline | Agencia digital",
    scope: "/",
    short_name: "Breckline",
    start_url: siteUrl.toString(),
    theme_color: "#7358fa",
  };
}
