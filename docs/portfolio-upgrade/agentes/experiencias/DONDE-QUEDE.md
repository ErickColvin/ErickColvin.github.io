# Agente «experiencias» · Dónde quedé

Última actualización: 2026-11-14 (inicio).

## Objetivo y alcance

Recorrido automático por las 5 experiencias de la vista Experiencia (`#trayectoria`): botón Iniciar / Pausar / Continuar / Reiniciar, avance cada 8 s, estado anunciado, pausa ante cualquier interacción del usuario.

Solo puedo tocar: `js/recorrido.js`, `css/recorrido.css`, `tests/recorrido.test.mjs` y este archivo. No edito `index.html`, `css/styles.css` ni `js/main.js`. Sin commit ni push.

## Archivos modificados

- (en curso) `js/recorrido.js`, `css/recorrido.css`, `tests/recorrido.test.mjs`.

## Trabajo completado

- Leído el código del sitio: pestañas `.hito` en `js/main.js` (`elegirHito`, clic), tokens y `.btn` en `css/styles.css`, regla global de movimiento reducido, guía `review-animations/STANDARDS.md`.

## Pendientes y bloqueos

- Escribir los tres archivos, ejecutar `node --test tests/` y probar en navegador.

## Siguiente acción exacta

Escribir `js/recorrido.js` (fábrica pura `crearRecorrido` + montaje en `#recorrido`).

## Cierre (anotado por el coordinador, 2026-11-14)

La sesión se cortó antes de que este agente actualizara su archivo, pero los tres archivos quedaron completos: `js/recorrido.js`, `css/recorrido.css` y `tests/recorrido.test.mjs` (15 de 15 pruebas pasan con `node --test tests/`). El coordinador lo integró en `index.html` (contenedor `#recorrido` junto al título de Experiencia) y lo probó en navegador; resultados en `ESTADO-GENERAL.md`. Sin pendientes.
