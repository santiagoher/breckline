import Link from "next/link";

import { ArrowIcon } from "@/components/icons";
import { LandimotosHeroMedia, type LandimotosProductVideo } from "@/components/landimotos-hero-media";
import { LandimotosHeroMotion } from "@/components/landimotos-hero-motion";
import { LandimotosProcessShowcase } from "@/components/landimotos-process-showcase";
import { ProjectVisual } from "@/components/project-visual";
import type { PortfolioProject, ProjectCaseStudy, ProjectGalleryItem } from "@/data/projects";
import styles from "./landimotos-case-study.module.css";

type Props = {
  study: ProjectCaseStudy;
  hero: ProjectGalleryItem;
  video?: LandimotosProductVideo;
  gallery: ProjectCaseStudy["gallery"];
  nextProject?: PortfolioProject;
};

/** Editorial layout for this case only. Keep the process showcase and its ancestors unchanged. */
export function LandimotosCaseStudy({ study, hero, video, gallery, nextProject }: Props) {
  const invoices = gallery.flatMap((group) => group.items).find((item) => item.id === "invoices");
  const messengers = gallery.flatMap((group) => group.items).find((item) => item.id === "messengers");

  return <>
    <section className={`${styles.shell} ${styles.hero}`} aria-labelledby="project-title">
      <LandimotosHeroMotion copy={<div className={styles.heroCopy}>
        <h1 id="project-title" className={styles.heroTitle}>Toda la operación,<br /><span>en un mismo lugar.</span></h1>
        <p className={styles.lead}>Diseñamos y desarrollamos una plataforma para conectar despachos, logística y administración, con registros y seguimiento en un solo sistema.</p>
      </div>}>
        <LandimotosHeroMedia image={hero} video={video} />
      </LandimotosHeroMotion>
    </section>

    <section id="enfoque" className={`${styles.shell} ${styles.context}`} aria-labelledby="enfoque-title">
      <div><p className={styles.eyebrow}>01 / El punto de partida</p><h2 id="enfoque-title" className={styles.sectionTitle}>Del registro diario<br />al trabajo compartido.</h2></div>
      <div className={styles.contextCopy}>
        <article><h3>El reto</h3><p>La información de despachos, facturas y mensajeros estaba distribuida entre áreas. Landimotos necesitaba organizar los registros y seguir el trabajo diario.</p></article>
        <article><h3>La solución</h3><p>Diseñamos y desarrollamos una plataforma interna con herramientas para cada área, acceso por rol y una fuente de datos común.</p></article>
      </div>
    </section>

    {/* Protected section: no new wrapper, styles, props or animation hooks. */}
    <LandimotosProcessShowcase />

    <section id="galeria" className={styles.gallery} aria-labelledby="galeria-title">
      <div className={styles.shell}>
        <div className={styles.sectionHeader}>
          <div><p className={styles.eyebrow}>02 / Dentro del producto</p><h2 id="galeria-title" className={styles.sectionTitle}>Cada tarea, en su lugar.</h2></div>
          <p>Del registro de una factura al seguimiento de una entrega.{(invoices?.placeholder || messengers?.placeholder) && <span className={styles.galleryNote}>Vistas conceptuales · Sin datos reales</span>}</p>
        </div>
        {invoices && <figure id="gallery-operacion" className={styles.wideFigure}>
          <div className={styles.wideStage}>
            <div className={styles.scrollView} role="region" aria-label="Vista de registro de facturas; desplaza horizontalmente para explorar" tabIndex={0}>
              <div className={styles.invoiceVisual}><ProjectVisual item={invoices} /></div>
            </div>
          </div>
          <figcaption className={styles.wideCaption}>
            <div><span className={styles.figureNumber}>02 / Operación</span><h3>Registrar. Asignar. Consultar.</h3></div>
            <p>Facturas clasificadas por punto, área, revisor y mesa. Un registro que conserva el recorrido hasta su consulta histórica.</p>
          </figcaption>
          <p className={styles.mobileHint}>Desliza la vista para explorar los campos <span aria-hidden="true">↔</span></p>
        </figure>}
        {messengers && <figure id="gallery-logistica" className={styles.detailFigure}>
          <div className={styles.detailStage}>
            <div className={styles.scrollView} role="region" aria-label="Detalle de mensajeros y rutas; desplaza horizontalmente para explorar" tabIndex={0}>
              <div className={messengers.placeholder ? styles.routeCrop : styles.routeVisual}><ProjectVisual item={messengers} /></div>
            </div>
          </div>
          <figcaption className={styles.detailCaption}>
            <span className={styles.figureNumber}>03 / Logística</span>
            <h3>El equipo y su recorrido.</h3>
            <p>Consultar disponibilidad, asignar rutas y dar seguimiento a las entregas desde el mismo módulo.</p>
            <span className={styles.detailNote}>Detalle de rutas y asignación{messengers.placeholder ? " · Vista conceptual, sin datos reales" : ""}</span>
            <span className={styles.mobileHint}>Desliza para explorar <span aria-hidden="true">↔</span></span>
          </figcaption>
        </figure>}
      </div>
    </section>

    <section id="alcance" className={`${styles.shell} ${styles.outcome}`} aria-labelledby="alcance-title">
      <div className={styles.outcomeIntro}>
        <p className={styles.eyebrow}>03 / Resultado y alcance</p>
        <h2 id="alcance-title" className={styles.sectionTitle}>Una herramienta interna.<br />De principio a fin.</h2>
        <p>Entregamos una aplicación web que reúne la gestión operativa, la administración y la consulta de registros.</p>
      </div>
      <dl className={styles.deliverables}>
        <div><dt>Operación y logística</dt><dd>Despachos, facturas, revisiones, mensajeros y rutas.</dd></div>
        <div><dt>Administración y atención</dt><dd>Usuarios, permisos, configuración y seguimiento al cliente.</dd></div>
        <div><dt>Consulta y análisis</dt><dd>Históricos, indicadores y dashboards a partir de los registros diarios.</dd></div>
      </dl>
      <dl className={styles.credits}>
        <div><dt>Participación de Brekline</dt><dd>Experiencia de usuario, interfaces, lógica de aplicación, datos y dashboards.</dd></div>
        <div><dt>Tecnologías</dt><dd>{study.technologies.map((tech) => tech.title).join(" · ")}</dd></div>
      </dl>
    </section>

    <section className={`${styles.shell} ${styles.closing}`} aria-labelledby="cierre-title">
      <div className={styles.closingInvite}><div><p className={styles.eyebrow}>Tu próximo proyecto</p><h2 id="cierre-title">¿Tu operación necesita<br />una herramienta a medida?</h2></div><Link href="/#contacto" className={styles.contact}>Conversemos <ArrowIcon aria-hidden="true" /></Link></div>
      <nav aria-label="Navegación de proyectos" className={styles.projectNav}>
        <Link href="/#proyectos" className={styles.textLink}><ArrowIcon aria-hidden="true" className={styles.backArrow} /> Todos los proyectos</Link>
        {nextProject?.href && <Link href={nextProject.href} className={styles.textLink}>Siguiente: {nextProject.title} <ArrowIcon aria-hidden="true" /></Link>}
      </nav>
    </section>
  </>;
}
