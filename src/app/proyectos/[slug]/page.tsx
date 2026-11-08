import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { CookieConsent } from "@/components/cookie-consent";
import { ArrowIcon } from "@/components/icons";
import { LandimotosProcessShowcase } from "@/components/landimotos-process-showcase";
import { LandimotosCaseStudy } from "@/components/landimotos-case-study";
import { ProjectGallery } from "@/components/project-gallery";
import { ProjectVisual } from "@/components/project-visual";
import { ProjectMotion } from "@/components/project-motion";
import styles from "@/components/project-study.module.css";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { portfolioProjects } from "@/data/projects";
import { isProjectImageReady } from "@/lib/project-media";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return portfolioProjects.filter((project) => project.caseStudy).map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = portfolioProjects.find((item) => item.id === slug && item.caseStudy);
  if (!project?.caseStudy) notFound();
  const title = `${project.title} | Breckline`;
  const description = project.caseStudy.seoDescription;
  return {
    title: project.title,
    description,
    alternates: { canonical: project.href },
    openGraph: { title, description, url: project.href, type: "website", locale: "es_CO", siteName: "Breckline", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Breckline, desarrollo web y marketing digital" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/twitter-image"] },
  };
}

const areas = [
  { title: "Operación", keywords: "Despachos · Facturas · Revisiones", detail: "Control del flujo diario.", items: "Despachos / Facturas / Históricos", preview: "invoices", anchor: "gallery-operacion" },
  { title: "Logística", keywords: "Mensajeros · Rutas · Entregas", detail: "Coordinación del movimiento.", items: "Mensajeros / Rutas / Entregas", preview: "messengers", anchor: "gallery-logistica" },
  { title: "Administración + Analítica", keywords: "Usuarios · Indicadores · Históricos", detail: "Control y visibilidad.", items: "Usuarios / Permisos / Dashboards", preview: "dashboard", anchor: "gallery-analitica" },
];

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = portfolioProjects.find((item) => item.id === slug && item.caseStudy);
  if (!project?.caseStudy) notFound();
  const study = project.caseStudy;
  const hero = project.id === "portal-logistico-landimotos" ? {
    ...study.hero,
    id: "operational-panel",
    src: "/assets/images/Intranet landimotos panel operativo.png",
    caption: "Panel operativo de Landimotos",
    alt: "Panel operativo de la intranet Landimotos con el registro de facturas por punto, área, revisor, mesa y fecha.",
    width: 2559,
    height: 1352,
    placeholder: false,
  } : { ...study.hero, placeholder: !isProjectImageReady(study.hero) };
  const gallery = study.gallery.map((group) => ({ ...group, items: group.items.map((item) => ({ ...item, placeholder: !isProjectImageReady(item) })) }));
  const nextProject = portfolioProjects.slice(portfolioProjects.indexOf(project) + 1).find((item) => item.href);

  if (project.id === "portal-logistico-landimotos") return <>
    <ScrollProgress />
    <SiteHeader />
    <ProjectMotion>
      <main id="contenido" className={styles.page}>
        <LandimotosCaseStudy
          study={study}
          hero={hero}
          video={{ src: "/assets/videos/landimotos-demo-operativo.mp4", type: "video/mp4", width: 2560, height: 1440 }}
          gallery={gallery}
          nextProject={nextProject}
        />
      </main>
    </ProjectMotion>
    <SiteFooter />
    <CookieConsent />
  </>;

  return <>
    <ScrollProgress />
    <SiteHeader />
    <ProjectMotion>
      <main id="contenido" className={styles.page}>
        <section className={`${styles.wide} ${styles.hero}`} aria-labelledby="project-title">
          <Link href="/#proyectos" className={`${styles.back} focus-ring`}><ArrowIcon className="size-4 rotate-180" /> Todos los proyectos</Link>
          <div className={styles.heroGrid}>
            <div className="hero-reveal">
              <p className={styles.eyebrow}>Software interno</p>
              <h1 id="project-title" className={styles.heroTitle}>PORTAL LOGÍSTICO<br /><span>LANDIMOTOS</span></h1>
              <p className={styles.heroSummary}>Una plataforma interna que conecta operación, logística y análisis.</p>
              <p className={styles.heroStack}>React · TypeScript · Tailwind · Supabase</p>
              <p className={styles.heroRole}>Diseño + Desarrollo</p>
            </div>
            <figure className={`${styles.heroVisual} hero-reveal`}>
              <div className={styles.heroScreen}><ProjectVisual item={hero} hero /></div>
              <figcaption><span>Dashboard operativo</span><span aria-hidden="true">↗</span></figcaption>
            </figure>
          </div>
          <div className={styles.heroFoot}><span>LANDIMOTOS / BREKLINE</span><a className="focus-ring" href="#galeria">Explorar producto <span aria-hidden="true">↓</span></a></div>
        </section>

        <section id="enfoque" aria-labelledby="enfoque-title" className={`${styles.shell} ${styles.section}`}>
          <div className={styles.contextHeading} data-reveal><p className={styles.eyebrow}>01 / Conectar las piezas</p><h2 id="enfoque-title" className={styles.title}>UNA OPERACIÓN.<br /><span>UNA MISMA PLATAFORMA.</span></h2></div>
          <div className={styles.convergence} data-reveal="flow" role="img" aria-label="Facturas, mensajeros, personal, atención y revisiones se conectan en el Portal Logístico.">
            <div className={styles.sources} aria-hidden="true">{["Facturas", "Mensajeros", "Personal", "Atención", "Revisiones"].map((name, index) => <span style={{ "--i": index } as CSSProperties} key={name}><i />{name}</span>)}</div>
            <svg className={styles.connectors} aria-hidden="true" viewBox="0 0 460 300" preserveAspectRatio="none" fill="none">{[30, 90, 150, 210, 270].map((y, index) => <path key={y} pathLength="1" style={{ "--i": index } as CSSProperties} d={`M0 ${y} H100 C230 ${y} 200 150 330 150 H460`} />)}</svg>
            <div className={styles.destination} aria-hidden="true"><span className={styles.portalMark}>L<span>↗</span></span><strong>PORTAL<br />LOGÍSTICO</strong><span className={styles.destinationMeta}>Una fuente de información</span></div>
          </div>
          <div className={styles.challenge}>{[{ title: "El reto", text: "Procesos distribuidos entre diferentes áreas." }, { title: "La solución", text: "Una plataforma común para conectar la operación." }].map((item, index) => <article data-reveal key={item.title}><span className={styles.bigNumber} aria-hidden="true">0{index + 1}</span><div><h3 className={styles.eyebrow}>{item.title}</h3><p>{item.text}</p></div></article>)}</div>
        </section>

        <section id="alcance" aria-labelledby="alcance-title" className={`${styles.shell} ${styles.section}`}>
          <div className={styles.sectionHeading} data-reveal><p className={styles.eyebrow}>02 / Áreas</p><h2 id="alcance-title" className={styles.title}>MÁS QUE UN<br /><span>DASHBOARD.</span></h2></div>
          <div className={styles.areas}>{areas.map((area, index) => {
            const preview = gallery.flatMap((group) => group.items).find((item) => item.id === area.preview) ?? hero;
            return <a href={`#${area.anchor}`} key={area.title} className={`${styles.area} focus-ring`}><span className={styles.areaNumber}>0{index + 1}</span><div className={styles.areaCopy}><h3>{area.title}</h3><p>{area.keywords}</p></div><div className={styles.areaPreview} aria-hidden="true"><ProjectVisual item={preview} /></div><span className={styles.areaArrow} aria-hidden="true">↗</span></a>;
          })}</div>
        </section>

        {project.id === "portal-logistico-landimotos" && <LandimotosProcessShowcase />}

        <section id="galeria" aria-labelledby="galeria-title" className={styles.product}>
          <div className={`${styles.shell} ${styles.productHeading}`} data-reveal><p className={styles.eyebrow}>03 / Interfaces</p><h2 id="galeria-title" className={styles.title}>PRODUCTO<br /><span>EN ACCIÓN.</span></h2></div>
          <ProjectGallery groups={gallery} />
        </section>

        <section aria-label="Una plataforma, cinco áreas, una sola fuente de información" className={styles.statement}>
          <div className={styles.ghostWords} aria-hidden="true"><span>OPERACIÓN — LOGÍSTICA — PERSONAL</span><span>ATENCIÓN — ANALÍTICA — OPERACIÓN</span></div>
          <div className={styles.shell}><p data-reveal="lines" className={styles.statementText}>{["UNA PLATAFORMA.", "CINCO ÁREAS.", "UNA SOLA FUENTE", "DE INFORMACIÓN."].map((line, index) => <span key={line} style={{ "--i": index } as CSSProperties}>{line}</span>)}</p></div>
        </section>

        <section id="modulos" aria-labelledby="modulos-title" className={`${styles.shell} ${styles.section}`}>
          <div data-reveal className={styles.sectionHeading}><p className={styles.eyebrow}>04 / Capacidades</p><h2 id="modulos-title" className={styles.title}>TRES FRENTES<br /><span>DE TRABAJO.</span></h2></div>
          <div className={styles.fronts}>{areas.map((area, index) => <article data-reveal key={area.title}><span className={styles.frontNumber}>0{index + 1}</span><h3>{area.title}</h3><p>{area.detail}</p><ul>{area.items.split(" / ").map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
          <details className={styles.details}><summary className="focus-ring">Permisos, configuración y atención <span aria-hidden="true">+</span></summary><div className={styles.detailGrid}><p><strong>Acceso por rol.</strong> Administración de usuarios, permisos y parámetros por punto o sucursal. Cada operativo accede a sus módulos habilitados.</p><p><strong>Configuración desde la plataforma.</strong> Áreas, revisores y mesas; atención al cliente, WhatsApp y seguimiento. Disponibilidad, horarios y almuerzos del equipo.</p></div></details>
        </section>

        <section id="arquitectura" aria-labelledby="arquitectura-title" className={`${styles.architecture} ${styles.section}`}>
          <div className={styles.shell}>
            <div className={styles.architectureHeading} data-reveal><p className={styles.eyebrow}>05 / Arquitectura</p><h2 id="arquitectura-title" className={styles.title}>UNA ESTRUCTURA<br /><span>CONECTADA.</span></h2></div>
            <div className={styles.timeline} data-scroll-timeline>
              <span className={styles.track} aria-hidden="true"><span data-scroll-line /></span>
              <ol aria-label="Flujo conceptual de la aplicación">{study.layers.map((layer, index) => <li key={layer.title} data-scroll-node className={styles.timelineNode}><span className={styles.nodeDot} aria-hidden="true" /><span className={styles.nodeIndex}>0{index + 1}</span><div><h3>{layer.title}</h3><p>{["Acceso por permisos", "Interfaces modulares", "Datos compartidos", "Consulta y análisis"][index]}</p></div></li>)}</ol>
            </div>
            <p className={styles.architectureNote}>Trazabilidad de principio a fin.</p>
          </div>
        </section>

        <section id="tecnologias" aria-labelledby="stack-title" className={`${styles.shell} ${styles.stack}`}><h2 id="stack-title" className={styles.eyebrow}>Built with</h2><ul>{["React", "TypeScript", "Tailwind", "Supabase"].map((tech) => <li key={tech}>{tech}</li>)}</ul></section>

        <section id="participacion" aria-labelledby="participacion-title" className={`${styles.shell} ${styles.section} ${styles.contribution}`}>
          <div data-reveal><p className={styles.eyebrow}>06 / Mi participación</p><h2 id="participacion-title" className={styles.title}>DE LA IDEA<br /><span>AL PRODUCTO.</span></h2></div><p>Diseño y desarrollo de la plataforma desde la experiencia hasta su implementación.</p>
          <ul>{study.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section aria-labelledby="cierre-title" className={styles.closing}>
          <div className={styles.shell} data-reveal><h2 id="cierre-title">SOFTWARE DISEÑADO<br />ALREDEDOR DE UNA<br /><span>OPERACIÓN REAL.</span></h2><p className={styles.closingName}>{project.title}</p><nav aria-label="Navegación de proyectos" className={styles.projectNav}><Link href="/#proyectos" className="focus-ring"><ArrowIcon className="size-4 rotate-180" /> Todos los proyectos</Link>{nextProject?.href && <Link href={nextProject.href} className="focus-ring" aria-label={`Siguiente proyecto: ${nextProject.title}`}>Siguiente proyecto <ArrowIcon className="size-4" /></Link>}</nav></div>
          <div className={styles.closingScreen} data-reveal="screen" aria-hidden="true"><ProjectVisual item={hero} /></div>
        </section>
      </main>
    </ProjectMotion>
    <SiteFooter />
    <CookieConsent />
  </>;
}
