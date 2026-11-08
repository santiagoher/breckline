"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ArrowIcon, CloseIcon } from "@/components/icons";
import type { ProjectCaseStudy, ProjectGalleryItem } from "@/data/projects";
import { ProjectVisual } from "@/components/project-visual";
import styles from "./project-study.module.css";

function imageAlt(item: ProjectGalleryItem) {
  return item.placeholder ? `Espacio reservado para una captura anonimizada: ${item.caption}.` : item.alt;
}

export function ProjectGallery({ groups }: { groups: ProjectCaseStudy["gallery"] }) {
  const items = groups.flatMap((group) => group.items).filter((item) => !item.placeholder);
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const isOpen = active !== null;
  const current = active === null ? undefined : items[active];

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function navigate(direction: number) {
    setActive((index) => index === null ? null : (index + direction + items.length) % items.length);
  }

  return (
    <>
      <div className={styles.gallery}>
        {groups.map((group, groupIndex) => (
          <section id={`gallery-${group.id}`} aria-labelledby={`gallery-title-${group.id}`} key={group.id} className={styles.galleryScene}>
            <div data-reveal className={styles.galleryHeading}>
              <p className={styles.eyebrow}>0{groupIndex + 1} / {["Operación", "Logística", "Analítica"][groupIndex] ?? group.id}</p>
              <h3 id={`gallery-title-${group.id}`}>{group.title}.</h3>
            </div>
            <div>
              {group.items.map((item) => (
                <figure data-reveal="screen" className={styles.galleryFrame} key={item.id}>
                  <div className={styles.screenStage}>
                  {item.placeholder ? <ProjectVisual item={item} /> : <button
                    aria-haspopup="dialog"
                    aria-label={`Ampliar: ${item.caption}`}
                    className={`${styles.screenButton} focus-ring`}
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      setActive(items.findIndex((candidate) => candidate.id === item.id));
                    }}
                    type="button"
                  >
                    <Image alt={imageAlt(item)} src={item.src} width={item.width} height={item.height} sizes="(min-width: 1650px) 1450px, 90vw" className="h-auto w-full rounded-lg" />
                  </button>}
                  </div>
                  <figcaption><span>{item.caption}</span>{!item.placeholder && <span>Ampliar ↗</span>}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
      <dialog
        ref={dialog}
        aria-labelledby="screenshot-caption"
        aria-describedby="screenshot-help"
        className="fixed inset-0 m-auto max-h-[96dvh] w-[96vw] max-w-[1600px] overflow-y-auto rounded-2xl border border-white/20 bg-night p-3 text-white shadow-2xl backdrop:bg-black/90 sm:p-5"
        onCancel={() => setActive(null)}
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setActive(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            navigate(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {current && <>
          <div className="mb-3 flex items-center justify-between gap-4">
            <p aria-live="polite" className="text-sm font-semibold" id="screenshot-caption">{current.caption} <span className="ml-2 text-lavender">{(active ?? 0) + 1} / {items.length}</span></p>
            <button autoFocus aria-label="Cerrar captura" className="focus-ring grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20" onClick={() => setActive(null)} type="button"><CloseIcon /></button>
          </div>
          <Image key={current.id} alt={imageAlt(current)} src={current.src} width={current.width} height={current.height} sizes="96vw" loading="eager" className="max-h-[70dvh] w-full rounded-lg object-contain" />
          <div className="mt-3 flex items-center justify-between gap-3">
            <button aria-label="Captura anterior" className="focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-white/20 hover:bg-white/10" onClick={() => navigate(-1)} type="button"><ArrowIcon className="size-5 rotate-180" /></button>
            <p className="text-center text-xs leading-5 text-lavender" id="screenshot-help">Usa las flechas para navegar y Escape para cerrar.</p>
            <button aria-label="Captura siguiente" className="focus-ring grid size-11 shrink-0 place-items-center rounded-full border border-white/20 hover:bg-white/10" onClick={() => navigate(1)} type="button"><ArrowIcon className="size-5" /></button>
          </div>
        </>}
      </dialog>
    </>
  );
}
