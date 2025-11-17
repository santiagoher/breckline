# Assets - Breckline

Esta carpeta contiene todos los recursos estáticos del proyecto.

## 📁 Estructura

### `/images`
Imágenes generales del sitio web:
- Fotos de proyectos
- Imágenes de fondo
- Ilustraciones
- Cualquier imagen que se use en el contenido

**Ejemplo de uso:**
```html
<img src="./src/assets/images/proyecto-1.jpg" alt="Proyecto 1">
```

### `/logos`
Logos y marcas de Breckline:
- Logo principal
- Variantes del logo (horizontal, vertical, icono)
- Formatos: SVG (recomendado), PNG, JPG

**Ejemplo de uso:**
```html
<img src="./src/assets/logos/breckline-logo.svg" alt="Breckline">
```

### `/icons`
Iconos personalizados:
- Iconos SVG personalizados
- Favicons
- Iconos que no están en librerías externas

**Ejemplo de uso:**
```html
<img src="./src/assets/icons/custom-icon.svg" alt="Icono">
```

## 📝 Recomendaciones

- **Formatos preferidos:**
  - Imágenes: WebP, JPG, PNG
  - Logos: SVG (escalable y ligero)
  - Iconos: SVG

- **Optimización:**
  - Comprime las imágenes antes de agregarlas
  - Usa herramientas como TinyPNG o ImageOptim
  - Para producción, considera usar un CDN

- **Nomenclatura:**
  - Usa nombres descriptivos en minúsculas
  - Separa palabras con guiones: `mi-imagen.jpg`
  - Evita espacios y caracteres especiales

