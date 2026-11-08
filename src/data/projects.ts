export interface ProjectGalleryItem {
  id: string;
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  placeholder?: boolean;
}

type EditorialItem = { title: string; description: string };

export interface ProjectCaseStudy {
  heading: readonly string[];
  summary: string;
  overview: readonly string[];
  seoDescription: string;
  challenge: string;
  solution: string;
  metadata: readonly { label: string; value: string }[];
  scope: { title: string; description: string; groups: readonly { title: string; items: readonly string[] }[] };
  benefits: readonly EditorialItem[];
  capabilities: readonly (EditorialItem & { items: readonly string[] })[];
  roles: readonly EditorialItem[];
  architecture: string;
  layers: readonly { title: string; detail: string; items?: readonly string[] }[];
  decisions: readonly EditorialItem[];
  contribution: readonly string[];
  responsibilities: readonly string[];
  technologies: readonly EditorialItem[];
  closing: EditorialItem;
  hero: ProjectGalleryItem;
  gallery: readonly { id: string; title: string; description: string; items: readonly ProjectGalleryItem[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: readonly string[];
  href?: string;
  previewTitle: string;
  previewImage: string;
  theme: "violet" | "mint" | "peach" | "sky" | "rose";
  caseStudy?: ProjectCaseStudy;
}

// Publish only anonymized, reviewed assets. See docs/case-studies.md.
const screenshot = (id: string, caption: string, alt: string): ProjectGalleryItem => ({
  id, caption, alt,
  src: `/projects/landimotos-logistics/${id}.webp`,
  width: 1600,
  height: 1000,
  placeholder: true,
});

const dashboard = screenshot("dashboard", "Dashboard operativo", "Dashboard de mensajería con indicadores de entregas, rutas y actividad por operador.");

export const portfolioProjects: readonly PortfolioProject[] = [
  {
    id: "portal-logistico-landimotos",
    title: "Portal Logístico Landimotos",
    category: "Software empresarial · Proyecto interno",
    description: "Plataforma empresarial para centralizar procesos logísticos, despachos, mensajería, atención al cliente y analítica operativa.",
    tags: ["React", "TypeScript", "Tailwind", "Supabase"],
    href: "/proyectos/portal-logistico-landimotos",
    previewTitle: "Una operación conectada.",
    previewImage: dashboard.src,
    theme: "violet",
    caseStudy: {
      heading: ["Portal Logístico", "Landimotos"],
      summary: "Plataforma interna desarrollada para centralizar la operación logística, administrativa y de atención al cliente de Landimotos.",
      overview: [
        "El crecimiento de los procesos internos hacía necesario centralizar información relacionada con despachos, facturas, mensajeros, personal, atención al cliente y seguimiento operativo.",
        "El objetivo fue convertir diferentes tareas y registros diarios en un sistema estructurado, consultable y conectado.",
      ],
      seoDescription: "Aplicación web empresarial desarrollada para centralizar operaciones logísticas, administrativas y de atención al cliente.",
      challenge: "La información provenía de diferentes áreas. Registrar despachos, coordinar mensajeros y consultar revisiones requería una estructura común que permitiera seguir el trabajo diario.",
      solution: "Desarrollé una plataforma interna con módulos conectados a una misma fuente de información: herramientas específicas para cada área y registros que pueden consultarse y analizarse en conjunto.",
      metadata: [
        { label: "Tipo", value: "Software interno" },
        { label: "Enfoque", value: "Operaciones y logística" },
        { label: "Rol", value: "Diseño + Desarrollo" },
        { label: "Stack", value: "React / TypeScript / Supabase" },
        { label: "Estado", value: "Uso interno" },
        { label: "Cliente", value: "Landimotos" },
      ],
      scope: {
        title: "Más que un dashboard.",
        description: "La plataforma conecta distintos procesos internos dentro de una misma aplicación: operación, logística, personal, atención, configuración y analítica.",
        groups: [
          { title: "Operación", items: ["Despachos", "Facturas", "Revisiones"] },
          { title: "Logística", items: ["Mensajeros", "Rutas", "Entregas"] },
          { title: "Personal", items: ["Conductores", "Usuarios", "Permisos"] },
          { title: "Atención", items: ["Registros diarios", "WhatsApp", "Seguimiento"] },
          { title: "Analítica", items: ["Históricos", "Indicadores", "Dashboards"] },
        ],
      },
      benefits: [
        { title: "Centralización", description: "Diferentes procesos internos se gestionan desde una misma plataforma." },
        { title: "Trazabilidad", description: "Los registros permanecen disponibles para consultas e históricos." },
        { title: "Control de acceso", description: "Cada usuario accede únicamente a los módulos autorizados según su rol." },
        { title: "Configuración dinámica", description: "Áreas, revisores y mesas pueden administrarse desde la aplicación sin modificar código." },
        { title: "Visibilidad operativa", description: "Los registros diarios alimentan dashboards e indicadores para entender la operación." },
      ],
      capabilities: [
        { title: "Operación", description: "Control del flujo diario de facturas y procesos de revisión desde el registro inicial hasta su consulta histórica.", items: ["Despachos y facturas", "Revisiones, áreas y mesas", "Histórico operativo"] },
        { title: "Logística", description: "Gestión del personal de entrega, disponibilidad, rutas activas y seguimiento operativo.", items: ["Mensajeros y conductores", "Rutas y entregas", "Horarios y control de almuerzos"] },
        { title: "Administración y análisis", description: "Administración del sistema y transformación de registros operativos en información consultable.", items: ["Usuarios y permisos", "Configuración y atención al cliente", "Reportes y dashboards"] },
      ],
      roles: [
        { title: "Administrador", description: "Gestiona usuarios, permisos y parámetros operativos por punto principal o sucursal." },
        { title: "Operativo", description: "Trabaja con los módulos habilitados para su cuenta." },
      ],
      architecture: "Cada área dispone de herramientas específicas. Los módulos comparten una capa de datos que conecta los registros de la operación con su consulta histórica y análisis.",
      layers: [
        { title: "Usuarios", detail: "Acceso a módulos según permisos" },
        { title: "Aplicación React", detail: "Interfaces y lógica de aplicación", items: ["Operación", "Logística", "Administración", "Atención"] },
        { title: "Supabase", detail: "Capa de datos compartida · Persistencia de registros" },
        { title: "Históricos + dashboards", detail: "Consultas, indicadores y análisis de la operación" },
      ],
      technologies: [
        { title: "React", description: "Construcción de una interfaz modular basada en componentes reutilizables." },
        { title: "TypeScript", description: "Tipado de estructuras, formularios y datos para reducir errores durante el desarrollo." },
        { title: "Tailwind CSS", description: "Sistema visual consistente y desarrollo ágil de interfaces responsive." },
        { title: "Supabase", description: "Persistencia de los registros y una capa de datos compartida por los diferentes módulos." },
      ],
      decisions: [
        { title: "Arquitectura modular", description: "Cada área funciona como un módulo independiente dentro de una misma plataforma." },
        { title: "Configuración sin código", description: "Parte de los parámetros operativos puede modificarse desde administración." },
        { title: "Permisos por módulo", description: "Los usuarios reciben acceso únicamente a las herramientas necesarias para su función." },
        { title: "Datos orientados a históricos", description: "Los registros operativos se estructuran para permitir consultas y análisis posteriores." },
      ],
      contribution: [
        "Trabajé en el diseño y desarrollo de la plataforma, desde la estructura de la experiencia y los diferentes flujos operativos hasta la implementación de interfaces, lógica, datos y dashboards.",
        "El producto evolucionó a partir de necesidades reales de la operación, convirtiendo diferentes procesos internos en herramientas digitales conectadas.",
      ],
      responsibilities: ["Product thinking", "UI/UX", "Frontend", "Backend", "Database", "Dashboards"],
      closing: {
        title: "Software diseñado alrededor de una operación real.",
        description: "Portal Logístico Landimotos nació como una herramienta interna y evolucionó hacia una plataforma que conecta diferentes áreas de la operación en un mismo sistema.",
      },
      hero: dashboard,
      gallery: [
        { id: "operacion", title: "Del registro a la trazabilidad", description: "Los registros pueden clasificarse por punto, área, revisor y mesa, creando una trazabilidad estructurada del proceso.", items: [
          screenshot("invoices", "Registro de facturas", "Formulario de registro de facturas con selección de área, revisor y mesa."),
        ] },
        { id: "logistica", title: "Un equipo en movimiento", description: "El sistema permite visualizar disponibilidad, asignar rutas y mantener seguimiento sobre entregas y personal operativo.", items: [
          screenshot("messengers", "Mensajeros y rutas", "Panel de mensajeros con disponibilidad y asignación de rutas."),
        ] },
        { id: "analitica", title: "Datos que se convierten en decisiones", description: "Dashboard e históricos", items: [
          { ...dashboard, caption: "Dashboard e históricos" },
        ] },
      ],
    },
  },
  {
    id: "breckline-web",
    title: "Breckline",
    category: "Sitio de agencia · Proyecto propio",
    description: "Nuestra identidad llevada a la web: servicios, contenido y contacto en una experiencia digital con personalidad.",
    tags: ["Diseño web", "Desarrollo", "Responsive"],
    href: "/#contenido",
    previewTitle: "Ideas que se convierten en experiencias.",
    previewImage: "/assets/images/hero.webp",
    theme: "violet",
  },
  {
    id: "breckline-landing",
    title: "Una idea. Una landing.",
    category: "Landing page · Proyecto propio",
    description: "Una página de servicios que presenta nuestra propuesta y facilita el primer paso hacia un nuevo proyecto.",
    tags: ["UI / UX", "Landing page", "Desarrollo"],
    href: "/landing-page",
    previewTitle: "Convierte visitas en oportunidades reales.",
    previewImage: "/assets/images/responsive.webp",
    theme: "mint",
  },
  {
    id: "nativa-store",
    title: "Nativa Store",
    category: "Tienda online · Concepto de ejemplo",
    description: "Una tienda de productos de bienestar con una experiencia de compra sencilla, visual y pensada para móviles.",
    tags: ["E-commerce", "UI / UX", "Responsive"],
    previewTitle: "Lo natural se siente diferente.",
    previewImage: "/assets/images/responsive.webp",
    theme: "peach",
  },
  {
    id: "orbita-platform",
    title: "Órbita",
    category: "Plataforma web · Concepto de ejemplo",
    description: "Un espacio para organizar proyectos, conectar equipos y mantener el trabajo diario bajo control.",
    tags: ["Aplicación web", "Dashboard", "Desarrollo"],
    previewTitle: "Todo tu equipo. Un solo lugar.",
    previewImage: "/assets/images/soluciones-personalizadas.webp",
    theme: "sky",
  },
  {
    id: "estudio-alma",
    title: "Estudio Alma",
    category: "Sitio creativo · Concepto de ejemplo",
    description: "Un portafolio para un estudio creativo, con una identidad expresiva y sus proyectos como protagonistas.",
    tags: ["Diseño web", "Portafolio", "Identidad digital"],
    previewTitle: "Espacio para las buenas ideas.",
    previewImage: "/assets/images/hero.webp",
    theme: "rose",
  },
];
