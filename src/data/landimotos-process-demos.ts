import type { ProcessId } from "./landimotos-processes";

interface DemoField {
  readonly label: string;
  readonly value: string;
  readonly fromStep: number;
}

interface ProcessDemo {
  readonly title: string;
  readonly reference: string;
  readonly statuses: readonly [string, string, string, string, string];
  readonly fields: readonly DemoField[];
  readonly note?: string;
}

// Local examples only. These are neither production records nor product results.
export const processDemos = {
  dispatch: {
    title: "Ficha de factura",
    reference: "REGISTRO / 001",
    statuses: ["En edición", "Factura registrada", "Revisión definida", "Guardado", "Detalle disponible"],
    fields: [
      { label: "Punto de venta", value: "Principal", fromStep: 0 },
      { label: "Factura", value: "FAC-DEMO-001", fromStep: 1 },
      { label: "Área · Mesa", value: "Repuestos · Mesa 01", fromStep: 2 },
      { label: "Responsable de revisión", value: "Revisor demo", fromStep: 2 },
    ],
  },
  routes: {
    title: "Mensajero demo",
    reference: "RECORRIDO / 001",
    statuses: ["Disponible", "Asignado", "Facturas asociadas", "En ruta", "En historial"],
    fields: [
      { label: "Disponibilidad", value: "Disponible para asignación", fromStep: 0 },
      { label: "Destino", value: "Sucursal", fromStep: 1 },
      { label: "Facturas", value: "FAC-DEMO-001 · 002", fromStep: 2 },
      { label: "Historial", value: "Recorrido finalizado", fromStep: 4 },
    ],
  },
  service: {
    title: "Reporte de atención",
    reference: "ASESOR DEMO / 12 SEP",
    statuses: ["Asesor seleccionado", "Cantidades registradas", "Con observaciones", "Reporte guardado", "Informe disponible"],
    fields: [
      { label: "Asesor · Fecha", value: "Asesor demo · 12 sep", fromStep: 0 },
      { label: "Clientes atendidos", value: "18", fromStep: 1 },
      { label: "Venta realizada", value: "7", fromStep: 1 },
      { label: "Observación", value: "Seguimiento a solicitudes", fromStep: 2 },
    ],
    note: "Las etiquetas pueden superponerse; no representan personas únicas sumadas.",
  },
  whatsapp: {
    title: "Programación de estados",
    reference: "SEPTIEMBRE / EJEMPLO",
    statuses: ["Fecha elegida", "Temática definida", "Programado", "Cumplimiento registrado", "Seguimiento disponible"],
    fields: [
      { label: "Temática", value: "Accesorios", fromStep: 1 },
      { label: "Responsable", value: "Asesor demo", fromStep: 2 },
    ],
    note: "El equipo registra el cumplimiento. La intranet no publica los estados.",
  },
  admin: {
    title: "Cuenta de acceso",
    reference: "USUARIO / DEMO",
    statuses: ["Usuario seleccionado", "Rol definido", "Módulos definidos", "Cuenta activa", "Configuración guardada"],
    fields: [
      { label: "Cuenta", value: "usuario.demo", fromStep: 0 },
      { label: "Rol", value: "Operación", fromStep: 1 },
      { label: "Módulos habilitados", value: "Despachos · Consultas", fromStep: 2 },
      { label: "Estado", value: "Activa", fromStep: 3 },
    ],
    note: "Las cuentas de acceso son independientes del registro de conductores y mensajeros.",
  },
  indicators: {
    title: "Actividad del periodo",
    reference: "VALORES ILUSTRATIVOS",
    statuses: ["Periodo seleccionado", "Volumen consultado", "Distribución por área", "Actividad por horario", "Comparación disponible"],
    fields: [
      { label: "Registros · Rutas", value: "84 registros · 12 rutas", fromStep: 1 },
      { label: "Distribución por área", value: "Repuestos 52 · Taller 32", fromStep: 2 },
    ],
  },
} as const satisfies Record<ProcessId, ProcessDemo>;

export const illustrativeActivity = [
  { label: "08 h", value: 12 },
  { label: "10 h", value: 28 },
  { label: "12 h", value: 18 },
  { label: "14 h", value: 26 },
] as const;

export const illustrativeWeek = [
  { day: "L", date: 7 }, { day: "M", date: 8 }, { day: "X", date: 9 },
  { day: "J", date: 10 }, { day: "V", date: 11 }, { day: "S", date: 12 },
  { day: "D", date: 13 },
] as const;

export function getProcessDemo(id: ProcessId): ProcessDemo {
  return processDemos[id];
}
