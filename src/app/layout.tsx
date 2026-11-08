import type { Metadata, Viewport } from "next";
import "@fontsource-variable/montserrat";
import "./globals.css";

import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const description =
  "Agencia digital en Colombia especializada en desarrollo web, posicionamiento SEO y producción audiovisual para convertir audiencia en clientes.";

const homeIntroBootstrap = `(() => {
  const root = document.documentElement;
  let previousScrollRestoration = null;
  const clearIntroClasses = () => {
    root.classList.remove("intro-ready", "intro-running");
    root.classList.add("intro-complete");
  };

  try {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const maskSupported =
      window.CSS &&
      (CSS.supports("mask-image", "linear-gradient(#000, transparent)") ||
        CSS.supports("-webkit-mask-image", "linear-gradient(#000, transparent)"));

    if (window.location.pathname !== "/" || reducedMotion || !maskSupported) return;

    const debug = new URLSearchParams(window.location.search).get("debugIntro") === "1";
    previousScrollRestoration = history.scrollRestoration;
    const state = {
      active: true,
      cleanup: null,
      debug,
      finish: null,
      finished: false,
      hardFinishTimer: 0,
      previousScrollRestoration,
      started: false,
    };

    const finish = () => {
      if (state.finished) return;
      state.finished = true;
      state.active = false;
      window.clearTimeout(state.hardFinishTimer);
      try {
        state.cleanup?.();
      } catch {}
      try {
        history.scrollRestoration = state.previousScrollRestoration;
      } catch {}
      document.querySelector("[data-home-intro-interactions]")?.removeAttribute("inert");
      clearIntroClasses();
    };

    state.finish = finish;
    window.__brecklineHomeIntro = state;
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    root.classList.remove("intro-complete");
    root.classList.add("intro-ready");
    state.hardFinishTimer = window.setTimeout(finish, debug ? 8_000 : 3_000);
  } catch {
    if (previousScrollRestoration) history.scrollRestoration = previousScrollRestoration;
    clearIntroClasses();
  }
})();`;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Breckline | Desarrollo web y marketing digital",
    template: "%s | Breckline",
  },
  description,
  applicationName: "Breckline",
  authors: [{ name: "Breckline", url: siteUrl }],
  creator: "Breckline",
  publisher: "Breckline",
  category: "technology",
  keywords: [
    "desarrollo web",
    "agencia digital",
    "landing pages",
    "SEO",
    "producción audiovisual",
    "Colombia",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/",
    siteName: "Breckline",
    title: "Breckline | Desarrollo web y marketing digital",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Breckline | Desarrollo web y marketing digital",
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#080811",
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Breckline",
  url: siteUrl.toString(),
  description,
  areaServed: {
    "@type": "Country",
    name: "Colombia",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Villavicencio",
    addressCountry: "CO",
  },
  email: "breckline.corporativo@gmail.com",
  telephone: "+573015972406",
  sameAs: ["https://www.instagram.com/breckline.agency/"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: homeIntroBootstrap }} id="breckline-home-intro" />
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/tht5hss.css" />
      </head>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
