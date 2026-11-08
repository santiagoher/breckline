# Case study de Landimotos

Ruta: `/proyectos/portal-logistico-landimotos`.

## Segunda pasada visual

Se reutilizan la ruta estática, metadata, navbar, footer, tipografías, `ProjectMotion`, `ProjectVisual` y el lightbox de `ProjectGallery`. No se añadieron dependencias ni se modificó la portada de Landimotos en la home o el proyecto Breckline.

Composición: hero con dashboard → convergencia de cinco áreas → reto/solución editorial → tres enlaces con preview → galería narrativa de tres escenas → momento tipográfico → capacidades → arquitectura vinculada al scroll → stack → participación → cierre abierto con producto parcialmente visible.

El texto editorial inicial pasa de aproximadamente 755 a 263 palabras (65% menos), contando el HTML generado, sin texto de las interfaces ilustrativas, duplicados decorativos, previews ocultos ni detalles cerrados. Las capacidades secundarias de permisos, configuración, atención, WhatsApp y disponibilidad se conservan en un desplegable. El contenido extenso original sigue disponible en `src/data/projects.ts`.

## Recursos visuales

Se revisaron los recursos del proyecto. Los WebP de `public/projects/landimotos-logistics/` son placeholders antiguos, no capturas reales. Se mantienen las vistas SVG construidas en código y señaladas como «Vista conceptual · Sin datos reales». No se cargan esos WebP como si fueran capturas del software.

| Archivo | Posición |
| --- | --- |
| `dashboard.webp` | Hero, analítica y cierre |
| `invoices.webp` | Registro de facturas |
| `messengers.webp` | Mensajeros y rutas |

Para incorporar capturas reales:

1. Sustituir el WebP correspondiente con una captura revisada y anonimizada.
2. Ajustar `width`, `height`, `alt` y `caption` en `src/data/projects.ts`; cambiar `placeholder` a `false` para ese recurso. El dashboard se comparte entre hero y galería.
3. Ejecutar `npm run check` y regenerar el sitio.

`isProjectImageReady` conserva la comprobación de archivos: si falta una captura, se muestra la vista conceptual. Solo el hero real se precarga; las imágenes del cuerpo usan carga diferida y tamaños adaptados a la galería amplia. El lightbox se conserva para capturas reales, con Escape, flechas, cierre exterior y retorno de foco.

## Movimiento y responsive

- Un Intersection Observer activa los reveals una sola vez.
- Contexto: entrada escalonada, dibujo SVG y destino con glow; secuencia de aproximadamente 1,65 s.
- Galería: opacity, translateY de 50 px, scale de .96 y clip-path durante 850 ms.
- Áreas: enlaces navegables por teclado; preview y movimiento de 4 px en hover de escritorio. Tablet y móvil no dependen del hover.
- Arquitectura: la línea sigue el punto de lectura al 68% del viewport mediante un listener pasivo y requestAnimationFrame. Nodos alcanzados y nodo activo se calculan a partir de sus posiciones reales. No hay temporizador independiente.
- El fondo tipográfico se desplaza lentamente y se pausa al hover; se oculta en móvil. El stack permanece estático.
- Layouts a 1023 y 639 px; galería casi a todo el ancho, composiciones apiladas y timeline simplificado en móvil. Sin parallax.
- `prefers-reduced-motion` desactiva movimiento, muestra todos los nodos y completa las líneas. También se atienden cambios de preferencia durante la visita.
- Sin JavaScript o sin Intersection Observer, el contenido y la arquitectura permanecen visibles.

Los estilos están aislados en `project-study.module.css`. Los anchos varían entre el contenido editorial (hasta 1280 px), hero (1510 px) y galería (1550 px). El siguiente proyecto usa el primer enlace existente después de Landimotos en `portfolioProjects`; actualmente es Breckline (`/#contenido`).

## Validación de esta pasada

- `npm run check`: lint, TypeScript y build de producción correctos.
- HTML generado: tres escenas, cuatro nodos, sin IDs duplicados ni enlaces internos sin destino.
- Revisión de código responsive, motion reducido y fallback sin JavaScript.
- Validación visual desktop/tablet/mobile pendiente: no hay navegador conectado; el servicio nativo Computer Use tampoco estaba disponible. No se afirma haber comprobado capturas renderizadas, overflow real o animaciones en un navegador.

No se modificó el backend ni se añadieron afirmaciones sobre servicios de autenticación del producto.
