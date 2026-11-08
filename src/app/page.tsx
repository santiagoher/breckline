import { ContactSection } from "@/components/contact-section";
import { CookieConsent } from "@/components/cookie-consent";
import { Hero } from "@/components/hero";
import { HomeIntroController } from "@/components/home-intro-controller";
import { ProjectCta } from "@/components/project-cta";
import { Projects } from "@/components/projects";
import { ScrollProgress } from "@/components/scroll-progress";
import { Services } from "@/components/services";
import { Showcase } from "@/components/showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";
import { TrustedBrands } from "@/components/trusted-brands";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <SiteHeader />
      <HomeIntroController />
      <div data-home-intro-interactions>
        <main className="bg-night" id="contenido">
          <Hero />
          <TrustedBrands />
          <Services />
          <Projects />
          <Showcase />
          <Testimonials />
          <ContactSection />
          <ProjectCta />
        </main>
        <SiteFooter />
        <CookieConsent />
      </div>
    </>
  );
}
