import Image from "next/image";
import Link from "next/link";

import { ArrowIcon, LandingPageIcon, PlatformIcon, WebIcon } from "@/components/icons";
import { LandimotosProcessPlayer } from "@/components/landimotos-process-player";
import { landimotosProcesses } from "@/data/landimotos-processes";
import styles from "./landimotos-process.module.css";

export interface ProcessScreenshot {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption?: string;
}

/** A reviewed, anonymized screenshot can be supplied later; the demo is self-contained. */
export function LandimotosProcessShowcase({ screenshot }: { screenshot?: ProcessScreenshot }) {
  return <section id="procesos" aria-labelledby="landimotos-process-title" className={styles.section}>
    <div className={styles.intro}>
      <p className={styles.eyebrow}><span aria-hidden="true" />INTRANET LANDIMOTOS</p>
      <h2 id="landimotos-process-title">Una operación conectada.<br /><span>Cada proceso, visible.</span></h2>
      <p>Despachos, mensajeros y administración en una plataforma para organizar el trabajo y consultar sus responsables.</p>
    </div>
    <LandimotosProcessPlayer processes={landimotosProcesses} sidebar={<>
      <span className={styles.brandMark} aria-hidden="true">L<span>↗</span></span>
      <nav aria-label="Explorar el proyecto" className={styles.railNav}>
        <a href="#project-title" aria-label="Presentación del proyecto" title="Presentación del proyecto"><WebIcon /></a>
        <a href="#procesos" aria-label="Demostración de procesos" aria-current="location" title="Demostración de procesos"><PlatformIcon /></a>
        <a href="#galeria" aria-label="Interfaces del proyecto" title="Interfaces del proyecto"><LandingPageIcon /></a>
      </nav>
      <Link className={styles.railBack} href="/#proyectos" aria-label="Todos los proyectos" title="Todos los proyectos"><ArrowIcon /></Link>
    </>} />
    <p className={styles.changeStory}>Del desorden operativo a procesos con responsables, registros y seguimiento.</p>
    {screenshot && <figure className={styles.screenshot}>
      <Image src={screenshot.src} alt={screenshot.alt} width={screenshot.width} height={screenshot.height} sizes="(max-width: 768px) 92vw, 1100px" />
      {screenshot.caption && <figcaption>{screenshot.caption}</figcaption>}
    </figure>}
  </section>;
}
