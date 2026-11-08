import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";
import { portfolioProjects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return [
    ...portfolioProjects.filter((project) => project.caseStudy && project.href).map((project) => ({
      changeFrequency: "monthly" as const,
      priority: 0.8,
      url: new URL(project.href!, siteUrl).toString(),
    })),
    {
      changeFrequency: "weekly",
      priority: 1,
      url: new URL("/", siteUrl).toString(),
    },
    {
      changeFrequency: "monthly",
      priority: 0.8,
      url: new URL("/landing-page", siteUrl).toString(),
    },
    {
      changeFrequency: "yearly",
      priority: 0.3,
      url: new URL("/politica-de-privacidad", siteUrl).toString(),
    },
  ];
}
