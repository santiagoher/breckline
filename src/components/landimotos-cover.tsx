"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { ArrowIcon, CorporateIcon, LandingPageIcon, LocationIcon, PlatformIcon, StoreIcon } from "@/components/icons";
import type { ProjectGalleryItem } from "@/data/projects";
import styles from "./landimotos-cover.module.css";

const modules = [
  { title: "Operación", Icon: LandingPageIcon },
  { title: "Logística", Icon: LocationIcon },
  { title: "Personal", Icon: CorporateIcon },
  { title: "Atención", Icon: PlatformIcon },
  { title: "Analítica", Icon: StoreIcon },
];

export function LandimotosCover({ screenshot, number }: { screenshot?: ProjectGalleryItem; number: number }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopPointer = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let bounds: DOMRect | null = null;
    const reset = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      element.style.setProperty("--depth-x", "0px");
      element.style.setProperty("--depth-y", "0px");
    };
    const enter = () => { bounds = element.getBoundingClientRect(); };
    const move = (event: PointerEvent) => {
      if (reduce.matches || !desktopPointer.matches || event.pointerType !== "mouse") return;
      bounds ??= element.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        element.style.setProperty("--depth-x", `${pointerX * 2}px`);
        element.style.setProperty("--depth-y", `${pointerY * 2}px`);
        frame = 0;
      });
    };
    const observer = window.IntersectionObserver ? new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        element.dataset.visible = "true";
        observer?.disconnect();
      }
    }, { threshold: 0.15 }) : null;
    if (!reduce.matches && observer) {
      element.dataset.motion = "ready";
      observer.observe(element);
    }
    const preferencesChanged = () => {
      reset();
      if (reduce.matches) {
        element.dataset.visible = "true";
        observer?.disconnect();
      }
    };
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", reset);
    reduce.addEventListener("change", preferencesChanged);
    desktopPointer.addEventListener("change", preferencesChanged);
    return () => {
      reset();
      observer?.disconnect();
      element.removeAttribute("data-motion");
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      reduce.removeEventListener("change", preferencesChanged);
      desktopPointer.removeEventListener("change", preferencesChanged);
    };
  }, []);

  return <div ref={root} className={styles.cover} role="img" aria-label={`Landimotos: una operación conectada. Software interno para operación, logística y analítica. ${screenshot ? "Vista del dashboard." : "Maqueta ilustrativa del dashboard, sin datos reales."}`}>
    <div className={styles.surface} aria-hidden="true">
      <div className={styles.topline}><span>BRECKLINE® / {String(number).padStart(2, "0")}</span><span className={styles.arrow}><ArrowIcon /></span></div>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Software empresarial <span>/ Caso de estudio</span></p>
        <p className={`${styles.title} font-display`}>UNA OPERACIÓN<br />CONECTADA.</p>
        <p className={styles.subtitle}>Operación · Logística · Analítica</p>
      </div>
      <div className={styles.dashboardEntrance}>
        <div className={styles.dashboardDepth}>
          <div className={styles.window}>
            <div className={styles.chrome}><span className={styles.dots}><i /><i /><i /></span><Image src="/assets/brands/landimotos.webp" alt="" width={642} height={242} sizes="(min-width: 1024px) 80px, 100px" className={styles.logo} /><span className={styles.internal}>INTRANET</span></div>
            {screenshot ? <Image src={screenshot.src} alt="" width={screenshot.width} height={screenshot.height} sizes="(min-width: 1280px) 450px, (min-width: 1024px) 36vw, 72vw" className={styles.screenshot} /> : <div className={styles.app}>
              <div className={styles.sidebar}>{modules.map(({ title, Icon }, index) => <div key={title} className={index === 0 ? styles.selected : undefined}><Icon /><span>{title}</span></div>)}</div>
              <div className={styles.workspace}>
                <div className={styles.appHeading}><strong>Dashboard</strong><span>Vista general</span></div>
                <div className={styles.stats}>{["Despachos", "Rutas", "Históricos"].map((label, index) => <div key={label}><span>{label}</span><strong>{["Registro", "Seguimiento", "Consulta"][index]}</strong><i /></div>)}</div>
                <div className={styles.panels}>
                  <div className={styles.activity}><strong>Actividad operativa</strong><svg viewBox="0 0 180 65" fill="none"><path d="M0 15h180M0 35h180M0 55h180" stroke="#ffffff" strokeOpacity=".07" /><path d="M1 53l24-12 23 5 26-21 25 8 25-19 25 6 29-14" stroke="#b3a9fd" strokeWidth="2.5" /><path d="M1 53l24-12 23 5 26-21 25 8 25-19 25 6 29-14v59H1Z" fill="#7358fa" fillOpacity=".08" /></svg><span>Registros y tendencias</span></div>
                  <div className={styles.history}><strong>Actividad reciente</strong><div><i /><span>Registro de factura<small>En revisión</small></span></div><div><i /><span>Asignación de ruta<small>En seguimiento</small></span></div></div>
                </div>
                <p className={styles.mockLabel}>VISTA ILUSTRATIVA · SIN DATOS REALES</p>
              </div>
            </div>}
          </div>
        </div>
      </div>
      <div className={`${styles.microEntrance} ${styles.microOne}`}><div className={styles.micro}><LandingPageIcon /><div><span>DESPACHOS</span><strong>Control operativo</strong></div></div></div>
      <div className={`${styles.microEntrance} ${styles.microTwo}`}><div className={styles.micro}><LocationIcon /><div><span>MENSAJEROS</span><strong>Rutas conectadas</strong></div></div></div>
      <p className={styles.status}><i /> Software a medida</p>
    </div>
  </div>;
}
