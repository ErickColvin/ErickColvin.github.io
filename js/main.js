(function () {
  "use strict";

  var raiz = document.documentElement;
  var USUARIO_GH = "ErickColvin";
  var PROYECTOS = window.PROYECTOS || [];

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
    rayo: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    birrete: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
    panel: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    equipo: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.1a4 4 0 0 1 0 7.8"/>'
  };
  var ICONO_GITHUB = '<svg class="relleno" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2 0-.3-.5-1.5.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>';
  var ICONO_EXTERNO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
  var ICONO_CANDADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

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
  var punteroFino = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Tema ---------- */
  var btnTema = $("#btn-tema");
  function pintarTema() {
    var claro = raiz.dataset.theme === "light";
    btnTema.title = claro ? "Cambiar a tema oscuro" : "Cambiar a tema claro";
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.content = claro ? "#f4f5fa" : "#07080d";
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

  /* ---------- Menú móvil ---------- */
  var nav = $("#nav");
  var btnMenu = $("#btn-menu");
  function cerrarMenu() {
    nav.classList.remove("nav--abierto");
    btnMenu.setAttribute("aria-expanded", "false");
  }
  btnMenu.addEventListener("click", function () {
    var abierto = nav.classList.toggle("nav--abierto");
    btnMenu.setAttribute("aria-expanded", String(abierto));
  });
  $$("#menu a").forEach(function (a) { a.addEventListener("click", cerrarMenu); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") cerrarMenu(); });
  document.addEventListener("click", function (e) { if (!nav.contains(e.target)) cerrarMenu(); });

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
    { cmd: "gh repo list --public --limit 4" },
    { sal: 'TraceLink                 <span class="t-ts">TypeScript</span>' },
    { sal: 'finanzas-personales-demo  <span class="t-cs">C#</span>' },
    { sal: 'rayo-web                  <span class="t-html">HTML</span>' },
    { sal: 'santa-marta-preview       <span class="t-html">HTML</span>' },
    { cmd: "./impacto --resumen" },
    { sal: '<span class="t-ok">✓</span> auditorías 5S+       <span class="t-acento">−70% tiempo</span>' },
    { sal: '<span class="t-ok">✓</span> aprobación docs      <span class="t-acento">25 → 8 días</span>' }
  ];
  var PROMPT = '<span class="t-prompt">$</span> ';
  var CURSOR = '<span class="t-cursor"></span>';
  var elTerminal = $("#terminal");
  var corridaTerminal = 0;

  function terminalCompleta() {
    return LINEAS_TERMINAL.map(function (l) {
      return l.cmd ? PROMPT + '<span class="t-cmd">' + l.cmd + "</span>" : '<span class="t-sal">' + l.sal + "</span>";
    }).join("\n") + "\n" + PROMPT + CURSOR;
  }

  function tipearTerminal(reiniciar) {
    var corrida = ++corridaTerminal;
    if (!movimientoCompleto()) { elTerminal.innerHTML = terminalCompleta(); return; }
    if (!reiniciar && elTerminal.dataset.listo) return;
    var hecho = "";
    var n = 0;
    function siguiente() {
      if (corrida !== corridaTerminal) return;
      if (n >= LINEAS_TERMINAL.length) {
        elTerminal.innerHTML = hecho + PROMPT + CURSOR;
        elTerminal.dataset.listo = "1";
        return;
      }
      var linea = LINEAS_TERMINAL[n++];
      if (linea.sal) {
        hecho += '<span class="t-sal">' + linea.sal + "</span>\n";
        elTerminal.innerHTML = hecho + CURSOR;
        setTimeout(siguiente, 90);
        return;
      }
      var c = 0;
      (function tecla() {
        if (corrida !== corridaTerminal) return;
        c++;
        elTerminal.innerHTML = hecho + PROMPT + '<span class="t-cmd">' + linea.cmd.slice(0, c) + "</span>" + CURSOR;
        if (c < linea.cmd.length) { setTimeout(tecla, 38 + Math.random() * 50); return; }
        hecho += PROMPT + '<span class="t-cmd">' + linea.cmd + "</span>\n";
        setTimeout(siguiente, 380);
      })();
    }
    elTerminal.innerHTML = PROMPT + CURSOR;
    setTimeout(siguiente, 900);
  }
  tipearTerminal(false);

  /* ---------- Red de nodos del inicio (canvas) ---------- */
  var red = (function () {
    var lienzo = $("#red");
    var ctx = lienzo.getContext("2d");
    var hero = $("#inicio");
    var puntos = [], ancho = 0, alto = 0, dpr = 1, raton = { x: -9999, y: -9999 };
    var colorPunto = "129,140,248", colorLinea = "34,211,238";
    var visible = true, cuadro = null;

    function colores() {
      var estilo = getComputedStyle(raiz);
      colorPunto = estilo.getPropertyValue("--red-punto").trim() || colorPunto;
      colorLinea = estilo.getPropertyValue("--red-linea").trim() || colorLinea;
      if (!movimientoCompleto()) dibujar();
    }

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = hero.clientWidth;
      alto = hero.clientHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cantidad = Math.min(95, Math.round((ancho * alto) / 15000));
      puntos = [];
      for (var i = 0; i < cantidad; i++) {
        puntos.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.8
        });
      }
    }

    function dibujar() {
      ctx.clearRect(0, 0, ancho, alto);
      var DIST = 135, DIST_RATON = 190;
      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        for (var j = i + 1; j < puntos.length; j++) {
          var q = puntos[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < DIST * DIST) {
            ctx.strokeStyle = "rgba(" + colorLinea + "," + (1 - Math.sqrt(d2) / DIST) * 0.22 + ")";
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
          ctx.strokeStyle = "rgba(" + colorPunto + "," + (1 - dm / DIST_RATON) * 0.55 + ")";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(raton.x, raton.y);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(" + colorPunto + ",0.75)";
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
        if (d < 190 && d > 1) { p.vx += (dx / d) * 0.012; p.vy += (dy / d) * 0.012; }
        p.vx *= 0.992; p.vy *= 0.992;
        var vel = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (vel < 0.12) { p.vx += (Math.random() - 0.5) * 0.04; p.vy += (Math.random() - 0.5) * 0.04; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > ancho) p.vx *= -1;
        if (p.y < 0 || p.y > alto) p.vy *= -1;
        p.x = Math.max(0, Math.min(ancho, p.x));
        p.y = Math.max(0, Math.min(alto, p.y));
      }
    }

    function bucle() {
      cuadro = null;
      if (!visible || !movimientoCompleto() || document.hidden) return;
      mover();
      dibujar();
      cuadro = requestAnimationFrame(bucle);
    }

    function reiniciar() {
      if (cuadro) cancelAnimationFrame(cuadro);
      cuadro = null;
      if (movimientoCompleto()) bucle(); else dibujar();
    }

    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      raton.x = e.clientX - r.left;
      raton.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", function () { raton.x = raton.y = -9999; });

    new IntersectionObserver(function (entradas) {
      visible = entradas[0].isIntersecting;
      if (visible && !cuadro) reiniciar();
    }).observe(hero);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) reiniciar(); });

    var temporizadorMedida;
    var anchoPrevio = window.innerWidth;
    window.addEventListener("resize", function () {
      // En móvil la barra del navegador cambia el alto al hacer scroll: solo se recalcula si cambia el ancho.
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

  /* ---------- Proyectos ---------- */
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
    return '<div class="lenguajes"><p class="lenguajes__titulo">Lenguajes</p><div class="lenguajes__barra" role="img" aria-label="' +
      escapar(lista.map(function (l) { return l.nombre + " " + Math.round(l.pct) + "%"; }).join(", ")) + '">' + barra +
      '</div><ul class="lenguajes__ley">' + leyenda + "</ul></div>";
  }

  function htmlFlujo(p) {
    if (!p.flujo) return "";
    var n = p.flujo.length;
    return '<div><p class="flujo__titulo">Cómo funciona</p><ol class="flujo">' + p.flujo.map(function (paso, i) {
      return '<li><span style="--i:' + i + ";--n:" + n + '">' + escapar(paso) + "</span></li>";
    }).join("") + "</ol></div>";
  }

  function htmlInsignias(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<span class="insignia insignia--vivo"><i></i>Demo en vivo</span>');
    if (p.estado === "privado") s.push('<span class="insignia insignia--privado">' + ICONO_CANDADO + "Código privado</span>");
    else if (p.estado === "demo-publica") s.push('<span class="insignia">Versión demo pública</span>');
    else s.push('<span class="insignia">Público</span>');
    return '<div class="insignias">' + s.join("") + "</div>";
  }

  function htmlEnlaces(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<a class="enlace enlace--demo" href="' + p.enlaces.demo + '" target="_blank" rel="noopener">' + ICONO_EXTERNO + 'Ver demo<span class="sr"> de ' + escapar(p.nombre) + "</span></a>");
    if (p.enlaces.codigo) s.push('<a class="enlace" href="' + p.enlaces.codigo + '" target="_blank" rel="noopener">' + ICONO_GITHUB + 'Código<span class="sr"> de ' + escapar(p.nombre) + "</span></a>");
    s.push('<span class="proyecto__act" data-act="' + escapar(p.repo) + '"></span>');
    return '<footer class="proyecto__pie">' + s.join("") + "</footer>";
  }

  function htmlProyecto(p) {
    var cab = '<header class="proyecto__cab"><div class="proyecto__icono"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[p.icono] || ICONOS.paquete) +
      '</svg></div><div class="proyecto__meta"><span class="proyecto__anio">' + escapar(p.periodo) + "</span>" + htmlInsignias(p) + "</div></header>";
    var titulo = "<h3>" + escapar(p.nombre) + "</h3>";
    var resumen = '<p class="proyecto__resumen">' + escapar(p.resumen) + "</p>" + (p.nota ? '<p class="proyecto__nota">' + escapar(p.nota) + "</p>" : "");
    var puntos = '<ul class="proyecto__puntos">' + p.puntos.map(function (t) { return "<li>" + escapar(t) + "</li>"; }).join("") + "</ul>";
    var chips = '<div class="chips">' + p.tecnologias.map(function (t) { return "<span>" + escapar(t) + "</span>"; }).join("") + "</div>";

    if (p.destacado) {
      return '<article class="proyecto proyecto--destacado">' +
        '<div class="proyecto__principal">' + cab + titulo + resumen + puntos + htmlEnlaces(p) + "</div>" +
        '<div class="proyecto__lateral"><div class="proyecto__dato"><strong data-contar="' + p.commits + '">' + p.commits + "</strong><span>commits · el proyecto más grande del portafolio</span></div>" +
        htmlFlujo(p) + htmlLenguajes(p) + chips + "</div></article>";
    }
    return '<article class="proyecto">' +
      '<div class="proyecto__principal">' + cab + titulo + resumen + puntos + "</div>" +
      '<div class="proyecto__lateral">' + htmlFlujo(p) + htmlLenguajes(p) + chips + "</div>" +
      htmlEnlaces(p) + "</article>";
  }

  var lista = $("#proyectos-lista");
  lista.innerHTML = PROYECTOS.map(function (p) {
    return '<div class="envoltura revelar' + (p.destacado ? " envoltura--destacado" : "") + '" data-categorias="' + p.categorias.join(" ") + '">' + htmlProyecto(p) + "</div>";
  }).join("");

  // Resumen calculado desde los datos
  (function () {
    var commits = 0, lenguajes = {}, demos = 0;
    PROYECTOS.forEach(function (p) {
      commits += p.commits || 0;
      Object.keys(p.lenguajes).forEach(function (k) { lenguajes[k] = true; });
      if (p.enlaces.demo) demos++;
    });
    $("#gh-commits").textContent = commits;
    $("#gh-lenguajes").textContent = Object.keys(lenguajes).length;
    $("#gh-demos").textContent = demos;
    var cifra = $("#cifra-commits");
    cifra.dataset.contar = commits;
    cifra.textContent = commits;
    $("#cifra-proyectos").textContent = PROYECTOS.length;
  })();

  // Línea de evolución
  var formatoMes = new Intl.DateTimeFormat("es-CL", { month: "short", year: "numeric" });
  $("#evolucion").innerHTML = PROYECTOS.slice().sort(function (a, b) { return a.inicio < b.inicio ? -1 : 1; }).map(function (p, i) {
    var fecha = new Date(p.inicio + "-15T12:00:00");
    return '<li style="--i:' + i + '"><a href="#proyecto-' + p.id + '" data-ir="' + p.id + '"><time datetime="' + p.inicio + '">' + formatoMes.format(fecha) + "</time><strong>" + escapar(p.nombre) + "</strong></a></li>";
  }).join("");
  $$(".envoltura").forEach(function (env, i) { env.id = "proyecto-" + PROYECTOS[i].id; });
  $$("#evolucion a").forEach(function (a) {
    a.addEventListener("click", function () {
      // Si el filtro actual esconde el proyecto, se vuelve a "Todos"
      var destino = document.getElementById("proyecto-" + a.dataset.ir);
      if (destino && destino.classList.contains("oculto")) filtrar("todos");
    });
  });

  // Filtros
  var botonesFiltro = $$(".filtro");
  function filtrar(filtro) {
    botonesFiltro.forEach(function (b) {
      var activo = b.dataset.filtro === filtro;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", String(activo));
    });
    var orden = 0;
    $$(".envoltura").forEach(function (env) {
      var entra = filtro === "todos" || env.dataset.categorias.split(" ").indexOf(filtro) !== -1;
      env.classList.remove("entra");
      if (!entra) { env.classList.add("oculto"); return; }
      env.classList.remove("oculto");
      env.classList.add("visible");
      void env.offsetWidth; // reinicia la animación de entrada
      env.style.setProperty("--retraso", (orden++ * 70) + "ms");
      env.classList.add("entra");
    });
  }
  botonesFiltro.forEach(function (b) {
    b.addEventListener("click", function () { filtrar(b.dataset.filtro); });
  });

  // Inclinación 3D y foco de luz que sigue al cursor
  $$(".proyecto").forEach(function (tarjeta) {
    var destacada = tarjeta.classList.contains("proyecto--destacado");
    tarjeta.addEventListener("pointermove", function (e) {
      var r = tarjeta.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      tarjeta.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      tarjeta.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      if (!movimientoCompleto() || !punteroFino) return;
      var fuerza = destacada ? 3 : 7;
      tarjeta.classList.add("inclinando");
      tarjeta.style.setProperty("--rx", ((0.5 - y) * fuerza).toFixed(2) + "deg");
      tarjeta.style.setProperty("--ry", ((x - 0.5) * fuerza).toFixed(2) + "deg");
    });
    tarjeta.addEventListener("pointerleave", function () {
      tarjeta.classList.remove("inclinando");
      tarjeta.style.setProperty("--rx", "0deg");
      tarjeta.style.setProperty("--ry", "0deg");
    });
  });

  /* ---------- Datos en vivo desde GitHub ---------- */
  var tiempoRelativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
  function haceCuanto(fecha) {
    var seg = (new Date(fecha).getTime() - Date.now()) / 1000;
    var tramos = [[60, "second"], [60, "minute"], [24, "hour"], [30, "day"], [12, "month"], [Infinity, "year"]];
    for (var i = 0; i < tramos.length; i++) {
      if (Math.abs(seg) < tramos[i][0]) return tiempoRelativo.format(Math.round(seg), tramos[i][1]);
      seg /= tramos[i][0];
    }
  }
  fetch("https://api.github.com/users/" + USUARIO_GH + "/repos?per_page=100&type=owner")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
    .then(function (repos) {
      var publicos = repos.filter(function (r) { return !r.fork && !r.private; });
      $("#gh-repos").textContent = publicos.length;
      publicos.forEach(function (r) {
        var el = document.querySelector('[data-act="' + r.name + '"]');
        if (el) el.textContent = "Actualizado " + haceCuanto(r.pushed_at);
      });
    })
    .catch(function () { /* sin conexión o límite de la API: se quedan los datos estáticos */ });

  /* ---------- Aparición al hacer scroll ---------- */
  $$("[data-escalonar]").forEach(function (grupo) {
    $$(".revelar", grupo).forEach(function (el, i) { el.style.setProperty("--retraso", (i * 90) + "ms"); });
  });

  var contadoresHechos = new WeakSet();
  function contar(el) {
    if (contadoresHechos.has(el)) return;
    contadoresHechos.add(el);
    var fin = parseFloat(el.dataset.contar);
    var inicio = el.dataset.desde ? parseFloat(el.dataset.desde) : 0;
    if (!movimientoCompleto()) { el.textContent = fin; return; }
    var dur = 1700, t0 = null;
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

  var observadorRevelar = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      $$("[data-contar]", e.target).forEach(contar);
      observadorRevelar.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".revelar").forEach(function (el) { observadorRevelar.observe(el); });

  /* ---------- Scroll: barra de progreso, nav y línea de tiempo ---------- */
  var barra = $(".progreso span");
  var lineaTiempo = $("#linea-tiempo");
  var pendiente = false;
  function alHacerScroll() {
    pendiente = false;
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    nav.classList.toggle("nav--scroll", y > 24);
    var r = lineaTiempo.getBoundingClientRect();
    var avance = (window.innerHeight * 0.65 - r.top) / r.height;
    lineaTiempo.style.setProperty("--progreso", Math.max(0, Math.min(1, avance)).toFixed(3));
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; requestAnimationFrame(alHacerScroll); }
  }, { passive: true });
  alHacerScroll();

  // Enlace activo del menú según la sección visible
  var enlacesMenu = $$("#menu a");
  var observadorSecciones = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (e) {
      if (!e.isIntersecting) return;
      enlacesMenu.forEach(function (a) { a.classList.toggle("activo", a.getAttribute("href") === "#" + e.target.id); });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(function (s) { observadorSecciones.observe(s); });

  /* ---------- Luz del cursor y botones magnéticos ---------- */
  var luz = $(".luz-cursor");
  if (punteroFino) {
    document.body.classList.add("con-puntero");
    window.addEventListener("pointermove", function (e) {
      if (!movimientoCompleto()) return;
      luz.style.setProperty("--x", e.clientX + "px");
      luz.style.setProperty("--y", e.clientY + "px");
    }, { passive: true });

    $$(".iman").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        if (!movimientoCompleto()) return;
        var r = el.getBoundingClientRect();
        el.style.setProperty("--iman-x", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        el.style.setProperty("--iman-y", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
      });
      el.addEventListener("pointerleave", function () {
        el.style.setProperty("--iman-x", "0px");
        el.style.setProperty("--iman-y", "0px");
      });
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

  $("#anio").textContent = new Date().getFullYear();
})();
