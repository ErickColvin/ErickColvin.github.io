# Coordinador · Dónde quedé

Última actualización: 2026-11-14, ronda cerrada y en commit, sin publicar.

## Objetivo y alcance
Integrar los frentes (RPA, vista ampliada, recorrido, reel, fechas), verificar el conjunto y entregar. Archivos: `index.html`, `css/styles.css`, `js/main.js`, `js/proyectos.js`, `js/i18n.js`, `cv.html`.

## Trabajo completado
- `aplicar_rpa_ventana.py`: proyecto RPA, ventana ampliada, fechas 2022–2026 (se aplica una sola vez; ya aplicado).
- Integración de `recorrido` y `reel` en `index.html`; el reel se detiene al cambiar de proyecto y al abrir/cerrar la ventana.
- Ajustes de alto: lista compacta y bloque «sin demo» en pantallas bajas; sin lema de la ficha en iPad horizontal.
- El control del recorrido va junto al título (antes quedaba bajo la luna y la estación).

## Decisiones
- RPA y ventana los hizo el coordinador: tocan los mismos archivos que la integración.
- La ventana es un `<dialog>` nativo: Escape, foco contenido, fondo inerte y foco devuelto vienen del navegador.
- Cifras del caso RPA: solo las del CV (−70 %, 25 → 8 días, 6 fuentes y 5 flujos).

## Pruebas
Ver `ESTADO-GENERAL.md`, sección Pruebas. Scripts: `prueba-navegador.js`, `prueba-reducido.js`.

## Pendientes
- Autorización para publicar.
- Informe de diseño del agente «diseno» quedó sin escribir (sesión cortada).

## Siguiente acción exacta
Si Erick autoriza: `git push origin main` y verificar el sitio en línea.
