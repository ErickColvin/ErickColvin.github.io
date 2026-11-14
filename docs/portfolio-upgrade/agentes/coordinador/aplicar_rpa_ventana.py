"""Coordinador: proyecto de automatización (RPA), vista ampliada de proyectos y carrera 2022–2026.
Se ejecuta una vez desde la raíz del repositorio; cada reemplazo comprueba que el texto original exista."""

def rep(s, old, new, n=1):
    assert s.count(old) == n, (s.count(old), old[:100])
    return s.replace(old, new)

# ===================================================================== Proyecto nuevo (datos del CV, sin cifras inventadas)
p = "js/proyectos.js"; s = open(p, encoding="utf-8").read()
s = rep(s, '  - estado: "privado" (insignia "Código privado") o "sitio" (el código es el propio sitio publicado: insignia "Sitio publicado").',
        '  - estado: "privado" (insignia "Código privado"), "sitio" (el código es el propio sitio publicado: insignia "Sitio publicado")\n'
        '    o "interno" (trabajo hecho dentro de una empresa: sin repositorio, demo ni capturas públicas).\n'
        '  - sinDemo: frase que explica por qué no hay demo (solo en proyectos internos).\n'
        '  - video (opcional): { src, poster, formato: "9:16" | "16:9" | "4:3", duracion } para el reproductor tipo reel (js/reel.js).')
s = rep(s, '  - categorias: "fullstack", "ia", "web" (deben coincidir con los filtros del HTML).', '  - categorias: "automatizacion", "fullstack", "ia", "web" (deben coincidir con los filtros del HTML).')
nuevo = '''window.PROYECTOS = [
  {
    id: "automatizacion",
    nombre: "Automatización RPA · Auditorías 5S+",
    repo: null,
    inicio: "2025-09",
    periodo: "2025 – 2026",
    rol: "Diseño e implementación de la automatización",
    estado: "interno",
    icono: "flujo",
    categorias: ["automatizacion"],
    resumen: "Automatización de las auditorías 5S+ de áreas productivas y de la gestión documental, hecha con Power Apps y Power Automate en mi cargo de Analista de Innovación.",
    puntos: [
      "Aplicación en Power Apps para registrar las auditorías 5S+ de las áreas productivas.",
      "5 flujos de Power Automate que integran 6 fuentes de datos para gestionar hallazgos y verificables de cumplimiento.",
      "Gestión documental bajo Standard Work: control de versiones y validación de responsables estandarizados.",
      "Flujos de aprobación que reemplazan el seguimiento manual de cada documento."
    ],
    sinDemo: "Es una solución interna de la empresa: no tiene demo pública ni capturas.",
    flujo: ["Auditoría en Power Apps", "6 fuentes de datos", "5 flujos de Power Automate", "Hallazgos y verificables", "Aprobación del responsable"],
    caso: {
      reto: "Las auditorías 5S+ de las áreas productivas y la aprobación de documentos dependían de pasos manuales, y el proceso tomaba demasiado tiempo.",
      decisiones: [
        "Un solo punto de registro: la auditoría se levanta en Power Apps en vez de planillas separadas.",
        "Power Automate conecta 6 fuentes de datos con 5 flujos y gestiona los hallazgos y los verificables de cumplimiento.",
        "Gestión documental bajo Standard Work: versiones controladas y validación de responsables con un mismo flujo."
      ],
      cifras: [["−70%", "tiempo del proceso de auditoría"], ["25 → 8", "días del ciclo de aprobación"], ["6 y 5", "fuentes de datos y flujos"]],
      resultado: "En uso en las áreas productivas. Las cifras son las de mi CV; el detalle de la empresa es confidencial."
    },
    tecnologias: ["Power Apps", "Power Automate", "Standard Work", "5S+"],
    lenguajes: {},
    commits: 0,
    captura: null,
    enlaces: {},
    en: {
      nombre: "RPA automation · 5S+ audits",
      rol: "Automation design and implementation",
      resumen: "Automation of 5S+ audits for production areas and of document management, built with Power Apps and Power Automate in my role as Innovation Analyst.",
      puntos: [
        "Power Apps application to record 5S+ audits of production areas.",
        "5 Power Automate flows integrating 6 data sources to manage findings and compliance evidence.",
        "Document management under Standard Work: standardized version control and owner sign-off.",
        "Approval workflows that replace manual follow-up of each document."
      ],
      sinDemo: "This is an internal company solution: there is no public demo or screenshots.",
      flujo: ["Audit in Power Apps", "6 data sources", "5 Power Automate flows", "Findings and evidence", "Owner approval"],
      caso: {
        reto: "5S+ audits of production areas and document approvals relied on manual steps, and the process took too long.",
        decisiones: [
          "A single point of entry: audits are recorded in Power Apps instead of separate spreadsheets.",
          "Power Automate connects 6 data sources through 5 flows and manages findings and compliance evidence.",
          "Document management under Standard Work: controlled versions and owner sign-off through one workflow."
        ],
        cifras: [["−70%", "audit process time"], ["25 → 8", "days in the approval cycle"], ["6 and 5", "data sources and flows"]],
        resultado: "In use in production areas. Figures are the ones on my CV; company details are confidential."
      }
    }
  },
'''
s = rep(s, "window.PROYECTOS = [\n", nuevo)
open(p, "w", encoding="utf-8", newline="\n").write(s)

# ===================================================================== HTML
p = "index.html"; h = open(p, encoding="utf-8").read()
h = rep(h, '                <button type="button" class="filtro" data-filtro="fullstack" aria-pressed="false">Full-stack</button>',
        '                <button type="button" class="filtro" data-filtro="automatizacion" aria-pressed="false" data-i18n="proy.f.auto">Automatización</button>\n'
        '                <button type="button" class="filtro" data-filtro="fullstack" aria-pressed="false">Full-stack</button>')
# Carrera 2022–2026 (corrección del 2026-11-14)
h = rep(h, "Ing. en Computación e Informática · 2022⁠–⁠2025", "Ing. en Computación e Informática · 2022⁠–⁠2026")
h = rep(h, "<time>2022 – 2025</time>", "<time>2022 – 2026</time>")
h = rep(h, 'data-i18n="h4.fecha">2022 – Dic. 2025</p>', 'data-i18n="h4.fecha">2022 – 2026</p>')
# Vista ampliada de un proyecto
h = rep(h, '  <div class="aviso" id="aviso-movimiento" role="status" hidden>', '''  <!-- Vista ampliada de un proyecto: el caso, el detalle técnico y la demostración en una ventana grande -->
  <dialog class="ventana" id="ventana-proyecto" aria-labelledby="ventana-titulo">
    <div class="ventana__caja">
      <header class="ventana__cab">
        <div class="ventana__titulo" id="ventana-cab"></div>
        <button type="button" class="icono-btn ventana__cerrar" id="ventana-cerrar" data-i18n-attr="aria-label:ventana.cerrar" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      </header>
      <div class="ventana__cuerpo" id="ventana-cuerpo" tabindex="-1"></div>
    </div>
  </dialog>

  <div class="aviso" id="aviso-movimiento" role="status" hidden>''')
open(p, "w", encoding="utf-8", newline="\n").write(h)

# ===================================================================== Inglés
p = "js/i18n.js"; s = open(p, encoding="utf-8").read()
s = rep(s, "B.Sc. Computer Engineering · 2022⁠–⁠2025", "B.Sc. Computer Engineering · 2022⁠–⁠2026")
s = rep(s, '  "h4.fecha": "2022 – Dec. 2025",', '  "h4.fecha": "2022 – 2026",')
s = rep(s, '  "proy.f.todos":', '  "proy.f.auto": "Automation",\n  "ventana.cerrar": "Close",\n  "proy.f.todos":')
open(p, "w", encoding="utf-8", newline="\n").write(s)

p = "cv.html"; s = open(p, encoding="utf-8").read()
s = rep(s, '<time data-i18n="titulo.fecha">2022 – Dic. 2025</time>', '<time data-i18n="titulo.fecha">2022 – 2026</time>')
s = rep(s, '"titulo.fecha": "2022 – Dec. 2025",', '"titulo.fecha": "2022 – 2026",')
open(p, "w", encoding="utf-8", newline="\n").write(s)

# ===================================================================== JS
p = "js/main.js"; j = open(p, encoding="utf-8").read()
j = rep(j, """    rayo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'
  };""", """    rayo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    flujo: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M6.5 10v3.5a2 2 0 0 0 2 2H14"/><path d="m11.5 13 2.5 2.5-2.5 2.5"/>'
  };
  var ICONO_AMPLIAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>';""")
j = rep(j, """    if (p.estado === "sitio") s.push('<span class="insignia">' + ICONO_MUNDO + t("Sitio publicado", "Published site") + "</span>");""",
        """    if (p.estado === "sitio") s.push('<span class="insignia">' + ICONO_MUNDO + t("Sitio publicado", "Published site") + "</span>");
    if (p.estado === "interno") s.push('<span class="insignia insignia--privado">' + ICONO_CANDADO + t("Proyecto interno", "Internal project") + "</span>");""")
# Sin lenguajes (proyecto sin repositorio) no hay barra
j = rep(j, """  function htmlLenguajes(p) {
    var lista = porcentajes(p.lenguajes);""", """  function htmlLenguajes(p) {
    if (!Object.keys(p.lenguajes || {}).length) return "";
    var lista = porcentajes(p.lenguajes);""")
# La captura puede ser un reproductor de video (js/reel.js) cuando el proyecto trae uno real
j = rep(j, """  function htmlCaptura(p) {
    if (!p.captura || !p.enlaces.demo) return "";""", """  function htmlCaptura(p) {
    if (window.Reel && window.Reel.tiene(p)) return window.Reel.html(p);
    if (!p.captura || !p.enlaces.demo) return "";""")
j = rep(j, """    s.push('<span class="detalle__act" data-act></span>');
    return '<div class="detalle__pie">' + s.join("") + "</div>";""", """    s.push('<button type="button" class="enlace" data-ampliar aria-haspopup="dialog">' + ICONO_AMPLIAR + t("Ampliar", "Expand") + '<span class="sr"> ' + escapar(campo(p, "nombre")) + "</span></button>");
    return '<div class="detalle__pie"><div class="detalle__botones">' + s.join("") + '</div><span class="detalle__act" data-act></span></div>';""")
# Un proyecto sin captura muestra su flujo y por qué no hay demo en la columna visual
j = rep(j, """      '<ul class="puntos">' + campo(p, "puntos").map(function (x) { return "<li>" + escapar(x) + "</li>"; }).join("") + "</ul>" + htmlFlujo(p);
  }""", """      '<ul class="puntos">' + campo(p, "puntos").map(function (x) { return "<li>" + escapar(x) + "</li>"; }).join("") + "</ul>" + (htmlCaptura(p) ? htmlFlujo(p) : "");
  }

  // Proyecto interno, sin demo: en vez de una captura se muestra el recorrido del proceso y la razón
  function htmlSinDemo(p) {
    var flujo = campo(p, "flujo") || [];
    return '<div class="sin-demo"><p class="mini-titulo">' + t("Cómo funciona", "How it works") + '</p><ol class="sin-demo__pasos">' +
      flujo.map(function (paso) { return "<li>" + escapar(paso) + "</li>"; }).join("") + "</ol>" +
      (campo(p, "sinDemo") ? '<p class="sin-demo__nota">' + ICONO_CANDADO + "<span>" + escapar(campo(p, "sinDemo")) + "</span></p>" : "") + "</div>";
  }""")
j = rep(j, """    var visual = '<div class="detalle__visual">' + htmlCaptura(p) + htmlLenguajes(p) +""", """    var visual = '<div class="detalle__visual">' + (htmlCaptura(p) || htmlSinDemo(p)) + htmlLenguajes(p) +""")
j = rep(j, """(p.enlaces.demo ? t(" · demo en vivo", " · live demo") : "") +""", """(p.enlaces.demo ? t(" · demo en vivo", " · live demo") : p.estado === "interno" ? t(" · proyecto interno", " · internal project") : "") +""")
j = rep(j, """    cajaDetalle.innerHTML = htmlDetalle(p);
    var art = $(".detalle", cajaDetalle);""", """    if (window.Reel) window.Reel.detener(cajaDetalle);
    cajaDetalle.innerHTML = htmlDetalle(p);
    if (window.Reel) window.Reel.montar(cajaDetalle);
    var art = $(".detalle", cajaDetalle);""")
j = rep(j, """  cajaDetalle.addEventListener("click", function (e) {
    var b = e.target.closest(".segmento--chico button");
    if (b) elegirModoFicha(b);
  });""", """  cajaDetalle.addEventListener("click", function (e) {
    var b = e.target.closest(".segmento--chico button");
    if (b) elegirModoFicha(b);
    if (e.target.closest("[data-ampliar]") && proyectoActual) abrirVentana(proyectoActual);
  });

  /* ---------- Vista ampliada del proyecto (ventana) ---------- */
  // <dialog> nativo: contiene el foco, cierra con Escape, deja el fondo inerte y devuelve el foco al botón que la abrió
  var ventana = $("#ventana-proyecto");
  function abrirVentana(p) {
    if (!ventana || typeof ventana.showModal !== "function") return;
    $("#ventana-cab").innerHTML = '<h2 id="ventana-titulo">' + escapar(campo(p, "nombre")) + '</h2><p class="detalle__meta"><span>' + escapar(p.periodo) + "</span><span>" +
      escapar(campo(p, "rol")) + "</span>" + htmlInsignias(p) + '</p><p class="detalle__lema">' + escapar(campo(p, "resumen")) + "</p>";
    var demo = p.enlaces.demo ? '<a class="enlace enlace--demo" href="' + p.enlaces.demo + '" target="_blank" rel="noopener">' + ICONO_EXTERNO + t("Ver demo", "View demo") + "</a>" : "";
    $("#ventana-cuerpo").innerHTML = '<div class="ventana__texto">' + htmlCaso(p) +
      '<section class="ventana__tecnico"><h3 class="mini-titulo">' + t("Detalle técnico", "Technical detail") + "</h3>" + htmlResumen(p) + "</section></div>" +
      '<div class="ventana__visual">' + (htmlCaptura(p) || htmlSinDemo(p)) + demo + htmlLenguajes(p) +
      '<div><p class="mini-titulo">' + t("Tecnologías", "Tech stack") + '</p><div class="chips chips--separado">' + p.tecnologias.map(function (x) { return "<span>" + escapar(x) + "</span>"; }).join("") + "</div></div></div>";
    if (window.Reel) window.Reel.montar(ventana);
    ventana.showModal();
    $("#ventana-cuerpo").scrollTop = 0;
    document.dispatchEvent(new CustomEvent("ventana:abierta"));
    trasPintar(function () { ventana.classList.add("lleno"); });
  }
  function cerrarVentana() { if (ventana && ventana.open) ventana.close(); }
  if (ventana) {
    $("#ventana-cerrar").addEventListener("click", cerrarVentana);
    // Clic fuera de la caja (sobre el telón) cierra
    ventana.addEventListener("click", function (e) { if (e.target === ventana) cerrarVentana(); });
    ventana.addEventListener("close", function () {
      if (window.Reel) window.Reel.detener(ventana);
      ventana.classList.remove("lleno");
      $("#ventana-cuerpo").innerHTML = "";
    });
    alCambiarIdioma.push(cerrarVentana);
  }""")
open(p, "w", encoding="utf-8", newline="\n").write(j)

# ===================================================================== CSS
p = "css/styles.css"; s = open(p, encoding="utf-8").read()
s = rep(s, "/* ---------- Aviso de animaciones ---------- */", """/* ---------- Proyecto sin demo pública: el proceso en pasos ---------- */
.sin-demo { padding: 16px 18px; border-radius: 14px; border: 1px solid var(--borde-2); background: color-mix(in srgb, var(--bg) 40%, transparent); }
.sin-demo__pasos { counter-reset: paso; display: grid; gap: 0; margin-top: 10px; }
.sin-demo__pasos li { counter-increment: paso; position: relative; padding: 0 0 12px 30px; color: var(--texto); font-size: 0.88rem; font-weight: 500; line-height: 1.4; }
.sin-demo__pasos li::before {
  content: counter(paso);
  position: absolute; left: 0; top: 0;
  display: grid; place-items: center;
  width: 20px; height: 20px; border-radius: 50%;
  color: var(--c1); background: color-mix(in srgb, var(--c1) 12%, transparent);
  font-size: 0.7rem; font-weight: 600; font-variant-numeric: tabular-nums;
}
.sin-demo__pasos li:not(:last-child)::after { content: ""; position: absolute; left: 9.5px; top: 23px; bottom: 3px; width: 1px; background: var(--borde-2); }
.sin-demo__pasos li:last-child { padding-bottom: 0; }
.sin-demo__nota { display: flex; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--borde); color: var(--texto-3); font-size: 0.8rem; line-height: 1.45; }
.sin-demo__nota svg { width: 14px; height: 14px; margin-top: 2px; }
.detalle__botones { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }

/* ---------- Vista ampliada del proyecto ---------- */
.ventana { width: min(1080px, calc(100% - 32px)); max-width: none; max-height: none; padding: 0; border: 0; background: transparent; color: var(--texto); overflow: visible; }
.ventana::backdrop { background: rgba(4, 5, 9, 0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
[data-theme="light"] .ventana::backdrop { background: rgba(236, 237, 243, 0.7); }
.ventana__caja {
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 32px);
  border-radius: 24px;
  border: 1px solid var(--borde-2);
  background: var(--bg-elev);
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
  overflow: hidden;
}
.ventana__cab { display: flex; align-items: flex-start; gap: 16px; padding: clamp(18px, 3vh, 26px) clamp(18px, 3vw, 30px) 16px; border-bottom: 1px solid var(--borde); }
.ventana__titulo { flex: 1; min-width: 0; }
.ventana__titulo h2 { font: 700 clamp(1.3rem, 2.6vw, 1.8rem) / 1.15 var(--f-titulo); letter-spacing: -0.025em; }
.ventana__cerrar { flex-shrink: 0; width: 42px; height: 42px; }
.ventana__cuerpo {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: clamp(18px, 3vw, 32px);
  padding: clamp(16px, 3vh, 24px) clamp(18px, 3vw, 30px) clamp(20px, 3vh, 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--borde-2) transparent;
}
.ventana__cuerpo:focus { outline: none; }
.ventana__texto, .ventana__visual { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
.ventana__texto .caso { gap: 8px; }
.ventana__texto .caso__reto { font-size: 1.1rem; }
.ventana__texto .caso__decisiones, .ventana__texto .puntos { font-size: 0.92rem; line-height: 1.55; }
.ventana__tecnico { display: flex; flex-direction: column; gap: 10px; padding-top: 14px; border-top: 1px solid var(--borde); }
.ventana__visual .captura__vista { aspect-ratio: 16 / 10; }
.ventana__visual .enlace--demo { align-self: flex-start; }
[data-motion="completo"] .ventana[open] .ventana__caja { animation: ventana-entra 0.22s var(--suave) both; }
[data-motion="completo"] .ventana[open]::backdrop { animation: fundido 0.2s ease both; }
@keyframes ventana-entra { from { opacity: 0; transform: translateY(8px) scale(0.98); } }
@media (max-width: 760px) {
  .ventana { width: calc(100% - 16px); }
  .ventana__caja { max-height: calc(100dvh - 16px); border-radius: 20px; }
  .ventana__cuerpo { grid-template-columns: minmax(0, 1fr); }
}

/* ---------- Aviso de animaciones ---------- */""")
open(p, "w", encoding="utf-8", newline="\n").write(s)
print("ok")
