# Portafolio · Erick Colvin

Sitio personal publicado en GitHub Pages: **https://erickcolvin.github.io/**

Página estática hecha a mano con HTML, CSS y JavaScript, sin dependencias ni paso de compilación. Funciona como una app de cinco vistas (Inicio, Trayectoria, Proyectos, Habilidades y Contacto): cada sección cabe en la pantalla, también en un notebook (1366×657), y se cambia con las pestañas, las flechas del teclado o deslizando en el celular.

Está en **español e inglés**: la primera visita pregunta el idioma, después se cambia con el botón ES/EN, y `?lang=en` abre el sitio y el CV en inglés.

## Qué muestra

- Perfil, experiencia, habilidades y certificaciones (desde el CV).
- Cuatro proyectos en formato lista y detalle, cada uno con demo en vivo y dos vistas: **Resumen** (captura que se recorre, arquitectura, lenguajes) y **Caso de estudio** (el reto, las decisiones clave y el resultado con cifras verificables).
- Mapa de actividad con los commits por día, al estilo de GitHub.
- CV de una página en `cv.html`, listo para guardar como PDF desde el navegador.

## Demos en vivo

| Proyecto | Demo | Cómo se arma |
|---|---|---|
| TraceLink V2 | `erickcolvin.github.io/tracelink-preview` | La app web ya trae servicios de prueba: `VITE_DATA_MODE=mock`, `vite build --base /tracelink-preview/`, `basename` en el router y rutas de imágenes con `import.meta.env.BASE_URL` |
| Finanzas Personales | `erickcolvin.github.io/finanzas-preview` | La página responde la API desde datos grabados con `scripts/demos/finanzas-demo-estatica.js`: mismos filtros que el backend, cambios en memoria y exportación a CSV en el navegador |
| Condominio Santa Marta | `erickcolvin.github.io/santa-marta-preview` | Modo demostración propio del proyecto |
| Rayo | `erickcolvin.github.io/rayo-web` | El sitio mismo |

Cada demo es un repositorio público solo con la versión compilada; el código fuente es privado. Para rehacer y publicar una demo con un comando:

```bash
node scripts/demos/construir.mjs tracelink --publicar
node scripts/demos/construir.mjs finanzas --publicar
```

El script clona el repositorio privado en una carpeta temporal, aplica `scripts/demos/<demo>.patch`, compila, agrega el botón de vuelta al portafolio (`insignia.html`) y sube un commit al repositorio de la demo. Finanzas usa los datos grabados en `finanzas-datos.json`; para regrabarlos, levanta su API en modo demostración y corre `node scripts/demos/finanzas-grabar.mjs scripts/demos/finanzas-datos.json`.

## Animaciones

Transiciones entre vistas según la dirección, píldora que sigue a la pestaña activa, red de nodos de fondo que sigue al cursor, título letra por letra, terminal que se escribe sola, contadores, mosaicos de vidrio con foco de luz, capturas de las demos que se recorren solas y mapa de actividad que aparece en ola.

Si el sistema tiene activado "reducir movimiento", la página arranca en modo tranquilo y muestra un aviso para activarlas. El botón ✦ de la barra superior las activa o reduce en cualquier momento; también hay tema claro y oscuro.

## Editar

| Qué | Dónde |
|---|---|
| Textos del perfil, experiencia y contacto | `index.html` |
| Proyectos y casos de estudio, en ambos idiomas | `js/proyectos.js` (campo `en` para el inglés) |
| Textos en inglés de la página | `js/i18n.js` (el español vive en `index.html`) |
| Capturas de los demos | `assets/proyectos/` (imagen alta, 864 px de ancho) |
| CV imprimible | `cv.html` y `css/cv.css` (los proyectos salen de `js/proyectos.js`) |
| Mapa de actividad | `node scripts/actividad.mjs` regenera `js/actividad.js` (requiere `gh auth login`) |
| Colores y estilos | variables al inicio de `css/styles.css` |
| Animaciones y lógica | `js/main.js` |

## Verlo en local

```bash
python -m http.server 4330
```

Luego abre http://localhost:4330.
