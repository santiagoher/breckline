import type { IconName } from "../components/icons";

export type Availability = "available" | "coming-soon";

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly href?: string;
  readonly icon: IconName;
}

export interface NavigationGroup {
  readonly id: string;
  readonly label: string;
  readonly heading: string;
  readonly description: string;
  readonly availability: Availability;
  readonly badge?: string;
  readonly items: readonly NavigationItem[];
}

export interface NavigationLink {
  readonly label: string;
  readonly href: string;
}

export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface Brand {
  readonly id: string;
  readonly name: string;
  readonly logo: ImageAsset;
  readonly monochrome?: boolean;
}

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageAsset;
}

export interface VimeoVideo {
  readonly id: string;
  readonly title: string;
  readonly aspectRatio: "9 / 16" | "16 / 9";
}

export interface Testimonial {
  readonly id: string;
  readonly title: string;
  readonly quote: string;
  readonly video: VimeoVideo;
}

export interface ContactChannel {
  readonly id: "whatsapp" | "email" | "instagram" | "phone" | "location";
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly icon: IconName;
  readonly external?: boolean;
}

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface FooterGroup {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

export const siteConfig = {
  name: "Breckline",
  locale: "es_CO",
  title: "Breckline | Desarrollo web y estrategia digital",
  description:
    "Breckline crea experiencias digitales, sitios web y soluciones de marketing que convierten audiencia en clientes.",
  logo: {
    src: "/assets/logos/Breckline%20logo.svg",
    alt: "Breckline",
    width: 350,
    height: 100,
  },
} as const;

export const navigationGroups: readonly NavigationGroup[] = [
  {
    id: "web",
    label: "Páginas web",
    heading: "Diseño y desarrollo web",
    description: "Creamos sitios y aplicaciones web adaptados a los objetivos de cada negocio.",
    availability: "available",
    items: [
      {
        id: "landing-page",
        label: "Landing pages",
        description: "Páginas enfocadas en campañas, captación de leads y conversión.",
        href: "/landing-page",
        icon: "landingPage",
      },
      {
        id: "ecommerce",
        label: "E-commerce / Tiendas online",
        description: "Tiendas preparadas para vender productos y servicios por internet.",
        href: "/#soluciones-personalizadas",
        icon: "store",
      },
      {
        id: "corporate-websites",
        label: "Sitios web corporativos",
        description: "Sitios profesionales para presentar empresas, servicios y marcas.",
        href: "/#soluciones-personalizadas",
        icon: "corporate",
      },
      {
        id: "custom-platforms",
        label: "Plataformas web a medida",
        description: "Sistemas personalizados con funcionalidades específicas para cada negocio.",
        href: "/#soluciones-personalizadas",
        icon: "platform",
      },
      {
        id: "pwa",
        label: "Aplicaciones web PWA",
        description: "Aplicaciones rápidas e instalables que funcionan desde el navegador.",
        href: "/#pwa",
        icon: "pwa",
      },
    ],
  },
  {
    id: "graphic-design",
    label: "Diseño gráfico",
    heading: "Diseño gráfico",
    description:
      "Creamos piezas visuales que fortalecen la identidad, comunicación y presencia de cada marca.",
    availability: "available",
    items: [
      {
        id: "branding",
        label: "Identidad visual & Branding",
        description: "Logos, identidad corporativa y sistemas visuales para construir marcas memorables.",
        href: "/#contacto",
        icon: "branding",
      },
      {
        id: "social-design",
        label: "Diseño para redes sociales",
        description: "Posts, stories, carruseles y piezas visuales diseñadas para contenido digital.",
        href: "/#contacto",
        icon: "instagram",
      },
      {
        id: "advertising-design",
        label: "Flyers & Publicidad",
        description: "Flyers, promociones, banners y piezas gráficas para campañas publicitarias.",
        href: "/#contacto",
        icon: "megaphone",
      },
      {
        id: "packaging",
        label: "Packaging & Empaques",
        description: "Diseño de cajas, etiquetas, bolsas y empaques que hacen destacar cada producto.",
        href: "/#contacto",
        icon: "package",
      },
      {
        id: "editorial",
        label: "Catálogos & Editorial",
        description: "Catálogos, brochures, portafolios, fichas técnicas y material comercial.",
        href: "/#contacto",
        icon: "landingPage",
      },
      {
        id: "corporate-material",
        label: "Material corporativo",
        description: "Papelería, tarjetas, merchandising y aplicaciones visuales de marca.",
        href: "/#contacto",
        icon: "businessCard",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing digital",
    heading: "Estrategias de marketing",
    description: "Canales de pauta para atraer audiencias relevantes.",
    availability: "coming-soon",
    badge: "¡Muy pronto!",
    items: [
      {
        id: "google-ads",
        label: "Google Ads",
        description: "Llega a clientes con anuncios en Google.",
        icon: "web",
      },
      {
        id: "meta-ads",
        label: "Meta Ads",
        description: "Anuncia tu marca en Facebook e Instagram.",
        icon: "web",
      },
      {
        id: "tiktok-ads",
        label: "TikTok Ads",
        description: "Haz crecer tu negocio en TikTok.",
        icon: "web",
      },
    ],
  },
  {
    id: "audiovisual",
    label: "Producción audiovisual",
    heading: "Producción profesional",
    description: "Contenido visual pensado para conectar con tu audiencia.",
    availability: "coming-soon",
    badge: "¡Muy pronto!",
    items: [
      {
        id: "social-content",
        label: "Grabación de contenido para redes",
        description: "Contenido audiovisual con calidad profesional.",
        icon: "play",
      },
    ],
  },
];

export const navigationLinks = [
  { label: "Contáctanos", href: "/#contacto" },
] as const satisfies readonly NavigationLink[];

export const hero = {
  eyebrow: "En Colombia",
  title: "Agencia de",
  rotatingWords: [
    "Desarrollo web",
    "Marketing digital",
    "Producción audiovisual",
  ],
  description:
    "En Brekline impulsamos negocios creando experiencias digitales que convierten audiencia en clientes.",
  cta: {
    label: "Contáctanos",
    href: "/#contacto",
    icon: "arrow" as const satisfies IconName,
  },
  image: {
    src: "/assets/images/hero.webp",
    alt: "Profesional explorando soluciones digitales en una tableta",
    width: 750,
    height: 770,
  },
  countryFlag: {
    src: "/assets/logos/colombia-cuadrado.svg",
    alt: "Bandera de Colombia",
    width: 90,
    height: 60,
  },
} as const;

export const brands: readonly Brand[] = [
  {
    id: "g21",
    name: "G21",
    logo: {
      src: "/assets/brands/G21 logo new.svg",
      alt: "Logotipo de G21",
      width: 203,
      height: 200,
    },
  },
  {
    id: "landimotos",
    name: "Landimotos",
    logo: {
      src: "/assets/brands/landimotos.webp",
      alt: "Logotipo de Landimotos",
      width: 640,
      height: 256,
    },
  },
  {
    id: "cun",
    name: "CUN",
    monochrome: true,
    logo: {
      src: "/assets/brands/logo cun verde.png",
      alt: "Logotipo de CUN",
      width: 241,
      height: 150,
    },
  },
  {
    id: "tecmacol",
    name: "Tecmacol",
    monochrome: true,
    logo: {
      src: "/assets/brands/Tecmacol logo.svg",
      alt: "Logotipo de Tecmacol",
      width: 120,
      height: 40,
    },
  },
];

export const services: readonly Service[] = [
  {
    id: "pwa",
    title: "Desarrollo de aplicaciones web PWA",
    description:
      "Impulsa tu presencia digital con un sitio web moderno y funcional para mostrar tus servicios o vender online. Sitios rápidos, atractivos y optimizados para generar más clientes.",
    image: {
      src: "/assets/images/responsive.webp",
      alt: "Sitio web adaptable en computadores, tabletas y teléfonos",
      width: 700,
      height: 1125,
    },
  },
  {
    id: "soluciones-personalizadas",
    title: "Desarrollo de soluciones web personalizadas y escalables",
    description:
      "Diseñamos y desarrollamos sitios web personalizados según los requerimientos de tu proyecto, con funcionalidades a medida y una estructura pensada para ofrecer rendimiento, escalabilidad y una experiencia profesional.",
    image: {
      src: "/assets/images/soluciones-personalizadas.webp",
      alt: "Ilustración de una solución web desarrollada a medida",
      width: 1000,
      height: 750,
    },
  },
  {
    id: "seo",
    title: "Posicionamiento SEO",
    description:
      "Optimizamos tu sitio web para mejorar su visibilidad en buscadores, aplicando buenas prácticas técnicas, estructura optimizada y rendimiento adecuado para facilitar su indexación y posicionamiento orgánico.",
    image: {
      src: "/assets/images/seo.webp",
      alt: "Ilustración sobre posicionamiento y optimización SEO",
      width: 1000,
      height: 750,
    },
  },
];

export const showcaseVideos: readonly VimeoVideo[] = [
  {
    id: "1165773816",
    title: "Caso de éxito de Breckline, video 1",
    aspectRatio: "9 / 16",
  },
  {
    id: "1165777972",
    title: "Caso de éxito de Breckline, video 2",
    aspectRatio: "9 / 16",
  },
  {
    id: "1165778727",
    title: "Caso de éxito de Breckline, video 3",
    aspectRatio: "9 / 16",
  },
  {
    id: "1165778848",
    title: "Caso de éxito de Breckline, video 4",
    aspectRatio: "9 / 16",
  },
];

export const testimonials: readonly Testimonial[] = [
  {
    id: "tupperware",
    title: "Cómo Tupperware transformó $255 USD en 1.449 registros efectivos",
    quote:
      "Gracias a la implementación de la Máquina de Leads logramos llevar tráfico masivo y segmentado a nuestra landing, alcanzando más de 120.000 personas con un costo por registro de solo $0,18 USD. Esto nos permitió captar 1.449 nuevos prospectos de manera rápida, rentable y medible.",
    video: {
      id: "1166090132",
      title: "Testimonio sobre la estrategia de generación de leads de Tupperware",
      aspectRatio: "16 / 9",
    },
  },
  {
    id: "insurance",
    title: "De 0 a 865 leads calificados al mes en seguros",
    quote:
      "Logramos crear un canal estable y predecible para captar clientes potenciales. En un sector tan competido como el de los seguros, la calidad de los leads marca toda la diferencia, y hoy contamos con un flujo constante que impulsa nuestras ventas.",
    video: {
      id: "1166090132",
      title: "Testimonio sobre la generación de leads para el sector asegurador",
      aspectRatio: "16 / 9",
    },
  },
];

export const contactDetails = {
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+57 301 5972406",
    href: "https://wa.me/573015972406",
    icon: "whatsapp",
    external: true,
  },
  email: {
    id: "email",
    label: "Email",
    value: "breckline.corporativo@gmail.com",
    href: "mailto:breckline.corporativo@gmail.com",
    icon: "mail",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    value: "@breckline.agency",
    href: "https://www.instagram.com/breckline.agency/",
    icon: "instagram",
    external: true,
  },
  phone: {
    id: "phone",
    label: "Teléfono",
    value: "+57 301 5972406",
    href: "tel:+573015972406",
    icon: "phone",
  },
  location: {
    id: "location",
    label: "Ubicación",
    value: "Villavicencio, Colombia",
    icon: "location",
  },
} as const satisfies Record<ContactChannel["id"], ContactChannel>;

export const contactChannels: readonly ContactChannel[] = [
  contactDetails.whatsapp,
  contactDetails.email,
  contactDetails.instagram,
  contactDetails.phone,
  contactDetails.location,
];

export const contactSection = {
  id: "contacto",
  title: "Cuéntanos tu idea",
  highlight: "Nosotros la hacemos realidad",
  paragraphs: [
    "¿Necesitas una web que venda o un video que impacte? En Breckline desarrollamos landing pages estratégicas y sitios web corporativos diseñados para generar resultados reales y potenciar tu presencia digital.",
    "Además, producimos videos de marketing que fortalecen tu marca y conectan con tu audiencia: contenido digital, videos promocionales y piezas audiovisuales enfocadas en conversión.",
    "Combinamos desarrollo web, producción audiovisual y estrategia digital para atraer clientes potenciales, posicionar tu negocio y maximizar el impacto de tu contenido.",
  ],
  closing: "Cuéntanos tu proyecto y recibe una propuesta personalizada.",
  form: {
    fields: [
      {
        id: "nombre",
        name: "nombre",
        label: "Nombre",
        type: "text",
        autoComplete: "name",
        placeholder: "Ej. Carlos Rodríguez",
      },
      {
        id: "titulo",
        name: "titulo",
        label: "Título",
        type: "text",
        autoComplete: "off",
        placeholder: "Ej. Propuesta de video corporativo",
      },
      {
        id: "mensaje",
        name: "mensaje",
        label: "Mensaje",
        type: "textarea",
        autoComplete: "off",
        placeholder:
          "Cuéntanos los detalles de tu proyecto, objetivos o necesidades...",
      },
    ],
    submitLabel: "Enviar",
    requiredNote: "Todos los campos son obligatorios.",
  },
} as const;

export const projectCallToAction = {
  title: "¿Tienes un proyecto en mente?",
  cta: {
    label: "Hablemos",
    href: "/#contacto",
    icon: "arrow" as const satisfies IconName,
  },
} as const;

export const footer: {
  readonly description: string;
  readonly socialLinks: readonly FooterLink[];
  readonly groups: readonly FooterGroup[];
  readonly copyrightHolder: string;
} = {
  description:
    "Impulsamos negocios creando experiencias digitales que convierten audiencia en clientes.",
  socialLinks: [
    {
      label: "Instagram",
      href: contactDetails.instagram.href,
      external: true,
    },
  ],
  groups: [
    {
      title: "Servicios",
      links: [
        { label: "Aplicaciones web PWA", href: "/#pwa" },
        {
          label: "Soluciones web personalizadas",
          href: "/#soluciones-personalizadas",
        },
        { label: "Posicionamiento SEO", href: "/#seo" },
      ],
    },
    {
      title: "Breckline",
      links: [
        { label: "Inicio", href: "/" },
        { label: "Proyectos", href: "/#proyectos" },
        { label: "Casos de éxito", href: "/#casos-de-exito" },
        { label: "Contacto", href: "/#contacto" },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          label: "Política de privacidad",
          href: "/politica-de-privacidad",
        },
      ],
    },
  ],
  copyrightHolder: "Breckline",
};

