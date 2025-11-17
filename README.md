# Breckline - Portafolio Web

Sitio web profesional para Breckline, ofreciendo servicios de desarrollo web y marketing digital.

## 🚀 Tecnologías

- **HTML5** - Estructura semántica
- **Tailwind CSS** - Framework CSS utility-first para diseño moderno y responsivo
- **JavaScript** - Interactividad básica

## 📁 Estructura del Proyecto

```
breckline/
├── src/
│   ├── assets/
│   │   ├── images/        # Imágenes del proyecto
│   │   ├── logos/         # Logos de Breckline
│   │   └── icons/         # Iconos personalizados
│   ├── css/
│   │   └── input.css      # Archivo CSS principal con directivas de Tailwind
│   └── js/
│       └── main.js        # Script JavaScript principal
├── dist/
│   └── output.css         # CSS compilado y minificado (generado)
├── index.html             # Página principal
├── package.json           # Dependencias y scripts
├── tailwind.config.js     # Configuración de Tailwind CSS
├── postcss.config.js      # Configuración de PostCSS
└── README.md              # Este archivo
```

## 🛠️ Instalación

1. **Instalar dependencias:**
```bash
npm install
```

## 📝 Scripts Disponibles

- **`npm run build`** - Compila y minifica el CSS de Tailwind para producción
- **`npm run watch`** - Compila el CSS en modo desarrollo con recarga automática
- **`npm run dev`** - Alias para `watch`

## 🎨 Desarrollo

1. **Instalar dependencias:**
```bash
npm install
```

2. **Iniciar modo desarrollo (con watch):**
```bash
npm run dev
```

3. **Abrir `index.html` en tu navegador** o usar un servidor local:
```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

## 🏗️ Producción

Para generar los archivos de producción:

```bash
npm run build
```

Esto generará el archivo `dist/output.css` minificado y optimizado para producción.

## 📦 Secciones del Sitio

- **Inicio** - Hero section con llamada a la acción
- **Servicios** - Catálogo de servicios ofrecidos
- **Portafolio** - Galería de proyectos realizados
- **Nosotros** - Información sobre la empresa
- **Contacto** - Formulario de contacto

## 📂 Organización de Assets

### Imágenes
Coloca todas las imágenes del proyecto en `src/assets/images/`. Puedes referenciarlas en el HTML así:
```html
<img src="./src/assets/images/mi-imagen.jpg" alt="Descripción">
```

### Logos
Los logos de Breckline van en `src/assets/logos/`. Para usar el logo en el HTML:
```html
<img src="./src/assets/logos/logo.svg" alt="Breckline Logo">
```

### Iconos
Iconos personalizados (SVG, PNG, etc.) van en `src/assets/icons/`.

### Scripts JavaScript
Todos los scripts JavaScript deben ir en `src/js/`. El archivo principal es `main.js` y ya está incluido en `index.html`.

## 🎨 Personalización

### Colores

Los colores principales se pueden modificar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Personaliza los colores aquí
  }
}
```

### Estilos Personalizados

Los componentes personalizados están definidos en `src/css/input.css` usando las directivas `@layer components`.

## 📱 Responsive Design

El sitio está completamente optimizado para:
- 📱 Móviles
- 📱 Tablets
- 💻 Desktop
- 🖥️ Pantallas grandes

## 📄 Licencia

MIT

---

Desarrollado con ❤️ por Breckline

