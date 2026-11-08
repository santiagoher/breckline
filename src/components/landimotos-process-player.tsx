"use client";

import { type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import { CheckIcon, LandingPageIcon } from "@/components/icons";
import { getProcessDemo, illustrativeActivity, illustrativeWeek } from "@/data/landimotos-process-demos";
import type { ProcessScenario } from "@/data/landimotos-processes";
import { useProcessPlayback } from "./use-process-playback";
import styles from "./landimotos-process.module.css";

function ProcessTimeline({ processes, scenarioIndex, activeStep, completedCount, revealedStep }: {
  processes: readonly ProcessScenario[];
  scenarioIndex: number;
  activeStep: number;
  completedCount: number;
  revealedStep: number;
}) {
  const { steps } = processes[scenarioIndex];
  const progress = Math.min(1, completedCount / Math.max(1, steps.length - 1));

  return <ol className={styles.timeline} style={{ "--process-progress": progress } as CSSProperties} aria-label="Pasos del proceso">
    {steps.map((_, index) => {
      const done = index < completedCount;
      const active = index === activeStep && !done;
      const state = done ? "completed" : active ? "running" : "pending";
      return <li key={index} data-state={state} aria-current={active ? "step" : undefined}>
        <div className={styles.stepRow}>
          <span className={styles.stepNumber} aria-hidden="true">
            {done ? <CheckIcon /> : active ? <svg className={styles.stepActivity} viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /></svg> : null}
          </span>
          <span className={styles.timelineLabels}>
            {processes.map((process, processIndex) => <span key={process.id} className={styles.layer} data-visible={processIndex === scenarioIndex} aria-hidden={processIndex !== scenarioIndex}>{process.steps[index].title}</span>)}
          </span>
          <span className={styles.stepMarker}>{done ? "Completado" : active ? "En ejecución" : "Pendiente"}</span>
          {active && <span className={styles.stepProgress} data-revealed={revealedStep === index} aria-hidden="true" />}
        </div>
      </li>;
    })}
  </ol>;
}

/** Hidden layers reserve the final text's space, without exposing pending results. */
function ProcessSnapshot({ process, step, revealedStep, completedCount }: {
  process: ProcessScenario;
  step: number;
  revealedStep: number;
  completedCount: number;
}) {
  const demo = getProcessDemo(process.id);
  const statuses = ["Pendiente", "En ejecución", ...demo.statuses];
  const statusIndex = completedCount > 0 ? completedCount + 1 : step < 0 ? 0 : 1;
  const note = process.note ?? demo.note;

  return <div className={styles.snapshot}>
    <div className={styles.snapshotHeading}>
      <span className={styles.snapshotIcon}><LandingPageIcon /></span>
      <div><p className={styles.reference}>{demo.reference}</p><h4>{demo.title}</h4></div>
      <span className={styles.snapshotStatus}>
        {statuses.map((status, index) => <span className={styles.layer} key={index} data-visible={statusIndex === index} aria-hidden={statusIndex !== index}>{status}</span>)}
      </span>
    </div>
    {process.id === "whatsapp" && <div className={styles.calendar} aria-label={revealedStep >= 0 ? "Semana ilustrativa: fecha seleccionada, 12 de septiembre" : "Semana ilustrativa: fecha pendiente de selección"}>
      {illustrativeWeek.map(({ day, date }) => <span key={date} data-selected={revealedStep >= 0 && date === 12}><small>{day}</small><strong>{date}</strong>{revealedStep >= 0 && date === 12 && <span className="sr-only">Seleccionado</span>}</span>)}
    </div>}
    <dl className={styles.fields}>
      {demo.fields.map((field) => {
        const pending = revealedStep < field.fromStep;
        const routeAvailability = process.id === "routes" && field.label === "Disponibilidad";
        const value = routeAvailability && revealedStep >= 1
          ? revealedStep === 4 ? "Recorrido finalizado" : revealedStep === 3 ? "En ruta" : "Asignado al recorrido"
          : field.value;
        return <div key={field.label} data-pending={pending}>
          <dt>{field.label}</dt>
          <dd>
            <span className={styles.fieldValue} data-visible={!pending} data-reveal={!pending && revealedStep === field.fromStep} aria-hidden={pending}>{value}</span>
            {routeAvailability && <span className={styles.fieldMeasure} aria-hidden="true">Disponible para asignación</span>}
            {pending && <span className={styles.fieldPlaceholder}><span aria-hidden="true">—</span><span className="sr-only">Pendiente de registrar</span></span>}
          </dd>
        </div>;
      })}
    </dl>
    {process.id === "indicators" && <>
      <div className={styles.barChart} role="img" aria-label={revealedStep >= 3 ? "Registros ilustrativos por horario: 08 h, 12; 10 h, 28; 12 h, 18; 14 h, 26." : "Gráfico por horario pendiente de consulta"}>
        {illustrativeActivity.map(({ label, value }) => <div key={label} aria-hidden="true"><span>{revealedStep >= 3 ? value : "—"}</span><i style={{ "--bar-height": revealedStep >= 3 ? `${value / 28 * 100}%` : "0%" } as CSSProperties} /><small>{label}</small></div>)}
      </div>
      <div className={styles.snapshotNote}>
        <p className={styles.layer} data-visible={revealedStep < 4} aria-hidden={revealedStep >= 4}>Semana de ejemplo · Volúmenes ilustrativos, sin resultados comerciales atribuidos.</p>
        <p className={styles.layer} data-visible={revealedStep >= 4} aria-hidden={revealedStep < 4}>Comparación ilustrativa: 72 registros en el periodo anterior; 84 en el seleccionado.</p>
      </div>
    </>}
    {note && <p className={styles.snapshotNote}>{note}</p>}
    <div className={styles.stepDetail}>
      <p className={styles.layer} data-visible={step < 0} aria-hidden={step >= 0}>Los datos de ejemplo aparecerán a medida que avance el proceso.</p>
      {process.steps.map((item, index) => <p className={styles.layer} key={index} data-visible={step === index} aria-hidden={step !== index}>{item.detail}</p>)}
    </div>
  </div>;
}

export function LandimotosProcessPlayer({ processes, sidebar }: { processes: readonly ProcessScenario[]; sidebar: ReactNode }) {
  const playback = useProcessPlayback(processes);
  const { scenarioIndex, stepIndex, completedCount, revealedStep, completed, reducedMotion, rootRef, status, log, runId } = playback;
  const process = processes[scenarioIndex];
  const statusLabel = status === "completed" ? "Flujo de trabajo finalizado" : status === "running" ? "Ejecutando flujo de trabajo" : "Listo para iniciar";

  function navigateProcesses(event: KeyboardEvent<HTMLFieldSetElement>) {
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
    const current = buttons.indexOf(event.target as HTMLButtonElement);
    if (current < 0) return;
    let next: number;
    switch (event.key) {
      case "ArrowRight": case "ArrowDown": next = (current + 1) % processes.length; break;
      case "ArrowLeft": case "ArrowUp": next = (current - 1 + processes.length) % processes.length; break;
      case "Home": next = 0; break;
      case "End": next = processes.length - 1; break;
      default: return;
    }
    event.preventDefault();
    buttons[next].focus();
    playback.selectScenario(next);
  }

  return <div className={styles.window} ref={rootRef} data-process-player data-scenario={process.id} data-step={stepIndex + 1} data-status={status} data-completed-count={completedCount} data-run={runId} data-playing={playback.playing} data-reduced-motion={reducedMotion}>
    <div className={styles.chrome}>
      <span className={styles.windowDots} aria-hidden="true"><i /><i /><i /></span>
      <span className={styles.windowTitle}>Landimotos — Centro de operaciones</span>
      <label className={styles.motionToggle} title={playback.systemReducedMotion ? "Movimiento reducido según la preferencia de tu dispositivo" : undefined}>
        <input type="checkbox" checked={reducedMotion} disabled={playback.systemReducedMotion} onChange={(event) => playback.setReducedMotion(event.target.checked)} />
        <span>Reducir movimiento</span>
      </label>
    </div>
    <div className={styles.player}>
      <aside className={styles.rail}>{sidebar}</aside>
      <div className={styles.narrative}>
        <div className={styles.narrativeLayers}>
          {processes.map((item, index) => <div key={item.id} className={styles.layer} data-visible={index === scenarioIndex} aria-hidden={index !== scenarioIndex}>
            <p className={styles.processName}><span>{String(index + 1).padStart(2, "0")} / {String(processes.length).padStart(2, "0")}</span>{item.name}</p>
            <h3 className={styles.processTitle}>{item.title}</h3>
          </div>)}
        </div>
        <div className={styles.activity}>
          <p className={styles.flowStatus} data-process-status data-flow-state={status}><span data-process-status-dot aria-hidden="true" />{statusLabel}</p>
          <ol className={styles.miniLog} data-process-log aria-label="Actividad del proceso" aria-live="off">
            {log.slice(-3).map((entry, index, entries) => <li key={entry.id} data-latest={index === entries.length - 1}><span aria-hidden="true">›</span>{entry.message}</li>)}
          </ol>
        </div>
        <fieldset className={styles.scenarios} onKeyDown={navigateProcesses}>
          <legend>Explora un proceso</legend>
          <div>{processes.map((item, index) => <button key={item.id} type="button" aria-pressed={index === scenarioIndex} onClick={() => playback.selectScenario(index)}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{item.name}{index === scenarioIndex && <span className={styles.selectionMark} aria-hidden="true" />}</button>)}</div>
        </fieldset>
      </div>
      <div className={styles.demonstration}>
        <div className={styles.demoHeading}><p>Demostración del proceso</p><span>{String(completedCount).padStart(2, "0")} <span>/ {String(process.steps.length).padStart(2, "0")} completados</span></span></div>
        <ProcessTimeline processes={processes} scenarioIndex={scenarioIndex} activeStep={stepIndex} completedCount={completedCount} revealedStep={revealedStep} />
        <div className={styles.frameLayers} aria-label="Detalle del proceso">
          {processes.map((item, index) => <div className={styles.layer} key={item.id} data-visible={index === scenarioIndex} aria-hidden={index !== scenarioIndex}>
            <ProcessSnapshot process={item} step={index === scenarioIndex ? stepIndex : -1} revealedStep={index === scenarioIndex ? revealedStep : -1} completedCount={index === scenarioIndex ? completedCount : 0} />
          </div>)}
        </div>
        <div className={styles.playback}>
          <div className={styles.progress} role="progressbar" aria-label="Progreso de la demostración" aria-valuemin={0} aria-valuemax={process.steps.length} aria-valuenow={completedCount} aria-valuetext={`${completedCount} de ${process.steps.length} pasos completados`}><span style={{ transform: `scaleX(${completedCount / process.steps.length})` }} /></div>
          <p className={styles.demoNote}>Datos ilustrativos · Cada paso representa una acción del equipo.</p>
        </div>
      </div>
    </div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true"><span key={runId}>{status === "ready" ? "" : `${process.name}. ${completed ? "Flujo de trabajo finalizado." : "Flujo de trabajo iniciado."}`}</span></p>
  </div>;
}
