# Breckline

Sitio comercial de Breckline construido para producción con Next.js, React, TypeScript y Tailwind CSS. La aplicación prioriza SEO, accesibilidad, rendimiento, privacidad y una integración segura del formulario de contacto.

## Stack

- Next.js 16 con App Router y Server Components.
- React 19 y TypeScript estricto.
- Tailwind CSS 4.
- Supabase para almacenar solicitudes de contacto.
- Zod para validar datos en el servidor.
- reCAPTCHA v2 verificado en el servidor.
- Montserrat alojada localmente y Adobe Fonts como tipografía de display.

## Requisitos

- Node.js 22 o superior.
- npm 10 o superior.
- Un proyecto de Supabase con la tabla `clientes`.
- Claves de reCAPTCHA v2 para el dominio donde se publicará el sitio.

## Desarrollo local

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Completa `.env.local` antes de probar el formulario. Next.js recarga automáticamente los cambios de componentes y estilos.

## Variables de entorno

| Variable | Exposición | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Pública | URL canónica, sitemap y metadatos. |
| `NEXT_PUBLIC_GTM_ID` | Pública | Contenedor de GTM; solo se carga después del consentimiento. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Pública | Widget reCAPTCHA del formulario. |
| `RECAPTCHA_SECRET_KEY` | Servidor | Verificación del token reCAPTCHA. |
| `SUPABASE_URL` | Servidor | URL del proyecto Supabase. |
| `SUPABASE_SECRET_KEY` | Servidor | Clave secreta para insertar desde el endpoint protegido. |

Nunca añadas `NEXT_PUBLIC_` a una clave secreta. `.env.local` está ignorado por Git; `.env.example` solo contiene nombres y valores de ejemplo.

## Scripts

```bash
npm run dev              # Servidor de desarrollo en localhost:3000
npm run lint             # ESLint con cero advertencias permitidas
npm run typecheck        # Comprobación TypeScript sin emitir archivos
npm run build            # Build optimizado de producción
npm run start            # Servidor del build de producción
npm run check            # Lint + tipos + build
npm run optimize:assets  # Regenera WebP optimizados desde src/assets
```

## Arquitectura

```text
src/
├─ app/
│  ├─ api/contact/            # Endpoint seguro del formulario
│  ├─ landing-page/           # Página del servicio
│  ├─ politica-de-privacidad/ # Información de privacidad
│  ├─ layout.tsx              # Metadatos y datos estructurados
│  └─ page.tsx                # Página principal
├─ components/                # UI reutilizable e interacciones aisladas
├─ data/site.ts               # Contenido y navegación tipados
├─ lib/                       # Validación, URL y cliente Supabase servidor
└─ assets/                    # Activos originales

public/assets/                # Activos optimizados publicados
scripts/optimize-assets.mjs   # Pipeline reproducible de imágenes
legacy/landing-page.html      # Landing HTML anterior
index.html, src/js, src/css/  # Fuentes históricas excluidas del build
```

Los componentes son de servidor por defecto. Solo navegación, texto animado, progreso, consentimiento, reproductores y formulario envían JavaScript al navegador.

## Flujo del formulario

```text
ContactForm
  → POST /api/contact
  → límite de 16 KiB y validación Zod
  → honeypot anti-spam
  → verificación reCAPTCHA en Google
  → insert servidor → tabla clientes en Supabase
```

La tabla existente debe contener, como mínimo, las columnas de texto `nombre`, `titulo` y `mensaje`. Para producción:

- Mantén RLS activado en cualquier tabla de un esquema expuesto.
- No concedas lectura, actualización ni eliminación pública de `clientes`.
- No permitas inserts anónimos directos; las escrituras deben pasar por `/api/contact`.
- Usa una clave secreta nueva (`sb_secret_...`) exclusivamente en el servidor y rótala si se expone.
- Revisa grants, políticas y asesores de seguridad desde Supabase antes del despliegue.

El repositorio no incluye credenciales ni modifica automáticamente el esquema remoto.

## Privacidad y servicios externos

- GTM no se descarga hasta que el visitante acepta la analítica.
- La preferencia puede cambiarse desde el botón `Privacidad`.
- Vimeo usa una fachada: ningún reproductor se carga hasta pulsar reproducir.
- reCAPTCHA solo se carga donde existe el formulario.
- La política está disponible en `/politica-de-privacidad`.

## Producción

Ejecuta antes de desplegar:

```bash
npm run check
```

Configura todas las variables en el proveedor de hosting y despliega como aplicación Next.js con Node.js 22. El proyecto funciona directamente en Vercel y en cualquier plataforma que ejecute `npm run build` seguido de `npm run start`.

El build genera también `robots.txt`, `sitemap.xml`, manifest, icono y tarjetas Open Graph/Twitter.

## Fuentes históricas

El HTML y JavaScript anteriores se conservan únicamente como referencia de la migración y no forman parte del build de Next.js. No deben publicarse como un segundo sitio estático.


## documentacion explicacion de la aplicacion contendor de informacion pendiente por verificar para la actualizacion de la aplicacion
