# Portafolio · Erick Colvin

Sitio personal publicado en GitHub Pages: **https://erickcolvin.github.io/**

Página estática hecha a mano con HTML, CSS y JavaScript, sin dependencias ni paso de compilación. Funciona como una app de cinco vistas (Inicio, Trayectoria, Proyectos, Habilidades y Contacto): cada sección cabe en la pantalla y se cambia con las pestañas, las flechas del teclado o deslizando en el celular.

## Qué muestra

- Perfil, experiencia, habilidades y certificaciones (desde el CV).
- Cuatro proyectos en formato lista y detalle, con código privado y una demo en vivo cada uno: captura que se recorre al pasar el cursor, flujo de arquitectura, barra de lenguajes y fecha de la última publicación de la demo (en vivo desde la API pública de GitHub).
- Mapa de actividad con los commits por día, al estilo de GitHub.
- CV de una página en `cv.html`, listo para guardar como PDF desde el navegador.

## Demos en vivo

| Proyecto | Demo | Cómo se arma |
|---|---|---|
| TraceLink V2 | `erickcolvin.github.io/tracelink-preview` | La app web ya trae servicios de prueba: `VITE_DATA_MODE=mock`, `vite build --base /tracelink-preview/`, `basename` en el router y rutas de imágenes con `import.meta.env.BASE_URL` |
| Finanzas Personales | `erickcolvin.github.io/finanzas-preview` | Se graba la API en modo demostración con `scripts/demos/finanzas-grabar.mjs` y la página responde desde esos datos con `scripts/demos/finanzas-demo-estatica.js` (mismos filtros que el backend; los cambios quedan en memoria) |
| Condominio Santa Marta | `erickcolvin.github.io/santa-marta-preview` | Modo demostración propio del proyecto |
| Rayo | `erickcolvin.github.io/rayo-web` | El sitio mismo |

Cada demo es un repositorio público solo con la versión compilada. `scripts/demos/insignia.html` es el botón "Demo con datos de prueba" que vuelve al portafolio.

## Animaciones

Transiciones entre vistas según la dirección, píldora que sigue a la pestaña activa, red de nodos de fondo que sigue al cursor, título letra por letra, terminal que se escribe sola, contadores, mosaicos de vidrio con foco de luz, capturas de las demos que se recorren solas y mapa de actividad que aparece en ola.

Si el sistema tiene activado "reducir movimiento", la página arranca en modo tranquilo y muestra un aviso para activarlas. El botón ✦ de la barra superior las activa o reduce en cualquier momento; también hay tema claro y oscuro.

## Editar

| Qué | Dónde |
|---|---|
| Textos del perfil, experiencia y contacto | `index.html` |
| Proyectos (agregar, quitar, cambiar textos) | `js/proyectos.js` |
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
