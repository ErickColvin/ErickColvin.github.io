# Guiones de video · demostraciones tipo reel

Hoy el repositorio no tiene ningún video: cada proyecto muestra su captura (o nada, en el caso de la automatización). El componente `js/reel.js` ya está listo; un proyecto pasa a mostrar video solo cuando existan sus archivos y se agregue el campo `video` en `js/proyectos.js`.

Los guiones salen únicamente de lo que `js/proyectos.js` dice de cada proyecto. Si al grabar algo no existe en la demo tal como está descrito, se salta la toma: no se arma nada para la cámara.

## Qué hay que entregar por proyecto

| Archivo | Obligatorio | Nombre exacto |
|---|---|---|
| Video MP4 (H.264) | sí | `assets/videos/<id>.mp4` |
| Portada JPG | sí | `assets/videos/<id>.jpg` |
| Video WebM (VP9) | no | `assets/videos/<id>.webm` |
| Subtítulos en español | no | `assets/videos/<id>.es.vtt` |
| Subtítulos en inglés | no | `assets/videos/<id>.en.vtt` |

`<id>` es el `id` del proyecto en `js/proyectos.js`. La carpeta `assets/videos/` todavía no existe: se crea al subir el primer video.

| Proyecto | `id` | Formato | Archivos mínimos |
|---|---|---|---|
| Automatización RPA · Auditorías 5S+ | `automatizacion` | 16:9 (9:16 si la app se usa en teléfono) | `automatizacion.mp4`, `automatizacion.jpg` |
| TraceLink V2 · CH Market | `tracelink` | 16:9 | `tracelink.mp4`, `tracelink.jpg` |
| Finanzas Personales | `finanzas` | 16:9 | `finanzas.mp4`, `finanzas.jpg` |
| Condominio Santa Marta | `santa-marta` | 16:9 | `santa-marta.mp4`, `santa-marta.jpg` |
| Rayo · Sitio de venta | `rayo` | 9:16 | `rayo.mp4`, `rayo.jpg` |

Cuando los archivos estén, se agrega al proyecto (ejemplo para TraceLink):

```js
video: {
  src: "assets/videos/tracelink.mp4",
  poster: "assets/videos/tracelink.jpg",
  formato: "16:9",
  duracion: "0:38",
  webm: "assets/videos/tracelink.webm",                 // opcional
  subtitulos: { es: "assets/videos/tracelink.es.vtt",   // opcional; también sirve una sola ruta
                en: "assets/videos/tracelink.en.vtt" }
}
```

`src` y `poster` son obligatorios: si falta uno, la ficha sigue mostrando la captura. `duracion` es el texto que se ve sobre la portada; debe coincidir con el video real.

## Especificaciones técnicas

- **Duración:** 30 a 45 segundos, 4 a 6 tomas. Sin introducción ni logo: la primera toma ya muestra el producto.
- **Formato 16:9 (1920×1080, o 1280×720 si pesa mucho):** para lo que se usa en escritorio con tablas, paneles y dashboards (TraceLink, Finanzas, Santa Marta). En vertical esas interfaces quedarían ilegibles.
- **Formato 9:16 (1080×1920):** para Rayo, porque el sitio se navega por pantallas con una barra inferior, como una app, y se ve mejor grabado en teléfono. El componente muestra el vertical completo, sin recortarlo, centrado y limitado en alto.
- **Códec:** MP4 con H.264 (perfil High, `yuv420p`), 30 fps, con `faststart` para que empiece a reproducirse antes de terminar de bajar. WebM (VP9) es opcional: pesa menos y, si existe, el navegador lo usa primero.
- **Peso:** ideal bajo 4 MB por video, máximo 6 MB. Se sirven desde GitHub Pages y muchas visitas llegan desde el teléfono.
- **Audio:** sin audio. Se reproduce en silencio en la mayoría de los casos y evita ruido de ambiente. Si hace falta explicar algo, va como texto en pantalla o como subtítulos `.vtt`; con subtítulos, entregar español e inglés.
- **Portada JPG:** misma proporción que el video, 1280 px en el lado mayor, bajo 150 KB. Debe ser un cuadro representativo del propio video (no un montaje) y sin texto pequeño.
- **Grabación:** navegador en ventana limpia (sin marcadores, extensiones ni notificaciones), zoom al 100–110 %, cursor visible y movimientos lentos. Una acción por toma; dejar un segundo quieto al terminar cada una.
- **Datos:** solo los datos de prueba de cada demo. Nada de correos, nombres reales, claves ni pestañas ajenas.

Exportación con ffmpeg (referencia; se ajusta `-crf` hasta entrar en el peso):

```bash
# MP4 H.264 sin audio
ffmpeg -i original.mov -an -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart assets/videos/tracelink.mp4
# WebM VP9 opcional
ffmpeg -i original.mov -an -vf "scale=1920:-2,fps=30" -c:v libvpx-vp9 -crf 34 -b:v 0 assets/videos/tracelink.webm
# Portada desde el segundo 3
ffmpeg -ss 3 -i assets/videos/tracelink.mp4 -frames:v 1 -vf "scale=1280:-2" -q:v 4 assets/videos/tracelink.jpg
```

Para un vertical se cambia la escala a `scale=1080:-2`.

## Guiones

### TraceLink V2 · CH Market — 16:9, unos 40 s

Se graba en la demo pública (`erickcolvin.github.io/tracelink-preview`), que usa los datos de prueba de la propia app y permite entrar como cliente o como personal sin contraseña.

1. **Tienda (6 s).** La portada del storefront con productos. Texto: «Comercio, inventario y pedidos en una sola plataforma».
2. **Entrar como cliente y comprar (10 s).** Entrar como cliente, agregar un producto y llegar al checkout. Texto: «El checkout reserva el stock por 15 minutos».
3. **Pago de prueba (7 s).** El paso de pago con Mercado Pago en sandbox, tal como lo muestre la demo. Texto: «Pagos en sandbox: los pagos reales siguen desactivados».
4. **Entrar como personal (9 s).** Cambiar a personal y mostrar el pedido recién creado y el inventario. Texto: «Stock, pedidos y pagos siempre coinciden».
5. **Roles (6 s).** Una pantalla donde se vea que cada rol tiene permisos distintos. Texto: «Seis roles con permisos validados en el servidor».

Cierre opcional (2 s) con las cifras de la ficha: 282 pruebas automatizadas y 5 flujos de CI/CD.

### Finanzas Personales — 16:9, unos 35 s

Se graba en la demo pública (`erickcolvin.github.io/finanzas-preview`), con movimientos inventados; los cambios se borran al recargar.

1. **Dashboard (7 s).** Vista general con los movimientos. Texto: «Los avisos del banco convertidos en un dashboard».
2. **Filtrar (7 s).** Aplicar un filtro sobre los movimientos. Texto: «Categorización por reglas, con IA local de respaldo».
3. **Editar un movimiento (7 s).** Recategorizar un movimiento. Texto: «Cada movimiento se puede confirmar o recategorizar».
4. **Recurrentes y alertas (8 s).** La parte donde se ven cobros recurrentes, membresías que suben de precio o posibles estafas. Texto: «Detecta cobros recurrentes y alzas de precio».
5. **Exportar (6 s).** Exportar los datos. Texto: «Auto-hospedada: ningún dato financiero sale del equipo».

No se muestran Gmail ni Telegram reales. Si se quiere mostrar el aviso de Telegram, solo con una cuenta y datos de prueba.

### Condominio Santa Marta — 16:9, unos 40 s

Se graba en la demo pública (`erickcolvin.github.io/santa-marta-preview`), con datos ficticios; el perfil se cambia desde la barra superior.

1. **Residente (8 s).** Vista del residente con su cobranza. Texto: «Un condominio de 306 casas en una sola app».
2. **Pago simulado (7 s).** Iniciar un pago. Texto: «Pagos con Mercado Pago, todavía simulados».
3. **Administración (9 s).** Cambiar al perfil de administración desde la barra superior y mostrar multas o convenios. Texto: «Cada perfil ve solo lo que necesita».
4. **Asamblea (7 s).** Una asamblea con voto en línea, desde el perfil que corresponda. Texto: «Asambleas con voto en línea».
5. **Auditoría (9 s).** El registro de auditoría, la verificación de integridad y la exportación a CSV. Texto: «Auditoría inalterable: registro encadenado por hash».

Si sobra tiempo, 3 s de portería registrando una encomienda.

### Rayo · Sitio de venta — 9:16, unos 30 s

Se graba en `rayofps.cl`, en teléfono o con el navegador en tamaño de teléfono.

1. **Inicio (6 s).** La primera pantalla del sitio. Texto: «Rayo: optimizador de FPS para Windows».
2. **Navegación (6 s).** Pasar entre pantallas con la barra inferior. Texto: «Se navega por pantallas, como una app».
3. **Qué hace (7 s).** La pantalla con las optimizaciones y los juegos. Texto: «87 optimizaciones y configuraciones para 18 juegos».
4. **Planes (5 s).** Los planes Pro y Elite. Texto: «Pago único».
5. **Compra (6 s).** Abrir la ventana de compra y mostrar las opciones, sin completar el pago ni escribir datos reales. Texto: «Mercado Pago o transferencia; la licencia llega por Discord».

### Automatización RPA · Auditorías 5S+ — 16:9 (o 9:16 si la app se usa en teléfono), unos 40 s

Es una solución interna y la ficha dice que no tiene demo pública ni capturas, y que el detalle de la empresa es confidencial. Por eso:

- Grabar **solo con datos de prueba**, en un entorno de prueba o en una copia de la app: áreas, personas, hallazgos y documentos inventados.
- **Sin información de la empresa:** sin logo, nombre, dominio de correo, URL del tenant o de SharePoint, nombres de personas, áreas ni documentos reales. Revisar también la barra del navegador, el encabezado de Power Apps y las notificaciones.
- Confirmar antes con la empresa que se puede publicar una recreación. Si no se puede, este proyecto queda sin video y la ficha se mantiene como está.

1. **Registro de la auditoría (9 s).** Levantar una auditoría 5S+ de un área de prueba en la app de Power Apps. Texto: «La auditoría se registra en un solo lugar, no en planillas separadas».
2. **Hallazgo (8 s).** Registrar un hallazgo con su verificable de cumplimiento. Texto: «Hallazgos y verificables de cumplimiento».
3. **Flujo en Power Automate (8 s).** Mostrar un flujo ejecutándose (con conexiones y nombres de prueba). Texto: «5 flujos que integran 6 fuentes de datos».
4. **Aprobación (8 s).** El responsable aprueba un documento de prueba. Texto: «Aprobación con control de versiones, bajo Standard Work».
5. **Resultado (6 s).** Pantalla fija con las cifras de la ficha. Texto: «−70 % de tiempo en la auditoría · ciclo de aprobación de 25 a 8 días».

Este proyecto no tiene captura: la portada `automatizacion.jpg` es obligatoria igual y también debe salir de la grabación con datos de prueba.

## Antes de publicar cada video

1. Verlo completo buscando datos reales o personales en cualquier cuadro.
2. Comprobar el peso y que `duracion` coincida.
3. Abrir la ficha del proyecto en teléfono y en escritorio, pulsar «Ver video» y dejarlo terminar: debe aparecer «Ver de nuevo».
