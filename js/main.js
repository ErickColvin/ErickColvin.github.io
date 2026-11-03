(function () {
  "use strict";

  var raiz = document.documentElement;
  var USUARIO_GH = "ErickColvin";
  var PROYECTOS = window.PROYECTOS || [];
  var TITULO = document.title;

  var VISTAS = ["inicio", "trayectoria", "proyectos", "habilidades", "contacto"];
  var NOMBRES = { inicio: "Inicio", trayectoria: "Trayectoria", proyectos: "Proyectos", habilidades: "Habilidades", contacto: "Contacto" };
  // Enlaces de la versión anterior de la página, para que sigan funcionando
  var ALIAS = { "sobre-mi": "trayectoria", experiencia: "trayectoria", actividad: "proyectos" };

  var COLORES_LENGUAJE = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    "C#": "#178600",
    CSS: "#663399",
    HTML: "#e34c26",
    PowerShell: "#2a5fa8",
    Dockerfile: "#384d54",
    Shell: "#89e051",
    Otros: "#8b8fa3"
  };

  var ICONOS = {
    paquete: '<path d="M16.5 9.4 7.5 4.2"/><path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.7Z"/><path d="M3.3 7 12 12l8.7-5"/><path d="M12 22V12"/>',
    billetera: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    edificio: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    rayo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'
  };
  var ICONO_GITHUB = '<svg class="relleno" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>';
  var ICONO_EXTERNO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
  var ICONO_CANDADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ICONO_FLECHA = '<svg class="item-proyecto__flecha" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>';

  /* ---------- Utilidades ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function movimientoCompleto() { return raiz.dataset.motion === "completo"; }
  function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem(clave); } catch (e) { return null; } }
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Dos cuadros: el primero pinta el estado inicial, el segundo dispara la transición
  function trasPintar(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }
  var punteroFino = matchMedia("(hover: hover) and (pointer: fine)").matches;

  // Pestañas accesibles: flechas, Inicio y Fin mueven la selección dentro de un role="tablist"
  function teclasPestanas(lista, elegir) {
    lista.addEventListener("keydown", function (e) {
      var tabs = $$('[role="tab"]', lista).filter(function (t) { return !t.hidden; });
      var i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      var destino = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") destino = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") destino = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") destino = tabs[0];
      else if (e.key === "End") destino = tabs[tabs.length - 1];
      if (!destino) return;
      e.preventDefault();
      e.stopPropagation();
      elegir(destino);
      destino.focus();
    });
  }

  /* ---------- Tema ---------- */
  var btnTema = $("#btn-tema");
  function pintarTema() {
    var claro = raiz.dataset.theme === "light";
    btnTema.title = claro ? "Cambiar a tema oscuro" : "Cambiar a tema claro";
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.content = claro ? "#f3f4f9" : "#06070c";
  }
  btnTema.addEventListener("click", function () {
    raiz.dataset.theme = raiz.dataset.theme === "light" ? "dark" : "light";
    guardar("tema", raiz.dataset.theme);
    pintarTema();
    red.colores();
  });
  pintarTema();

  /* ---------- Animaciones: completo / reducido ---------- */
  var btnMov = $("#btn-movimiento");
  var aviso = $("#aviso-movimiento");
  function pintarMovimiento() {
    var on = movimientoCompleto();
    btnMov.setAttribute("aria-pressed", String(on));
    btnMov.title = on ? "Animaciones activadas (clic para reducir)" : "Animaciones reducidas (clic para activar)";
  }
  function cambiarMovimiento(valor) {
    raiz.dataset.motion = valor;
    guardar("movimiento", valor);
    pintarMovimiento();
    red.reiniciar();
    tipearTerminal(true);
    rotarRol();
  }
  btnMov.addEventListener("click", function () {
    cambiarMovimiento(movimientoCompleto() ? "reducido" : "completo");
    aviso.hidden = true;
  });
  pintarMovimiento();

  // Si el sistema pide menos movimiento, se avisa una vez con la opción de activarlas aquí.
  if (!leer("movimiento") && !movimientoCompleto() && leer("aviso-movimiento") !== "visto") {
    setTimeout(function () { aviso.hidden = false; }, 1400);
  }
  $("#aviso-activar").addEventListener("click", function () {
    aviso.hidden = true;
    guardar("aviso-movimiento", "visto");
    cambiarMovimiento("completo");
  });
  $("#aviso-cerrar").addEventListener("click", function () {
    aviso.hidden = true;
    guardar("aviso-movimiento", "visto");
  });

  /* ---------- Título letra por letra ---------- */
  $$(".hero__titulo .linea:not(.degradado) .letras").forEach(function (el) {
    var i = 0;
    el.innerHTML = el.textContent.split("").map(function (c) {
      return '<span class="letra" style="--i:' + (i++) + '">' + (c === " " ? " " : escapar(c)) + "</span>";
    }).join("");
  });

  /* ---------- Rol que se escribe y borra ---------- */
  var ROLES = [
    "Ingeniero en Computación e Informática",
    "Automatización de procesos",
    "Power Apps · Power Automate",
    "Desarrollo full-stack",
    "IA local y datos"
  ];
  var elRol = $("#rol");
  var temporizadorRol = null;
  function rotarRol() {
    clearTimeout(temporizadorRol);
    if (!movimientoCompleto()) { elRol.textContent = ROLES[0]; return; }
    var indice = 0, texto = ROLES[0], borrando = false;
    function paso() {
      if (!movimientoCompleto()) { elRol.textContent = ROLES[0]; return; }
      var objetivo = ROLES[indice];
      if (!borrando) {
        texto = objetivo.slice(0, texto.length + 1);
        elRol.textContent = texto;
        if (texto === objetivo) { borrando = true; temporizadorRol = setTimeout(paso, 2200); return; }
        temporizadorRol = setTimeout(paso, 55 + Math.random() * 45);
      } else {
        texto = texto.slice(0, -1);
        elRol.textContent = texto;
        if (!texto) { borrando = false; indice = (indice + 1) % ROLES.length; temporizadorRol = setTimeout(paso, 300); return; }
        temporizadorRol = setTimeout(paso, 28);
      }
    }
    borrando = true;
    temporizadorRol = setTimeout(paso, 3200);
  }
  rotarRol();

  /* ---------- Terminal ---------- */
  var LINEAS_TERMINAL = [
    { cmd: "whoami" },
    { sal: '<span class="t-ok">erick-colvin</span>' },
    { cmd: "cat perfil.txt" },
    { sal: "Ingeniero en Computación e Informática" },
    { sal: '<span class="t-acento">Power Platform · Full-stack · IA local</span>' },
    { cmd: "ls demos/ --en-vivo" },
    { sal: 'tracelink-preview     <span class="t-ts">TypeScript</span>' },
    { sal: 'finanzas-preview      <span class="t-cs">C# · React</span>' },
    { sal: 'santa-marta-preview   <span class="t-js">JavaScript</span>' },
    { sal: 'rayo-web              <span class="t-html">HTML</span>' },
    { cmd: "./impacto --resumen" },
    { sal: '<span class="t-ok">✓</span> auditorías 5S+       <span class="t-acento">−70% tiempo</span>' },
    { sal: '<span class="t-ok">✓</span> aprobación docs      <span class="t-acento">25 → 8 días</span>' }
  ];
  var PROMPT = '<span class="t-prompt">$</span> ';
  var CURSOR = '<span class="t-cursor"></span>';
  var elTerminal = $("#terminal");
  var corridaTerminal = 0;

  function pintarTerminal(html) {
    elTerminal.innerHTML = html;
    elTerminal.scrollTop = elTerminal.scrollHeight;
  }
  function terminalCompleta() {
    return LINEAS_TERMINAL.map(function (l) {
      return l.cmd ? PROMPT + '<span class="t-cmd">' + l.cmd + "</span>" : '<span class="t-sal">' + l.sal + "</span>";
    }).join("\n") + "\n" + PROMPT + CURSOR;
  }
  function tipearTerminal(reiniciar) {
    var corrida = ++corridaTerminal;
    if (!movimientoCompleto()) { pintarTerminal(terminalCompleta()); return; }
    if (!reiniciar && elTerminal.dataset.listo) return;
    var hecho = "";
    var n = 0;
    function siguiente() {
      if (corrida !== corridaTerminal) return;
      if (n >= LINEAS_TERMINAL.length) {
        pintarTerminal(hecho + PROMPT + CURSOR);
        elTerminal.dataset.listo = "1";
        return;
      }
      var linea = LINEAS_TERMINAL[n++];
      if (linea.sal) {
        hecho += '<span class="t-sal">' + linea.sal + "</span>\n";
        pintarTerminal(hecho + CURSOR);
        setTimeout(siguiente, 90);
        return;
      }
      var c = 0;
      (function tecla() {
        if (corrida !== corridaTerminal) return;
        c++;
        pintarTerminal(hecho + PROMPT + '<span class="t-cmd">' + linea.cmd.slice(0, c) + "</span>" + CURSOR);
        if (c < linea.cmd.length) { setTimeout(tecla, 38 + Math.random() * 50); return; }
        hecho += PROMPT + '<span class="t-cmd">' + linea.cmd + "</span>\n";
        setTimeout(siguiente, 380);
      })();
    }
    pintarTerminal(PROMPT + CURSOR);
    setTimeout(siguiente, 900);
  }
  tipearTerminal(false);

  /* ---------- Red de nodos del fondo (canvas) ---------- */
  var red = (function () {
    var lienzo = $("#red");
    var ctx = lienzo.getContext("2d");
    var puntos = [], ancho = 0, alto = 0, dpr = 1, raton = { x: -9999, y: -9999 };
    var colorPunto = "129,140,248", colorLinea = "34,211,238";
    var cuadro = null;

    function colores() {
      var estilo = getComputedStyle(raiz);
      colorPunto = estilo.getPropertyValue("--red-punto").trim() || colorPunto;
      colorLinea = estilo.getPropertyValue("--red-linea").trim() || colorLinea;
      if (!movimientoCompleto()) dibujar();
    }

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cantidad = Math.min(90, Math.round((ancho * alto) / 16000));
      puntos = [];
      for (var i = 0; i < cantidad; i++) {
        puntos.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.7
        });
      }
    }

    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto);
      var DIST = 130, DIST_RATON = 180;
      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        for (var j = i + 1; j < puntos.length; j++) {
          var q = puntos[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < DIST * DIST) {
            ctx.strokeStyle = "rgba(" + colorLinea + "," + (1 - Math.sqrt(d2) / DIST) * 0.18 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        var mx = p.x - raton.x, my = p.y - raton.y;
        var dm = Math.sqrt(mx * mx + my * my);
        if (dm < DIST_RATON) {
          ctx.strokeStyle = "rgba(" + colorPunto + "," + (1 - dm / DIST_RATON) * 0.45 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(raton.x, raton.y);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(" + colorPunto + ",0.7)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function mover() {
      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        // El ratón atrae suavemente a los nodos cercanos
        var dx = raton.x - p.x, dy = raton.y - p.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180 && d > 1) { p.vx += (dx / d) * 0.01; p.vy += (dy / d) * 0.01; }
        p.vx *= 0.992; p.vy *= 0.992;
        var vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel < 0.1) { p.vx += (Math.random() - 0.5) * 0.04; p.vy += (Math.random() - 0.5) * 0.04; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > ancho) p.vx *= -1;
        if (p.y < 0 || p.y > alto) p.vy *= -1;
        p.x = Math.max(0, Math.min(ancho, p.x));
        p.y = Math.max(0, Math.min(alto, p.y));
      }
    }

    function bucle() {
      cuadro = null;
      if (!movimientoCompleto() || document.hidden) return;
      mover();
      dibujar();
      cuadro = requestAnimationFrame(bucle);
    }

    function reiniciar() {
      if (cuadro) cancelAnimationFrame(cuadro);
      cuadro = null;
      if (movimientoCompleto()) bucle(); else dibujar();
    }

    window.addEventListener("pointermove", function (e) { raton.x = e.clientX; raton.y = e.clientY; }, { passive: true });
    document.addEventListener("pointerleave", function () { raton.x = raton.y = -9999; });
    document.addEventListener("visibilitychange", function () { if (!document.hidden) reiniciar(); });

    var temporizadorMedida;
    var anchoPrevio = window.innerWidth;
    window.addEventListener("resize", function () {
      // En móvil la barra del navegador cambia el alto: solo se recalcula si cambia el ancho.
      if (window.innerWidth === anchoPrevio && puntos.length) return;
      anchoPrevio = window.innerWidth;
      clearTimeout(temporizadorMedida);
      temporizadorMedida = setTimeout(function () { medir(); reiniciar(); }, 150);
    });

    medir();
    colores();
    reiniciar();
    return { reiniciar: reiniciar, colores: colores };
  })();

  /* ---------- Contadores ---------- */
  var contadoresHechos = new WeakSet();
  function contar(el) {
    if (contadoresHechos.has(el)) return;
    contadoresHechos.add(el);
    var fin = parseFloat(el.dataset.contar);
    var inicio = el.dataset.desde ? parseFloat(el.dataset.desde) : 0;
    if (!movimientoCompleto()) { el.textContent = fin; return; }
    var dur = 1500, t0 = null;
    function paso(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var suave = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(inicio + (fin - inicio) * suave);
      if (k < 1) requestAnimationFrame(paso);
    }
    el.textContent = inicio;
    requestAnimationFrame(paso);
  }

  /* ---------- Proyectos: lista y detalle ---------- */
  function porcentajes(lenguajes) {
    var total = 0, lista = [], otros = 0;
    Object.keys(lenguajes).forEach(function (k) { total += lenguajes[k]; });
    Object.keys(lenguajes).forEach(function (k) {
      var pct = (lenguajes[k] / total) * 100;
      if (pct >= 0.8) lista.push({ nombre: k, pct: pct }); else otros += pct;
    });
    lista.sort(function (a, b) { return b.pct - a.pct; });
    if (otros > 0) lista.push({ nombre: "Otros", pct: otros });
    return lista;
  }

  function htmlLenguajes(p) {
    var lista = porcentajes(p.lenguajes);
    var barra = lista.map(function (l, i) {
      return '<span style="--w:' + l.pct.toFixed(2) + "%;--c:" + (COLORES_LENGUAJE[l.nombre] || COLORES_LENGUAJE.Otros) + ";--i:" + i + '" title="' + escapar(l.nombre) + " " + l.pct.toFixed(1) + '%"></span>';
    }).join("");
    var leyenda = lista.map(function (l) {
      return '<li><i style="--c:' + (COLORES_LENGUAJE[l.nombre] || COLORES_LENGUAJE.Otros) + '"></i>' + escapar(l.nombre) + " <b>" + (l.pct < 1 ? "<1" : l.pct.toFixed(1).replace(".", ",")) + "%</b></li>";
    }).join("");
    return '<div><p class="mini-titulo">Lenguajes</p><div class="lenguajes__barra" role="img" aria-label="' +
      escapar(lista.map(function (l) { return l.nombre + " " + Math.round(l.pct) + "%"; }).join(", ")) + '">' + barra +
      '</div><ul class="lenguajes__ley">' + leyenda + "</ul></div>";
  }

  function htmlFlujo(p) {
    if (!p.flujo) return "";
    var n = p.flujo.length;
    return '<div><p class="mini-titulo">Cómo funciona</p><ol class="flujo">' + p.flujo.map(function (paso, i) {
      return '<li><span style="--i:' + i + ";--n:" + n + '">' + escapar(paso) + "</span></li>";
    }).join("") + "</ol></div>";
  }

  function htmlInsignias(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<span class="insignia insignia--vivo"><i></i>Demo en vivo</span>');
    if (p.estado === "privado") s.push('<span class="insignia insignia--privado">' + ICONO_CANDADO + "Código privado</span>");
    return s.join("");
  }

  // Vista previa del demo dentro de una ventana de navegador. Es decorativa: el enlace accesible es "Ver demo".
  function htmlCaptura(p) {
    if (!p.captura || !p.enlaces.demo) return "";
    var direccion = p.enlaces.demo.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return '<a class="captura" href="' + p.enlaces.demo + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
      '<span class="captura__barra"><i></i><i></i><i></i><span>' + escapar(direccion) + "</span></span>" +
      '<span class="captura__vista"><img src="' + p.captura + '" alt="" width="864" height="1440" decoding="async"></span>' +
      '<span class="captura__abrir">Abrir demo ' + ICONO_EXTERNO + "</span></a>";
  }

  function htmlEnlaces(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<a class="enlace enlace--demo" href="' + p.enlaces.demo + '" target="_blank" rel="noopener">' + ICONO_EXTERNO + 'Ver demo<span class="sr"> de ' + escapar(p.nombre) + "</span></a>");
    if (p.enlaces.codigo && p.estado !== "privado") s.push('<a class="enlace" href="' + p.enlaces.codigo + '" target="_blank" rel="noopener">' + ICONO_GITHUB + 'Código<span class="sr"> de ' + escapar(p.nombre) + "</span></a>");
    s.push('<span class="detalle__act" id="detalle-act"></span>');
    return '<div class="detalle__pie">' + s.join("") + "</div>";
  }

  function htmlDetalle(p) {
    var cab = '<header class="detalle__cab"><div class="detalle__icono"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[p.icono] || ICONOS.paquete) + "</svg></div>" +
      '<div class="detalle__titulo"><h3>' + escapar(p.nombre) + '</h3><p class="detalle__meta"><span>' + escapar(p.periodo) + "</span><span>" + p.commits + " commits</span>" + htmlInsignias(p) + "</p></div></header>";
    var texto = '<div class="detalle__texto"><p class="detalle__resumen">' + escapar(p.resumen) + "</p>" +
      (p.nota ? '<p class="detalle__nota">' + escapar(p.nota) + "</p>" : "") +
      '<ul class="puntos">' + p.puntos.map(function (t) { return "<li>" + escapar(t) + "</li>"; }).join("") + "</ul>" +
      htmlEnlaces(p) + "</div>";
    var visual = '<div class="detalle__visual">' + htmlCaptura(p) + htmlFlujo(p) + htmlLenguajes(p) +
      '<div><p class="mini-titulo">Tecnologías</p><div class="chips" style="margin-top:8px">' + p.tecnologias.map(function (t) { return "<span>" + escapar(t) + "</span>"; }).join("") + "</div></div></div>";
    return '<article class="tile detalle">' + cab + '<div class="detalle__cuerpo">' + texto + visual + "</div></article>";
  }

  var listaProyectos = $("#lista-proyectos");
  var cajaDetalle = $("#detalle");
  var proyectoActual = null;
  var pushes = {};
  var tiempoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  function haceCuanto(fecha) {
    var seg = (new Date(fecha).getTime() - Date.now()) / 1000;
    var tramos = [[60, "second"], [60, "minute"], [24, "hour"], [30, "day"], [12, "month"], [Infinity, "year"]];
    for (var i = 0; i < tramos.length; i++) {
      if (Math.abs(seg) < tramos[i][0]) return tiempoRelativo.format(Math.round(seg), tramos[i][1]);
      seg /= tramos[i][0];
    }
  }
  function pintarActualizado() {
    var el = $("#detalle-act");
    if (el && proyectoActual && pushes[proyectoActual.repo]) el.textContent = "Demo actualizada " + haceCuanto(pushes[proyectoActual.repo]);
  }

  listaProyectos.innerHTML = PROYECTOS.map(function (p) {
    return '<button type="button" role="tab" class="item-proyecto" id="tab-' + p.id + '" data-id="' + p.id + '" data-categorias="' + p.categorias.join(" ") +
      '" aria-controls="detalle" aria-selected="false" tabindex="-1"><span class="item-proyecto__icono"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[p.icono] || ICONOS.paquete) +
      "</svg></span><span><strong>" + escapar(p.nombre) + "</strong><small>" + escapar(p.periodo) + (p.enlaces.demo ? " · demo en vivo" : "") + "</small></span>" + ICONO_FLECHA + "</button>";
  }).join("");
  var tabsProyecto = $$(".item-proyecto", listaProyectos);

  function elegirProyecto(tab) {
    var p = PROYECTOS.filter(function (x) { return x.id === tab.dataset.id; })[0];
    if (!p) return;
    proyectoActual = p;
    tabsProyecto.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("activo", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    cajaDetalle.setAttribute("aria-labelledby", tab.id);
    cajaDetalle.innerHTML = htmlDetalle(p);
    var art = $(".detalle", cajaDetalle);
    trasPintar(function () { art.classList.add("lleno"); });
    pintarActualizado();
  }
  tabsProyecto.forEach(function (t) { t.addEventListener("click", function () { elegirProyecto(t); }); });
  teclasPestanas(listaProyectos, elegirProyecto);
  if (tabsProyecto.length) elegirProyecto(tabsProyecto[0]);

  // Filtros: esconden proyectos de la lista; si el elegido queda oculto, se pasa al primero visible
  var botonesFiltro = $$(".filtro");
  function filtrar(filtro) {
    botonesFiltro.forEach(function (b) {
      var activo = b.dataset.filtro === filtro;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", String(activo));
    });
    var visibles = tabsProyecto.filter(function (t) {
      var entra = filtro === "todos" || t.dataset.categorias.split(" ").indexOf(filtro) !== -1;
      t.hidden = !entra;
      return entra;
    });
    var actual = $(".item-proyecto.activo", listaProyectos);
    if (visibles.length && (!actual || actual.hidden)) elegirProyecto(visibles[0]);
  }
  botonesFiltro.forEach(function (b) { b.addEventListener("click", function () { filtrar(b.dataset.filtro); }); });

  // Resumen calculado desde los datos
  (function () {
    var commits = 0, lenguajes = {}, demos = 0;
    PROYECTOS.forEach(function (p) {
      commits += p.commits || 0;
      Object.keys(p.lenguajes).forEach(function (k) { lenguajes[k] = true; });
      if (p.enlaces.demo) demos++;
    });
    $("#gh-proyectos").textContent = PROYECTOS.length;
    $("#gh-commits").textContent = commits;
    $("#gh-lenguajes").textContent = Object.keys(lenguajes).length;
    $("#gh-demos").textContent = demos;
    $("#cifra-proyectos").textContent = PROYECTOS.length;
    // La cifra del inicio usa el total del mapa de actividad cuando existe
    var total = window.ACTIVIDAD ? Object.keys(window.ACTIVIDAD.dias).reduce(function (s, d) { return s + window.ACTIVIDAD.dias[d]; }, 0) : commits;
    var cifra = $("#cifra-commits");
    cifra.dataset.contar = total;
    cifra.textContent = total;
  })();

  // Fecha de la última publicación de cada demo, en vivo desde la API pública de GitHub
  fetch("https://api.github.com/users/" + USUARIO_GH + "/repos?per_page=100&type=owner")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (repos) {
      repos.forEach(function (r) { pushes[r.name] = r.pushed_at; });
      pintarActualizado();
    })
    .catch(function () { /* sin conexión o límite de la API: no se muestra la fecha */ });

  /* ---------- Proyectos / Actividad ---------- */
  var botonesSegmento = $$(".segmento button");
  var marcaSegmento = $(".segmento__marca");
  var panelActual = "galeria";
  function moverMarcaSegmento() {
    var b = $(".segmento button.activo");
    if (!b || !b.offsetWidth) return;
    marcaSegmento.style.setProperty("--x", b.offsetLeft - 4 + "px");
    marcaSegmento.style.setProperty("--w", b.offsetWidth + "px");
  }
  function cambiarPanel(panel) {
    panelActual = panel;
    botonesSegmento.forEach(function (b) {
      var on = b.dataset.panel === panel;
      b.classList.toggle("activo", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).classList.toggle("activo", on);
    });
    moverMarcaSegmento();
    if (panel === "actividad") mostrarActividad();
  }
  function elegirSegmento(b) {
    cambiarPanel(b.dataset.panel);
    history.replaceState(null, "", b.dataset.panel === "actividad" ? "#actividad" : "#proyectos");
  }
  botonesSegmento.forEach(function (b) { b.addEventListener("click", function () { elegirSegmento(b); }); });
  teclasPestanas($(".segmento"), elegirSegmento);

  /* ---------- Actividad: commits por día, como el mapa de GitHub ---------- */
  var mostrarActividad = (function () {
    var datos = window.ACTIVIDAD;
    var caja = $("#actividad");
    if (!datos || !caja || !Object.keys(datos.dias).length) {
      $("#seg-actividad").hidden = true;
      return function () {};
    }

    // A mediodía, para que los cambios de horario no muevan los días
    function aFecha(clave) { var p = clave.split("-"); return new Date(+p[0], p[1] - 1, +p[2], 12); }
    function aClave(f) { return f.getFullYear() + "-" + ("0" + (f.getMonth() + 1)).slice(-2) + "-" + ("0" + f.getDate()).slice(-2); }
    var formatoDia = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "short", year: "numeric" });
    var formatoMesCorto = new Intl.DateTimeFormat("es-CL", { month: "short" });
    var formatoMesLargo = new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" });

    // Desde el primer día del mes del primer commit hasta la fecha en que se generaron los datos; las semanas parten el lunes
    var primero = aFecha(Object.keys(datos.dias).sort()[0]);
    primero.setDate(1);
    var fin = aFecha(datos.generado);
    var dia = new Date(primero);
    dia.setDate(dia.getDate() - (primero.getDay() + 6) % 7);

    var celdas = [], meses = [], total = 0, activos = 0, racha = 0, mejorRacha = 0, maximo = { n: 0, fecha: null }, col = 0;
    for (var i = 0; dia <= fin; i++) {
      col = Math.floor(i / 7);
      if (dia < primero) {
        celdas.push('<span class="vacia"></span>');
      } else {
        var n = datos.dias[aClave(dia)] || 0;
        var nivel = n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 10 ? 3 : 4;
        var texto = (n ? n + (n === 1 ? " commit" : " commits") : "Sin commits") + " · " + formatoDia.format(dia);
        celdas.push('<span data-n="' + nivel + '" data-tip="' + texto + '" style="--x:' + col + ";--y:" + (i % 7) + '"></span>');
        if (dia.getDate() === 1) {
          var mes = formatoMesCorto.format(dia).replace(".", "");
          if (dia.getMonth() === 0 || !meses.length) mes += " '" + String(dia.getFullYear()).slice(-2);
          meses.push('<span style="grid-column:' + (col + 1) + '">' + mes + "</span>");
        }
        total += n;
        if (n) { activos++; racha++; mejorRacha = Math.max(mejorRacha, racha); } else { racha = 0; }
        if (n > maximo.n) maximo = { n: n, fecha: new Date(dia) };
      }
      dia.setDate(dia.getDate() + 1);
    }

    var grilla = $("#act-grilla");
    var tabla = $(".actividad__tabla", caja);
    tabla.style.setProperty("--cols", col + 1);
    // Con pocas semanas las celdas crecen para que el mapa no quede perdido en la tarjeta
    if (col < 40) tabla.style.setProperty("--celda", col < 26 ? "18px" : "15px");
    grilla.innerHTML = celdas.join("");
    $("#act-meses").innerHTML = meses.join("");
    grilla.setAttribute("aria-label", total + " commits en " + activos + " días, entre " + formatoMesLargo.format(primero) + " y " + formatoMesLargo.format(fin));
    $("#act-total").dataset.contar = total;
    $("#act-dias").dataset.contar = activos;
    $("#act-racha").dataset.contar = mejorRacha;
    $("#act-max").dataset.contar = maximo.n;
    $("#act-max-fecha").textContent = "commits el " + formatoDia.format(maximo.fecha) + ", el día más activo";
    $("#act-generado").textContent = "Actualizado al " + formatoDia.format(fin);

    var desliza = $("#act-desliza");
    var tip = $("#act-tip");
    function mostrarTip(celda) {
      if (!celda || !celda.dataset.tip) { tip.hidden = true; return; }
      var r = celda.getBoundingClientRect(), rc = caja.getBoundingClientRect();
      tip.textContent = celda.dataset.tip;
      tip.style.left = Math.max(70, Math.min(rc.width - 70, r.left + r.width / 2 - rc.left)) + "px";
      tip.style.top = (r.top - rc.top) + "px";
      tip.hidden = false;
    }
    grilla.addEventListener("pointerover", function (e) { mostrarTip(e.target.closest("[data-tip]")); });
    grilla.addEventListener("pointerleave", function () { tip.hidden = true; });
    desliza.addEventListener("scroll", function () { tip.hidden = true; }, { passive: true });

    return function () {
      // Lo más reciente queda a la vista cuando el mapa no cabe completo
      desliza.scrollLeft = desliza.scrollWidth;
      $$("[data-contar]", caja).forEach(contar);
      trasPintar(function () { caja.classList.add("lleno"); });
    };
  })();

  /* ---------- Trayectoria: hitos de la experiencia ---------- */
  var listaHitos = $(".hitos");
  var tabsHito = $$(".hito", listaHitos);
  function elegirHito(tab) {
    tabsHito.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("activo", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).classList.toggle("activo", on);
    });
  }
  tabsHito.forEach(function (t) { t.addEventListener("click", function () { elegirHito(t); }); });
  teclasPestanas(listaHitos, elegirHito);

  /* ---------- Vistas: una sección a la vez ---------- */
  var enlacesPestana = $$(".pestanas a");
  var marcaPestanas = $(".pestanas__marca");
  var btnAnterior = $("#btn-anterior");
  var btnSiguiente = $("#btn-siguiente");
  var vistaActual = null;

  function moverMarcaPestanas() {
    var a = $('.pestanas a[aria-current="page"]');
    if (!a) return;
    marcaPestanas.style.setProperty("--x", a.offsetLeft + "px");
    marcaPestanas.style.setProperty("--w", a.offsetWidth + "px");
  }

  function revelar(vista) {
    var elementos = $$(".revelar", vista);
    elementos.forEach(function (el, i) { el.style.setProperty("--retraso", Math.min(i * 70, 560) + "ms"); });
    trasPintar(function () {
      elementos.forEach(function (el) {
        el.classList.add("visible");
        $$("[data-contar]", el).forEach(contar);
      });
    });
  }

  function mostrarVista(id, opciones) {
    opciones = opciones || {};
    if (id !== vistaActual) {
      var antes = VISTAS.indexOf(vistaActual), ahora = VISTAS.indexOf(id);
      var primera = vistaActual === null;
      vistaActual = id;
      $$(".vista").forEach(function (v) {
        var activa = v.id === id;
        v.classList.toggle("activa", activa);
        v.classList.toggle("desde-izq", activa && !primera && ahora < antes);
        if (!activa) $$(".revelar", v).forEach(function (el) { el.classList.remove("visible"); });
      });
      var vista = document.getElementById(id);
      vista.scrollTop = 0;
      revelar(vista);

      enlacesPestana.forEach(function (a) {
        if (a.dataset.ir === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      moverMarcaPestanas();
      btnAnterior.disabled = ahora === 0;
      btnSiguiente.disabled = ahora === VISTAS.length - 1;
      $("#paginador-sig").textContent = ahora < VISTAS.length - 1 ? NOMBRES[VISTAS[ahora + 1]] : "Fin";
      $("#paginador-pos").textContent = "0" + (ahora + 1) + " / 0" + VISTAS.length;
      document.title = id === "inicio" ? TITULO : NOMBRES[id] + " · Erick Colvin";
      if (opciones.foco) {
        var titulo = $("h1, h2", vista);
        if (titulo) titulo.focus({ preventScroll: true });
      }
    }
    if (id === "proyectos") {
      cambiarPanel(opciones.panel || panelActual);
    }
  }

  function aplicarDireccion() {
    var h = location.hash.slice(1);
    var id = VISTAS.indexOf(h) !== -1 ? h : (ALIAS[h] || "inicio");
    mostrarVista(id, { panel: h === "actividad" ? "actividad" : h === "proyectos" ? "galeria" : null });
  }

  function ir(id, opciones) {
    opciones = opciones || {};
    var hash = "#" + (opciones.panel === "actividad" ? "actividad" : id);
    if (location.hash !== hash) history.pushState(null, "", hash);
    mostrarVista(id, opciones);
  }
  function irRelativo(paso) {
    var i = VISTAS.indexOf(vistaActual) + paso;
    if (i >= 0 && i < VISTAS.length) ir(VISTAS[i]);
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-ir]");
    if (!el || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    // Con teclado (detail = 0) el foco pasa al título de la sección
    ir(el.dataset.ir, { panel: el.dataset.panel, foco: e.detail === 0 });
  });
  window.addEventListener("popstate", aplicarDireccion);
  window.addEventListener("hashchange", aplicarDireccion);
  btnAnterior.addEventListener("click", function () { irRelativo(-1); });
  btnSiguiente.addEventListener("click", function () { irRelativo(1); });

  // Flechas izquierda y derecha cambian de sección (salvo dentro de pestañas o campos)
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var t = e.target;
    if (t.closest && (t.closest('[role="tablist"], input, textarea, select, [contenteditable]'))) return;
    irRelativo(e.key === "ArrowRight" ? 1 : -1);
  });

  // Deslizar con el dedo cambia de sección, salvo en las filas que se desplazan de lado
  (function () {
    var inicio = null;
    var escenario = $(".escenario");
    escenario.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1 || e.target.closest(".actividad__desliza, .lista-proyectos, .hitos, .cinta")) { inicio = null; return; }
      inicio = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
    }, { passive: true });
    escenario.addEventListener("touchend", function (e) {
      if (!inicio) return;
      var dx = e.changedTouches[0].clientX - inicio.x;
      var dy = e.changedTouches[0].clientY - inicio.y;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.7 && Date.now() - inicio.t < 700) irRelativo(dx < 0 ? 1 : -1);
      inicio = null;
    }, { passive: true });
  })();

  var pendienteMedida = false;
  window.addEventListener("resize", function () {
    if (pendienteMedida) return;
    pendienteMedida = true;
    requestAnimationFrame(function () { pendienteMedida = false; moverMarcaPestanas(); moverMarcaSegmento(); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moverMarcaPestanas(); moverMarcaSegmento(); });

  aplicarDireccion();

  /* ---------- Luz del cursor, foco en los mosaicos y botones magnéticos ---------- */
  var luz = $(".luz-cursor");
  if (punteroFino) {
    document.body.classList.add("con-puntero");
    window.addEventListener("pointermove", function (e) {
      if (!movimientoCompleto()) return;
      luz.style.setProperty("--x", e.clientX + "px");
      luz.style.setProperty("--y", e.clientY + "px");
      var tile = e.target.closest && e.target.closest(".tile");
      if (tile) {
        var r = tile.getBoundingClientRect();
        tile.style.setProperty("--mx", (e.clientX - r.left) + "px");
        tile.style.setProperty("--my", (e.clientY - r.top) + "px");
      }
    }, { passive: true });

    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".iman");
      if (!el || !movimientoCompleto()) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--iman-x", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
      el.style.setProperty("--iman-y", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
    }, { passive: true });
    document.addEventListener("pointerout", function (e) {
      var el = e.target.closest && e.target.closest(".iman");
      if (!el || el.contains(e.relatedTarget)) return;
      el.style.setProperty("--iman-x", "0px");
      el.style.setProperty("--iman-y", "0px");
    });
  }

  /* ---------- Copiar correo ---------- */
  var btnCopiar = $("#btn-copiar");
  btnCopiar.addEventListener("click", function () {
    var etiqueta = $("span", btnCopiar);
    var correo = btnCopiar.dataset.correo;
    var hecho = function () {
      etiqueta.textContent = "¡Copiado!";
      setTimeout(function () { etiqueta.textContent = "Copiar correo"; }, 2000);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(correo).then(hecho, function () { window.location.href = "mailto:" + correo; });
    } else {
      window.location.href = "mailto:" + correo;
    }
  });

  /* ---------- Hora local de Santiago y año ---------- */
  var formatoHora = new Intl.DateTimeFormat("es-CL", { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" });
  function pintarHora() { $("#hora-local").textContent = formatoHora.format(new Date()); }
  pintarHora();
  setInterval(pintarHora, 30000);
  $("#anio").textContent = new Date().getFullYear();
})();
