# Mejora del portafolio · Estado general

Última actualización: 2026-11-14 (cierre de la ronda, antes de publicar).

## Objetivo y alcance

Elevar la calidad visual, funcional y narrativa de https://erickcolvin.github.io/ manteniendo la estética estelar. Frentes: proyecto de automatización (RPA), vista ampliada de proyectos, componente de video tipo reel, recorrido automático de experiencias cada 8 s, pulido general y carrera 2022–2026.

No se publica ni despliega sin autorización de Erick.

## Dónde se trabaja

- Repositorio `C:\Users\erick\OneDrive\Documents\COLVINSOLUTION\PORTAFOLIO`, rama `main`, sin worktrees (sitio estático sin compilación). Punto de partida: `b7ff310`.
- Vista previa: configuración `portafolio` de `.claude/launch.json` (puerto 4330).

## Decisiones de Erick (2026-11-14)

- No existía ningún proyecto RPA: se crea desde el CV (Power Apps y Power Automate, auditorías 5S+ y gestión documental), sin demo ni capturas.
- El detalle de proyectos sigue siendo un panel; se agrega una vista ampliada en ventana.
- Carrera: 2022–2026 en la web, el inglés y el CV.

## Estado por frente

| Frente | Estado | Archivos |
|---|---|---|
| Proyecto RPA | hecho | `js/proyectos.js` (nuevo primer proyecto, `estado: "interno"`), `js/main.js` (insignia, bloque «sin demo»), `css/styles.css` (`.sin-demo`) |
| Vista ampliada | hecho | `index.html` (`<dialog id="ventana-proyecto">`), `js/main.js` (`abrirVentana`), `css/styles.css` (`.ventana`) |
| Recorrido de experiencias | hecho | `js/recorrido.js`, `css/recorrido.css`, `tests/recorrido.test.mjs` (agente experiencias) |
| Reel | componente listo, sin videos | `js/reel.js`, `css/reel.css`, `GUIONES-VIDEO.md` (agente reel) |
| Revisión de diseño | sin informe | el agente se cortó al terminar la sesión anterior; el coordinador revisó a ojo con las capturas |
| Fechas 2022–2026 | hecho | `index.html`, `js/i18n.js`, `cv.html` |

## Pruebas (resultados reales)

- `node --test tests/`: 15 de 15 pruebas del recorrido pasan (temporizadores simulados).
- Navegador real (Edge sin interfaz, `agentes/coordinador/prueba-navegador.js`): recorrido parte en 1 de 5, a los 7,6 s sigue en 1 y a los 8,5 s pasa a 2; pausar mantiene la posición 8,6 s; continuar avanza; la rueda, la tecla RePág y cambiar de vista lo pausan; en la última muestra «Reiniciar» sin bucle; el foco no se mueve. Ventana: abre con foco dentro, 1058 px de ancho en 1440 (antes no existía), cabe en pantalla con scroll interno, fondo inerte, Escape/cerrar devuelve el foco al botón «Ampliar», el contenido se vacía al cerrar.
- Movimiento reducido + inglés (`prueba-reducido.js`): «Start tour» → «Pause», avanza a «Experience 2 of 5» a los 8 s, barra y ventana sin animación, contacto con mailto, LinkedIn, GitHub y CV correctos, hora local igual a America/Santiago.
- Cada vista y ficha cabe sin scroll en 1440×900, 1366×768, 1366×657, 1280×720, 1024×768 y 1180×820, en español e inglés.
- 13 celulares y tablets (`dispositivos.mjs`): sin desbordes, nada cortado, botones táctiles ≥ 32 px (el del recorrido 166×44), diálogo de idioma entero.
- CV: 4 proyectos con demo, carrera 2022–2026, alto de una hoja A4.

## No verificado

- Reproducción de video real: no hay videos en el repositorio (ver `GUIONES-VIDEO.md`).
- Teléfono físico, Safari/iOS y lector de pantalla real.
- Pausa del recorrido al ocultar la pestaña: cubierta por el código (`visibilitychange`) y no probada en navegador.

## Capturas

`capturas/antes/` y `capturas/despues/` (escritorio 1440×900 y móvil 390×844; además `ventana-*` para la vista ampliada).

## Siguiente acción exacta

Esperar la autorización de Erick para publicar (`git push origin main`). Cuando grabe videos: ponerlos en `assets/videos/` y agregar el campo `video` del proyecto en `js/proyectos.js` según `GUIONES-VIDEO.md`.
