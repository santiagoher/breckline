const fallbackUrl = "https://breckline.com";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? fallbackUrl;

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(fallbackUrl);
  }
}
