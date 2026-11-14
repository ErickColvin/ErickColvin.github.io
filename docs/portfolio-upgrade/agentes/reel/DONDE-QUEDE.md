# Agente «reel» · Dónde quedé

Última actualización: 2026-11-14 (trabajo terminado; sin commit ni push).

## Objetivo y alcance

Componente reutilizable de video tipo reel para las fichas de proyecto, listo para cuando lleguen los videos. Hoy no hay ningún video en el repositorio: no se publican videos falsos, archivos vacíos ni botones que no funcionen. Un proyecto sin `video` sigue mostrando su captura.

Solo puedo tocar: `js/reel.js`, `css/reel.css`, `docs/portfolio-upgrade/GUIONES-VIDEO.md` y esta carpeta.

## Archivos creados

- `js/reel.js`: expone `window.Reel`.
- `css/reel.css`: estilos del reproductor.
- `docs/portfolio-upgrade/GUIONES-VIDEO.md`: qué grabar, especificaciones, nombres de archivo y un guion por proyecto.
- `docs/portfolio-upgrade/agentes/reel/prueba.html`: página de prueba (no enlazada, `noindex`).
- `docs/portfolio-upgrade/agentes/reel/medir.js`: expresión de prueba para `navegador.mjs medir`.
- `docs/portfolio-upgrade/agentes/reel/capturas/`: `escritorio-portadas.jpg`, `escritorio-fallo.jpg`, `movil-portadas.jpg`.

No toqué `index.html`, `css/styles.css`, `js/main.js` ni `js/proyectos.js`.

## API

- `Reel.tiene(p)` → `true` solo si `p.video.src` y `p.video.poster` son cadenas no vacías.
- `Reel.html(p, textos?)` → HTML del reproductor, o `""` si no tiene video. `textos` es opcional y permite cambiar `reproducir`, `repetir`, `fallo`, `portada`, `video`, `de`, `duracion`, `subtitulos`; sin él usa español o inglés según `data-idioma`.
- `Reel.montar(contenedor?)` → conecta un único listener delegado en el contenedor (o en `document`); devuelve cuántos reproductores hay dentro. Repetir la llamada no agrega listeners, y sirve aunque el contenido se vuelva a pintar.
- `Reel.detener(contenedor?)` → pausa, vacía y quita todos los `<video>` del contenedor y vuelve a la portada.
- `Reel.espera` → milisegundos que se espera a los metadatos antes de dar el video por fallado (12000).

Dato: `video: { src, poster, formato: "9:16" | "16:9" | "4:3", duracion?, webm?, subtitulos? }`. `subtitulos` admite una ruta o `{ es, en }`. Formato desconocido o ausente: 16:9.

## Decisiones y razones

- El `<video>` no existe hasta pulsar: así no hay ninguna petición de video al cargar. Se crea con `controls`, `playsinline`, `preload="metadata"` y sin `autoplay`.
- El botón cubre toda la portada (objetivo amplio) y muestra una pastilla de 44 px de alto con texto «Ver video»: un triángulo solo es menos claro. El nombre accesible incluye el proyecto y la duración.
- Fallo: se escucha `error` en el `<video>` y en la última `<source>` (con varias fuentes el error llega ahí), más un reloj hasta `loadedmetadata`. Al fallar se quita el video, se oculta el botón y aparece un aviso con `role="status"`. No hay «reintentar»: si el archivo no está, reintentar sería un botón roto.
- Un solo video a la vez por contenedor montado.
- Vertical: el marco mide `min(100%, alto máximo × proporción)` y va centrado sobre fondo oscuro, con `object-fit: contain`. El alto máximo es la variable `--reel-alto-max` (por defecto `min(62vh, 540px)`), que la ficha puede bajar.
- El marco es oscuro en ambos temas, igual que `.captura`. Bordes de 1 px, radio 14 px, sin sombras ni brillos.
- Movimiento: solo presión (escala 0,97, 160 ms) y cambio de fondo al pasar el puntero fino; las transiciones existen solo con `data-motion="completo"`.
- Al terminar el video vuelve la portada con «Ver de nuevo» y el foco pasa a ese botón.

## Pruebas y resultados reales

Edge sin interfaz con `navegador.mjs medir` sobre `http://localhost:4330/docs/portfolio-upgrade/agentes/reel/prueba.html`, usando `medir.js`. Ejecutado a 1440×900 (español, movimiento completo) y a 390×844 (`?lang=en&motion=reducido`). Mismos resultados en ambos salvo medidas y textos.

- Al cargar: 0 `<video>` en el DOM y 0 peticiones `.mp4`/`.webm` (`performance.getEntriesByType("resource")`).
- Proyecto sin video: `Reel.tiene` → `false`, `Reel.html` → `""`, contenedor vacío.
- Botón: `BUTTON[type=button]`, nombre «Ver video de Proyecto de ejemplo, duración 0:38» / «Watch video of Sample project, duration 0:38»; área 418×235 px (340×191 en móvil); pastilla de 44 px de alto. `alt` de la portada: «Portada del video de demostración de …».
- `src` inexistente (16:9): tras pulsar hay 1 video con `preload="metadata"`, `controls`, `playsinline`, sin `autoplay`; luego estado `fallo`, 0 videos, botón no visible, aviso «No se pudo cargar el video. Se muestra la portada.», foco en el aviso, salto de alto del marco: 0 px.
- WebM y MP4 inexistentes (9:16): mismo resultado. Marco de 304×540 centrado en una caja de 760 px (ventana de 900 px de alto); en móvil 294×523.
- Servidor que no responde (4:3, `Reel.espera = 1500`): a los 500, 1000 y 1400 ms seguía en `video`; a los 1700 ms estaba en `fallo`.
- Peticiones de video registradas en toda la prueba: solo las cuatro que siguieron a una pulsación.
- Video real en memoria (WebM de 1 s grabado de un lienzo, solo en la página de prueba): un clic crea 1 video (con `montar` llamado dos veces); `Reel.detener` deja 0 videos y estado `portada`; al terminar queda `fin` con rótulo «Ver de nuevo» / «Watch again» y foco en el botón; pulsarlo vuelve a crear el video. `object-fit` calculado: `contain`.
- Movimiento reducido: `transition-duration` de la pastilla `0s` (con movimiento completo, `0.16s`).
- `node --check js/reel.js`: sin errores.

## No verificado

- Reproducción iniciada por un clic real: en Edge sin interfaz el clic sintético no cuenta como gesto y `play()` quedó en pausa (el video sí cargó, `readyState` 4). La prueba lo reprodujo en silencio para llegar al final. Falta probarlo a mano.
- Un MP4 H.264 real, subtítulos `.vtt`, Safari/iOS (incluido `playsinline`) y Firefox.
- El reproductor dentro de la ficha real y de la ventana ampliada: ningún proyecto tiene `video`, así que no se ve en el sitio.
- Lector de pantalla real (solo comprobé nombres y roles en el DOM).

## Pendientes y bloqueos

- `index.html` todavía no carga `css/reel.css` ni `js/reel.js` (al momento de revisar). `js/main.js` ya llama a `Reel` de forma condicional, así que sin esos archivos nada cambia.
- Sugerencia para el coordinador: al abrir la ventana ampliada, llamar `Reel.detener(cajaDetalle)` para que no queden dos videos sonando; y, si la ficha debe caber en pantalla, fijar `.detalle { --reel-alto-max: … }`.
- Los videos los debe grabar Erick (ver `GUIONES-VIDEO.md`). El de la automatización depende además de que la empresa permita publicar una recreación con datos de prueba.
- El aviso `dark-glow` del hook de diseño sobre `prueba.html` quedó sin tocar: la página de prueba no define sombras propias.

## Siguiente acción exacta

Coordinador: agregar `<link rel="stylesheet" href="css/reel.css">` y `<script src="js/reel.js"></script>` (antes de `js/main.js`) en `index.html`. Después, cuando exista el primer video, agregar su campo `video` en `js/proyectos.js` y probar la ficha a mano en escritorio y teléfono.
