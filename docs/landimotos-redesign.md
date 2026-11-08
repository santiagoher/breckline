# Rediseño del caso Landimotos

## Implementación

La ruta `/proyectos/portal-logistico-landimotos` utiliza `LandimotosCaseStudy` y su CSS Module. La rama se limita al identificador de Landimotos; conserva los contenedores originales `ProjectMotion` y `main`, así como navbar, footer, consentimiento y metadatos.

La lectura se organiza en portada, reto y solución, demo protegida, galería, resultado y contacto. Se retiró de la portada la ficha de cliente, proyecto y servicios. Se eliminan de esta página los bloques repetidos de áreas, capacidades, arquitectura, stack y cierre con otro dashboard.

La portada centra el título «Toda la operación, en un mismo lugar.» y la explicación, sin etiqueta superior. El texto tiene un ancho máximo de 820 px y el visual de 1440 px. La separación actual es de 128 px en escritorio y 64 px en móvil, ampliada en los ajustes posteriores al refinamiento de scroll. El espacio superior es de 104–136 px en escritorio y 80 px en móvil, sin alturas fijas. El fondo de la portada es `#080811` a todo el ancho; el padding lateral conserva el ancho anterior del contenido. Este fondo se limita a `.hero` y no cambia el de las secciones siguientes.

El video utiliza un contenedor redondeado con borde lavanda de 1 px, superficie violeta translúcida y resplandor estático violeta con transición azul inferior. El relleno actual es de 22 px en escritorio y 10 px en móvil; los radios exteriores son de 28 y 18 px. El efecto se sitúa detrás de una superficie opaca que contiene la grabación: no añade brillo ni filtros al video. Estos estilos se limitan a `landimotos-hero-video.module.css`. No se añade barra de navegador, numeración ni pie de imagen. No se recibieron las capturas de referencia mencionadas en la solicitud; la aproximación visual sigue su descripción detallada.

`LandimotosHeroMedia` utiliza el PNG proporcionado por el usuario, `public/assets/images/Intranet landimotos panel operativo.png` (2559 × 1352, 205136 bytes), como imagen inicial del video. Si se retira la configuración de video, muestra ese PNG mediante `next/image` con `unoptimized`. Se conserva la proporción completa y se reserva el aspecto 16:9 del video para evitar cambios de altura al iniciar la reproducción.

En la galería se reutiliza `ProjectVisual` sin modificarlo: facturas en una vista amplia y rutas en un acercamiento. En móvil ambas vistas permiten desplazamiento horizontal táctil y con teclado. Los WebP existentes siguen marcados como placeholders; las vistas de galería se identifican como conceptuales, sin datos reales. No se añadieron métricas ni funcionalidades inventadas.

## Incorporación de video

La grabación proporcionada por el usuario es `public/assets/images/video completo demo opertivo.mkv` (83593805 bytes). La versión servida en la portada es `public/assets/videos/landimotos-demo-operativo.mp4` (4129684 bytes): conserva los aproximadamente 1:51 completos, resolución 2560 × 1440 y audio AAC original. Se codifica en H.264, 30 fps, formato de píxel yuv420p y metadatos al inicio del archivo (`faststart`). El MKV original se conserva y no se referencia desde el reproductor.

La prop opcional `video` de `LandimotosCaseStudy` acepta `{ src, type, width, height }`, con MIME `video/mp4` o `video/webm`. Está configurada desde la página con el MP4 y sus dimensiones reales. La conversión se realizó con FFmpeg 7.1, sin añadir dependencias a la aplicación:

```powershell
ffmpeg -i "public/assets/images/video completo demo opertivo.mkv" -map 0:v:0 -map "0:a:0?" -c:v libx264 -preset medium -crf 20 -r 30 -pix_fmt yuv420p -threads 4 -c:a copy -movflags +faststart "public/assets/videos/landimotos-demo-operativo.mp4"
```

`LandimotosHeroVideo` sustituye todos los controles nativos por un único botón circular en la esquina inferior derecha, con etiquetas «Pausar video» y «Reanudar video». Los eventos reales del elemento y los rechazos de `play()` sincronizan el icono. Pausar y reanudar conserva `currentTime`; los renders, cambios de tamaño y reentradas en pantalla no producen intentos automáticos adicionales.

La grabación se reproduce automáticamente, silenciada, en bucle y dentro de la página. El único intento inicial de reproducción ocurre después de consultar `prefers-reduced-motion`: si está activado, queda pausada y puede iniciarse mediante el botón. Activar esa preferencia durante la reproducción la pausa; desactivarla no fuerza una reanudación. El intento automático se protege también frente a la repetición de efectos de React Strict Mode. Se conserva `preload="none"`; el archivo se solicita al iniciar reproducción (automáticamente en modo normal, o por el usuario en movimiento reducido). Sin la prop `video` se renderiza únicamente la imagen.

Los estilos nuevos solo alcanzan las secciones editoriales. La portada incorpora el movimiento de scroll descrito abajo; las transiciones de enlaces respetan movimiento reducido. El contenido editorial funciona sin JavaScript.

## Sección protegida

`LandimotosProcessShowcase` continúa inmediatamente después del contexto y antes de la galería, sin props ni contenedor adicional.

Archivos conservados y comparados mediante SHA-256 antes y después:

- `src/components/landimotos-process-showcase.tsx`
- `src/components/landimotos-process-player.tsx`
- `src/components/landimotos-process.module.css`
- `src/components/use-process-playback.ts`
- `src/components/process-playback-controller.ts`
- `src/data/landimotos-processes.ts`
- `src/data/landimotos-process-demos.ts`
- `src/components/icons.tsx`
- `src/components/project-motion.tsx`
- `src/components/project-study.module.css`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/site-header.tsx`
- `src/components/site-footer.tsx`

En Chrome, a 1440, 1024, 768, 390 y 320 px, la comparación del DOM de la sección conserva texto, estilos calculados, dimensiones y posiciones relativas de todos los elementos visibles. Se excluye de la comparación de coordenadas la posición de elementos de tamaño cero ocultos por CSS. La posición vertical de la sección en la página cambia al acortar la introducción.

## Validación

- TypeScript y build de producción correctos.
- ESLint correcto con `npm.cmd run lint -- --ignore-pattern .codex-tmp/**`. El lint sin exclusión detecta dos errores preexistentes de `no-require-imports` en `.codex-tmp/process-layout.cjs`; no se modificó ese archivo ni la configuración compartida.
- Revisión visual en escritorio y móvil; comprobación automatizada en los cinco anchos indicados: sin desbordamiento horizontal de página, IDs duplicados o anclas internas rotas.
- Enlaces a demo y contacto verificados mediante navegación; destinos de proyectos presentes. Galería móvil operable con flechas y foco visible.
- Contenido editorial y enlaces visibles sin JavaScript; sin errores de ejecución en navegador.
- `scripts/verify-landimotos-processes.cjs`: 19 de 21 comprobaciones pasan tanto antes como después. Los seis procesos mantienen sus tiempos de finalización, estados, selección por teclado, reinicios y controles de movimiento reducido.

Dos incidencias existentes se reproducen con el mismo resultado antes y después y se mantienen fuera del rediseño por la protección explícita de la demo:

1. La prueba sintética de visibilidad de pestaña no alcanza el segundo paso en el instante esperado (`1 !== 2`). No constituye una prueba del throttling real de pestañas en segundo plano.
2. A 390 px, seleccionar rutas cambia la altura del reproductor de 1476,4375 a 1481,21875 px (4,78125 px). Los demás escenarios conservan la primera altura.

Evidencias locales de esta revisión: `.codex-tmp/landimotos-redesign/before/` y `after/`, con capturas, hashes, snapshots y reportes JSON. La demo no se modificó para hacer pasar las dos pruebas preexistentes.

La revisión de la portada centrada añade evidencias en `centered-before/` y `centered-after/` dentro del mismo directorio. `hero-qa.json` comprueba los cinco anchos: resolución original, relación de aspecto, alineación centrada, imagen como hija directa de la sección sin contenedor ornamental, ausencia de bordes/relleno/sombra, textos retirados, ausencia de controles de video y de desbordamientos. La comparación de contenido, estilos y geometría de todos los elementos visibles de la sección protegida vuelve a dar cero diferencias.

En esta última revisión, build (incluido TypeScript) y lint con la exclusión de temporales pasan. La suite de la demo registra 18 de 21 comprobaciones correctas: las dos incidencias anteriores y una comprobación intermitente de entrada que espera solo 45 ms al `IntersectionObserver`. Una comprobación aislada, repetida tres veces sin cambiar el código de la demo, confirma estado inicial neutro al 20% y reproducción al 40% esperando hasta 250 ms adicionales al observador; dos de las tres repeticiones también pasan con 45 ms. Los seis recorridos completos mantienen los mismos tiempos por paso de la revisión anterior. No se modificaron el reproductor, sus tiempos ni el script original para ocultar estas limitaciones de validación.

## Validación del control personalizado

- Build con TypeScript y lint de la aplicación correctos; se excluyen los temporales del lint por los errores preexistentes descritos arriba.
- Chrome a 1440, 1024, 768, 390 y 320 px: etiqueta eliminada, un solo botón, ausencia de controles nativos, proporción 16:9, separaciones 72/36 px y sin desbordamiento horizontal.
- Reproducción automática y bucle reales; movimiento reducido inicia pausado y permite reproducción manual.
- Pausa y reanudación con ratón, Espacio y Enter; conservación del punto de reproducción después de scroll, cambios de tamaño y cambios de preferencia de movimiento.
- Icono sincronizado también con eventos de reproducción/pausa externos al botón y con rechazo simulado de autoplay. Un solo intento automático, reintento manual funcional y ninguna reanudación automática tras una pausa manual.
- Cero diferencias de contenido, estilos y geometría de elementos visibles de la sección protegida en los cinco anchos. Hashes de sus archivos y dependencias compartidas idénticos antes y después.
- SHA-256 del MP4 sin cambios: no se modificó la grabación en esta revisión.

Capturas y reporte: `.codex-tmp/video-review/custom/`. Comparación de la sección protegida: `.codex-tmp/landimotos-redesign/custom-before/` y `custom-after/`.

## Refinamiento de portada vinculado al scroll

`LandimotosHeroMotion` envuelve exclusivamente el texto y el visual de portada. Reutiliza el patrón del repositorio de evento de scroll pasivo y `requestAnimationFrame`, sin dependencias adicionales ni estado de React por fotograma. El progreso se calcula desde la posición del scroll y las dimensiones reales sin transformar; se recalcula al cambiar tamaño o cargar fuentes.

El texto sube hasta 72 px y pierde opacidad, mientras el conjunto de video, franja y resplandor asciende hasta 56 px además del desplazamiento natural de la página. En móvil los recorridos son de 24 y 18 px. El desplazamiento adicional del visual vuelve suavemente a cero durante la salida, antes del contenido siguiente. No se añade altura de scroll, sticky, zoom, recorte ni temporizador; la trayectoria se revierte al subir. El enlace a `#project-title` conserva una posición de lectura visible bajo la navegación.

Con `prefers-reduced-motion`, CSS muestra la composición estática y se retira el listener de scroll de la portada. Cambiar esta preferencia en una página abierta restaura la composición correspondiente. El componente de reproducción y el MP4 permanecen sin cambios: la animación no accede a `currentTime`, no llama a `play()` y no remonta el video.

Validación de este refinamiento:

- Chrome en 1440×900, 1366×768, 1920×1080, 1024×600, 768×1024, 390×844 y 320×700. Separaciones 88/44 px, rellenos 22/10 px, borde de 1 px, video completo 16:9 sin filtros ni desbordamiento horizontal.
- En 1366×768 quedan visibles inicialmente 330 px de alto del video; en 1024×600, 204 px. En los tamaños móviles probados se muestra el video completo.
- Recorridos continuos medidos en pasos de 20 px hacia abajo y hacia arriba, además de entrada real de rueda. Posición y opacidad coinciden al regresar al mismo punto, sin saltos, solapamientos, cambios de escala ni altura de documento. La presentación permanece inmóvil al detener el scroll.
- Reproducción automática, botón único sin controles nativos, teclado, pausa persistente después de scroll/resize, reproducción mientras se desplaza la página, preferencia de movimiento cambiada en ejecución y rechazo simulado de autoplay correctos. El tiempo pausado permanece idéntico durante todos los recorridos.
- Movimiento reducido comprobado desde la carga en escritorio y móvil: texto visible, transformaciones ausentes, video inicialmente pausado y reproducción manual disponible.
- Los 14 archivos protegidos/compartidos conservan SHA-256. En cinco anchos, los 495 nodos de escritorio y 499 de móvil mantienen textos, estilos y geometría relativa. El MP4 también conserva su SHA-256.
- Comprobación adicional de la demo en escritorio y móvil: seis selectores, navegación con teclado, control de movimiento reducido, avance real de pasos y texto inferior. El enlace de regreso a la portada funciona en escritorio; su barra permanece oculta en móvil, donde se comprobó el destino mediante navegación nativa al fragmento.
- TypeScript, build y lint de la aplicación correctos (misma exclusión de temporales descrita anteriormente).

Evidencias: `.codex-tmp/video-review/scroll/` contiene capturas, trayectorias y `qa.json`; `.codex-tmp/landimotos-redesign/scroll-before/` y `scroll-after/` contienen la comparación protegida y el reporte de integración. No se recibió una grabación adjunta de referencia para contrastar visualmente su movimiento; la implementación sigue la descripción del usuario. Las pruebas móviles usan viewports emulados de Chrome, no dispositivos físicos. No se volvió a ejecutar la suite completa de tiempos de la demo, cuyas limitaciones anteriores se documentan arriba.
