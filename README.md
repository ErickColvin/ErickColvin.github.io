# Portafolio · Erick Colvin

Sitio personal publicado en GitHub Pages: **https://erickcolvin.github.io/**

Página estática hecha a mano con HTML, CSS y JavaScript, sin dependencias ni paso de compilación.

## Qué muestra

- Perfil, experiencia, habilidades y certificaciones (desde el CV).
- Proyectos publicados en GitHub, con barra de lenguajes, flujo de arquitectura y enlaces a código y demos. Los que tienen demo muestran una captura que se recorre al pasar el cursor.
- Fecha de última actualización de cada repositorio, leída en vivo desde la API pública de GitHub.
- Mapa de actividad con los commits por día, al estilo de GitHub.
- CV de una página en `cv.html`, listo para guardar como PDF desde el navegador.

## Animaciones

Red de nodos interactiva en el inicio, título letra por letra, terminal que se escribe sola, contadores, aparición al hacer scroll, tarjetas con inclinación 3D y foco de luz, cinta de tecnologías y bordes con degradado giratorio.

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
