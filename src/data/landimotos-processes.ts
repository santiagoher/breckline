export type ProcessId =
  | "dispatch"
  | "routes"
  | "service"
  | "whatsapp"
  | "admin"
  | "indicators";

export interface ProcessStep {
  readonly title: string;
  readonly detail: string;
  readonly logStart: string;
  readonly logComplete: string;
  readonly durationMs: number;
}

export interface ProcessScenario {
  readonly id: ProcessId;
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly benefit: string;
  readonly logStart: string;
  readonly steps: readonly [ProcessStep, ProcessStep, ProcessStep, ProcessStep, ProcessStep];
  readonly note?: string;
}

export const landimotosProcesses: readonly ProcessScenario[] = [
  {
    id: "dispatch",
    logStart: "Iniciando flujo de despachos…",
    name: "Despachos",
    title: "Cada factura, con su revisión registrada.",
    description: "Relaciona cada registro con su punto de venta, área y responsable de revisión.",
    benefit: "Información disponible para consultar quién revisó cada registro.",
    steps: [
      {
        title: "Seleccionar Principal o Sucursal.",
        detail: "El equipo elige el punto de venta al que pertenece el registro.",
        logStart: "Seleccionando punto de venta…",
        logComplete: "Punto de venta seleccionado.",
        durationMs: 1600,
      },
      {
        title: "Registrar el número de factura.",
        detail: "La persona responsable ingresa la referencia de la factura: FAC-DEMO-001 en este ejemplo.",
        logStart: "Registrando factura…",
        logComplete: "Factura registrada.",
        durationMs: 1900,
      },
      {
        title: "Indicar área, revisor y mesa.",
        detail: "El equipo relaciona la factura con el área, la persona que revisa y la mesa asignada.",
        logStart: "Asignando área, revisor y mesa…",
        logComplete: "Área, revisor y mesa asignados.",
        durationMs: 2300,
      },
      {
        title: "Guardar el registro.",
        detail: "La persona responsable revisa la información y guarda el registro.",
        logStart: "Guardando el registro…",
        logComplete: "Registro guardado.",
        durationMs: 1800,
      },
      {
        title: "Consultar el detalle.",
        detail: "El equipo consulta la referencia y los responsables de su revisión.",
        logStart: "Consultando el detalle…",
        logComplete: "Detalle de la revisión disponible.",
        durationMs: 1800,
      },
    ],
  },
  {
    id: "routes",
    logStart: "Iniciando flujo de rutas…",
    name: "Mensajeros y rutas",
    title: "Disponibilidad y rutas a la vista.",
    description: "Consulta quién está disponible y qué facturas acompañan cada recorrido.",
    benefit: "Recorridos organizados con responsables y registros consultables.",
    steps: [
      {
        title: "Consultar disponibilidad.",
        detail: "El equipo consulta el estado de los mensajeros antes de organizar un recorrido.",
        logStart: "Consultando disponibilidad…",
        logComplete: "Disponibilidad consultada.",
        durationMs: 1700,
      },
      {
        title: "Asignar mensajero y destino.",
        detail: "La persona responsable selecciona un mensajero disponible y registra el destino.",
        logStart: "Asignando mensajero y destino…",
        logComplete: "Mensajero y destino asignados.",
        durationMs: 2200,
      },
      {
        title: "Asociar las facturas del recorrido.",
        detail: "El equipo vincula las referencias que acompañan la ruta asignada.",
        logStart: "Asociando facturas al recorrido…",
        logComplete: "Facturas asociadas al recorrido.",
        durationMs: 2100,
      },
      {
        title: "Visualizar la ruta en curso.",
        detail: "El equipo consulta el estado En ruta junto con el destino y las facturas asociadas.",
        logStart: "Consultando la ruta en curso…",
        logComplete: "Detalle del recorrido disponible.",
        durationMs: 1900,
      },
      {
        title: "Finalizar y consultar el historial.",
        detail: "La persona responsable registra el cierre; el recorrido queda disponible en el historial.",
        logStart: "Finalizando el recorrido…",
        logComplete: "Recorrido disponible en el historial.",
        durationMs: 2200,
      },
    ],
  },
  {
    id: "service",
    logStart: "Iniciando flujo de atención…",
    name: "Atención al cliente",
    title: "La actividad de cada asesor, organizada.",
    description: "Registra la atención diaria por asesor y consulta su evolución.",
    benefit: "Seguimiento estructurado de la actividad comercial.",
    steps: [
      {
        title: "Seleccionar asesor y fecha.",
        detail: "La persona responsable identifica el asesor y la jornada que va a registrar.",
        logStart: "Seleccionando asesor y fecha…",
        logComplete: "Asesor y fecha seleccionados.",
        durationMs: 1700,
      },
      {
        title: "Registrar cantidades por etiqueta.",
        detail: "El equipo ingresa las cantidades de Clientes atendidos y Venta realizada por separado.",
        logStart: "Registrando cantidades por etiqueta…",
        logComplete: "Cantidades registradas por etiqueta.",
        durationMs: 2400,
      },
      {
        title: "Agregar observaciones.",
        detail: "La persona responsable añade contexto sobre la actividad de la jornada.",
        logStart: "Agregando observaciones…",
        logComplete: "Observaciones agregadas.",
        durationMs: 1900,
      },
      {
        title: "Guardar el reporte diario.",
        detail: "El equipo revisa y guarda las cantidades y observaciones del asesor.",
        logStart: "Guardando el reporte diario…",
        logComplete: "Reporte diario guardado.",
        durationMs: 2000,
      },
      {
        title: "Consultar los informes.",
        detail: "La persona responsable consulta los registros para revisar la actividad del asesor.",
        logStart: "Consultando los informes…",
        logComplete: "Actividad del asesor disponible.",
        durationMs: 1800,
      },
    ],
    note: "Las etiquetas pueden superponerse; sus cantidades no se suman como personas únicas.",
  },
  {
    id: "whatsapp",
    logStart: "Iniciando flujo de estados…",
    name: "Estados de WhatsApp",
    title: "Una programación con seguimiento.",
    description: "Organiza temáticas y consulta el cumplimiento de estados por asesor.",
    benefit: "Una planificación visible para el equipo.",
    steps: [
      {
        title: "Elegir una fecha.",
        detail: "El equipo selecciona el día que quiere planificar.",
        logStart: "Seleccionando una fecha…",
        logComplete: "Fecha seleccionada.",
        durationMs: 1500,
      },
      {
        title: "Definir la temática.",
        detail: "La persona responsable indica el tema previsto para los estados.",
        logStart: "Definiendo la temática…",
        logComplete: "Temática definida.",
        durationMs: 1800,
      },
      {
        title: "Registrar la programación.",
        detail: "El equipo guarda la planificación para que pueda consultarse.",
        logStart: "Registrando la programación…",
        logComplete: "Programación registrada.",
        durationMs: 1900,
      },
      {
        title: "Registrar el cumplimiento.",
        detail: "La persona responsable registra el cumplimiento del asesor; la publicación se realiza fuera de la intranet.",
        logStart: "Registrando el cumplimiento…",
        logComplete: "Cumplimiento del asesor registrado.",
        durationMs: 2200,
      },
      {
        title: "Consultar el seguimiento.",
        detail: "El equipo revisa la programación y el cumplimiento registrado por asesor.",
        logStart: "Consultando el seguimiento…",
        logComplete: "Seguimiento por asesor disponible.",
        durationMs: 1900,
      },
    ],
  },
  {
    id: "admin",
    logStart: "Iniciando flujo de administración…",
    name: "Administración",
    title: "Accesos según cada responsabilidad.",
    description: "Organiza las cuentas y los módulos disponibles para cada perfil.",
    benefit: "Accesos organizados según las funciones del equipo.",
    steps: [
      {
        title: "Seleccionar un usuario.",
        detail: "La persona administradora selecciona la cuenta de acceso que va a configurar.",
        logStart: "Seleccionando un usuario…",
        logComplete: "Usuario seleccionado.",
        durationMs: 1600,
      },
      {
        title: "Definir su rol.",
        detail: "La persona administradora asigna el rol correspondiente a las funciones del usuario.",
        logStart: "Definiendo el rol…",
        logComplete: "Rol asignado.",
        durationMs: 1800,
      },
      {
        title: "Configurar módulos de acceso.",
        detail: "La persona administradora elige los módulos disponibles para esa cuenta.",
        logStart: "Configurando módulos de acceso…",
        logComplete: "Módulos de acceso configurados.",
        durationMs: 2300,
      },
      {
        title: "Establecer su estado.",
        detail: "La persona administradora indica si la cuenta debe permanecer activa o inactiva.",
        logStart: "Estableciendo el estado de la cuenta…",
        logComplete: "Estado de la cuenta establecido.",
        durationMs: 1800,
      },
      {
        title: "Guardar la configuración.",
        detail: "La persona administradora revisa y guarda el rol, los módulos y el estado de la cuenta.",
        logStart: "Guardando la configuración…",
        logComplete: "Configuración guardada.",
        durationMs: 2100,
      },
    ],
    note: "Las cuentas de acceso son distintas del registro de conductores y mensajeros. También se gestionan personal, cargos, placas, áreas, revisores y mesas.",
  },
  {
    id: "indicators",
    logStart: "Iniciando flujo de indicadores…",
    name: "Indicadores",
    title: "Información para entender la operación.",
    description: "Consulta volúmenes, distribución del trabajo y horarios de mayor actividad.",
    benefit: "Una base visible para planificar y tomar decisiones.",
    steps: [
      {
        title: "Seleccionar un periodo.",
        detail: "El equipo elige el intervalo de fechas que quiere revisar.",
        logStart: "Seleccionando un periodo…",
        logComplete: "Periodo seleccionado.",
        durationMs: 1600,
      },
      {
        title: "Consultar registros y rutas.",
        detail: "La persona responsable consulta los volúmenes de registros y recorridos del periodo.",
        logStart: "Consultando registros y rutas…",
        logComplete: "Volúmenes del periodo disponibles.",
        durationMs: 2100,
      },
      {
        title: "Revisar áreas y responsables.",
        detail: "El equipo revisa cómo se distribuye la actividad entre áreas y responsables.",
        logStart: "Revisando áreas y responsables…",
        logComplete: "Distribución por áreas consultada.",
        durationMs: 2200,
      },
      {
        title: "Identificar horarios de mayor actividad.",
        detail: "La persona responsable consulta la actividad por horario para reconocer los momentos con más registros.",
        logStart: "Revisando horarios de mayor actividad…",
        logComplete: "Horarios de mayor actividad visibles.",
        durationMs: 2400,
      },
      {
        title: "Comparar la actividad del periodo.",
        detail: "El equipo compara la distribución del periodo como apoyo para planificar su trabajo.",
        logStart: "Comparando la actividad del periodo…",
        logComplete: "Comparación del periodo disponible.",
        durationMs: 2200,
      },
    ],
  },
];
