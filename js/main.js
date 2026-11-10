(function () {
  "use strict";

  var raiz = document.documentElement;
  var USUARIO_GH = "ErickColvin";
  var PROYECTOS = window.PROYECTOS || [];
  var TEXTOS_EN = window.TEXTOS_EN || {};

  var VISTAS = ["inicio", "trayectoria", "proyectos", "habilidades", "contacto"];
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
  var ICONO_EXTERNO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>';
  var ICONO_CANDADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var ICONO_MUNDO = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/></svg>';
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

  /* ---------- Idioma ---------- */
  var idioma = raiz.dataset.idioma === "en" ? "en" : "es";
  // Un enlace con ?lang= es una elección explícita: se recuerda
  var idiomaUrl = (location.search.match(/[?&]lang=(es|en)\b/) || [])[1];
  if (idiomaUrl) guardar("idioma", idiomaUrl);
  function t(es, en) { return idioma === "en" ? en : es; }
  function campo(p, nombre) { return idioma === "en" && p.en && p.en[nombre] !== undefined ? p.en[nombre] : p[nombre]; }
  var LOCALE = { es: "es-CL", en: "en-US" };
  var alCambiarIdioma = [];

  // El español vive en el HTML: se guarda la primera vez para poder volver a él
  var originales = new WeakMap();
  function original(el) {
    var o = originales.get(el);
    if (!o) { o = { texto: el.textContent, html: el.innerHTML, attrs: {} }; originales.set(el, o); }
    return o;
  }
  function aplicarTextos() {
    var en = idioma === "en";
    $$("[data-i18n]").forEach(function (el) {
      var o = original(el);
      el.textContent = (en && TEXTOS_EN[el.dataset.i18n]) || o.texto;
    });
    $$("[data-i18n-html]").forEach(function (el) {
      var o = original(el);
      el.innerHTML = (en && TEXTOS_EN[el.dataset.i18nHtml]) || o.html;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      var o = original(el);
      el.dataset.i18nAttr.split(";").forEach(function (par) {
        var partes = par.split(":"), attr = partes[0], clave = partes[1];
        if (!(attr in o.attrs)) o.attrs[attr] = el.getAttribute(attr);
        el.setAttribute(attr, (en && TEXTOS_EN[clave]) || o.attrs[attr]);
      });
    });
    // El CV se abre en el mismo idioma
    $$("[data-cv]").forEach(function (a) { a.setAttribute("href", "cv.html?lang=" + idioma); });
  }

  function cambiarIdioma(nuevo) {
    if (nuevo !== "es" && nuevo !== "en") return;
    var cambia = nuevo !== idioma;
    idioma = nuevo;
    raiz.dataset.idioma = nuevo;
    raiz.lang = nuevo === "en" ? "en" : "es-CL";
    aplicarTextos();
    if (cambia) alCambiarIdioma.forEach(function (fn) { fn(); });
  }

  $("#btn-idioma").addEventListener("click", function () {
    var nuevo = idioma === "es" ? "en" : "es";
    guardar("idioma", nuevo);
    cambiarIdioma(nuevo);
  });

  /* ---------- Tema ---------- */
  var btnTema = $("#btn-tema");
  function pintarTema() {
    var claro = raiz.dataset.theme === "light";
    btnTema.title = claro ? t("Cambiar a tema oscuro", "Switch to dark theme") : t("Cambiar a tema claro", "Switch to light theme");
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.content = claro ? "#f4f4f7" : "#07080c";
  }
  btnTema.addEventListener("click", function () {
    raiz.dataset.theme = raiz.dataset.theme === "light" ? "dark" : "light";
    guardar("tema", raiz.dataset.theme);
    pintarTema();
    red.colores();
  });
  alCambiarIdioma.push(pintarTema);

  /* ---------- Animaciones: completo / reducido ---------- */
  var btnMov = $("#btn-movimiento");
  var aviso = $("#aviso-movimiento");
  var avisoPendiente = false;
  function pintarMovimiento() {
    var on = movimientoCompleto();
    btnMov.setAttribute("aria-pressed", String(on));
    btnMov.title = on ? t("Animaciones activadas (clic para reducir)", "Animations on (click to reduce)") : t("Animaciones reducidas (clic para activar)", "Animations reduced (click to turn on)");
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
  alCambiarIdioma.push(pintarMovimiento);

  // Si el sistema pide menos movimiento, se avisa una vez con la opción de activarlas aquí.
  function mostrarAviso() {
    if (!avisoPendiente) return;
    avisoPendiente = false;
    setTimeout(function () { aviso.hidden = false; }, 900);
  }
  if (!leer("movimiento") && !movimientoCompleto() && leer("aviso-movimiento") !== "visto") avisoPendiente = true;
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
  var ROLES = {
    es: ["Ingeniero en Computación e Informática", "Automatización de procesos", "Power Apps · Power Automate", "Desarrollo full-stack", "IA local y datos"],
    en: ["Computer Engineer", "Process automation", "Power Apps · Power Automate", "Full-stack development", "Local AI and data"]
  };
  var elRol = $("#rol");
  var temporizadorRol = null;
  function rotarRol() {
    clearTimeout(temporizadorRol);
    var roles = ROLES[idioma];
    if (!movimientoCompleto()) { elRol.textContent = roles[0]; return; }
    var indice = 0, texto = roles[0], borrando = false;
    elRol.textContent = texto;
    function paso() {
      if (!movimientoCompleto()) { elRol.textContent = roles[0]; return; }
      var objetivo = roles[indice];
      if (!borrando) {
        texto = objetivo.slice(0, texto.length + 1);
        elRol.textContent = texto;
        if (texto === objetivo) { borrando = true; temporizadorRol = setTimeout(paso, 2200); return; }
        temporizadorRol = setTimeout(paso, 55 + Math.random() * 45);
      } else {
        texto = texto.slice(0, -1);
        elRol.textContent = texto;
        if (!texto) { borrando = false; indice = (indice + 1) % roles.length; temporizadorRol = setTimeout(paso, 300); return; }
        temporizadorRol = setTimeout(paso, 28);
      }
    }
    borrando = true;
    temporizadorRol = setTimeout(paso, 3200);
  }
  alCambiarIdioma.push(rotarRol);

  /* ---------- Terminal ---------- */
  function lineasTerminal() {
    return [
      { cmd: "whoami" },
      { sal: '<span class="t-ok">erick-colvin</span>' },
      { cmd: t("cat perfil.txt", "cat profile.txt") },
      { sal: t("Ingeniero en Computación e Informática", "Computer Engineer · Santiago, Chile") },
      { sal: '<span class="t-acento">' + t("Power Platform · Full-stack · IA local", "Power Platform · Full-stack · Local AI") + "</span>" },
      { cmd: t("ls demos/ --en-vivo", "ls demos/ --live") },
      { sal: 'tracelink-preview     <span class="t-ts">TypeScript</span>' },
      { sal: 'finanzas-preview      <span class="t-cs">C# · React</span>' },
      { sal: 'santa-marta-preview   <span class="t-js">JavaScript</span>' },
      { sal: 'rayofps.cl            <span class="t-html">HTML</span>' },
      { cmd: t("./impacto --resumen", "./impact --summary") },
      { sal: '<span class="t-ok">✓</span> ' + t("auditorías 5S+       ", "5S+ audits           ") + '<span class="t-acento">' + t("−70% tiempo", "−70% time") + "</span>" },
      { sal: '<span class="t-ok">✓</span> ' + t("aprobación docs      ", "doc approvals        ") + '<span class="t-acento">' + t("25 → 8 días", "25 → 8 days") + "</span>" }
    ];
  }
  var PROMPT = '<span class="t-prompt">$</span> ';
  var CURSOR = '<span class="t-cursor"></span>';
  var elTerminal = $("#terminal");
  var corridaTerminal = 0;

  function pintarTerminal(html) {
    elTerminal.innerHTML = html;
    elTerminal.scrollTop = elTerminal.scrollHeight;
  }
  function tipearTerminal(reiniciar) {
    var corrida = ++corridaTerminal;
    var lineas = lineasTerminal();
    if (!movimientoCompleto()) {
      pintarTerminal(lineas.map(function (l) {
        return l.cmd ? PROMPT + '<span class="t-cmd">' + l.cmd + "</span>" : '<span class="t-sal">' + l.sal + "</span>";
      }).join("\n") + "\n" + PROMPT + CURSOR);
      return;
    }
    if (!reiniciar && elTerminal.dataset.listo) return;
    var hecho = "";
    var n = 0;
    function siguiente() {
      if (corrida !== corridaTerminal) return;
      if (n >= lineas.length) {
        pintarTerminal(hecho + PROMPT + CURSOR);
        elTerminal.dataset.listo = "1";
        return;
      }
      var linea = lineas[n++];
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
  alCambiarIdioma.push(function () { tipearTerminal(true); });

  /* ---------- Cielo estrellado del fondo (canvas) ---------- */
  // Estrellas que titilan a su ritmo y se desplazan un poco con el cursor (paralaje según su profundidad)
  var red = (function () {
    var lienzo = $("#red");
    var ctx = lienzo.getContext("2d");
    var puntos = [], ancho = 0, alto = 0, dpr = 1, raton = { x: -9999, y: -9999 };
    var desvio = { x: 0, y: 0 };
    var colorPunto = "165,180,252", colorLinea = "125,211,252";
    var cuadro = null;

    function colores() {
      var estilo = getComputedStyle(raiz);
      colorPunto = estilo.getPropertyValue("--red-punto").trim() || colorPunto;
      colorLinea = estilo.getPropertyValue("--red-linea").trim() || colorLinea;
      if (!movimientoCompleto()) dibujar(0);
    }

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ancho = window.innerWidth;
      alto = window.innerHeight;
      lienzo.width = ancho * dpr;
      lienzo.height = alto * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cantidad = Math.min(170, Math.round((ancho * alto) / 8500));
      puntos = [];
      for (var i = 0; i < cantidad; i++) {
        var profundidad = Math.random();
        puntos.push({
          x: Math.random() * ancho,
          y: Math.random() * alto,
          // Las cercanas son más grandes, brillan más y se mueven más con el cursor
          r: 0.35 + profundidad * profundidad * 1.25,
          z: profundidad,
          base: 0.25 + profundidad * 0.55,
          fase: Math.random() * Math.PI * 2,
          ritmo: 0.6 + Math.random() * 1.8,
          // Algunas con el tono de la paleta en vez de blanco
          tinte: Math.random() < 0.18 ? (Math.random() < 0.5 ? "a" : "b") : null
        });
      }
    }

    function dibujar(t) {
      ctx.clearRect(0, 0, ancho, alto);
      var claro = raiz.dataset.theme === "light";
      for (var i = 0; i < puntos.length; i++) {
        var p = puntos[i];
        var brillo = p.base * (0.65 + 0.35 * Math.sin(t * 0.001 * p.ritmo + p.fase));
        if (claro) brillo *= 0.45;
        var color = p.tinte === "a" ? colorLinea : p.tinte === "b" ? colorPunto : claro ? colorPunto : "235,240,255";
        var x = p.x + desvio.x * p.z, y = p.y + desvio.y * p.z;
        ctx.fillStyle = "rgba(" + color + "," + brillo.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
        // Las más brillantes con un pequeño halo
        if (p.r > 1.2 && !claro) {
          ctx.fillStyle = "rgba(" + color + "," + (brillo * 0.18).toFixed(3) + ")";
          ctx.beginPath();
          ctx.arc(x, y, p.r * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function mover() {
      // El cielo se corre hasta 14 px hacia el lado contrario del cursor, con suavidad
      var objetivoX = raton.x < -999 ? 0 : (ancho / 2 - raton.x) / (ancho / 2) * 14;
      var objetivoY = raton.y < -999 ? 0 : (alto / 2 - raton.y) / (alto / 2) * 10;
      desvio.x += (objetivoX - desvio.x) * 0.04;
      desvio.y += (objetivoY - desvio.y) * 0.04;
    }

    function bucle(t) {
      cuadro = null;
      if (!movimientoCompleto() || document.hidden) return;
      mover();
      dibujar(t || 0);
      cuadro = requestAnimationFrame(bucle);
    }

    function reiniciar() {
      if (cuadro) cancelAnimationFrame(cuadro);
      cuadro = null;
      // Un primer cuadro inmediato: con la pestaña en segundo plano requestAnimationFrame no corre
      if (!movimientoCompleto()) desvio.x = desvio.y = 0;
      dibujar(performance.now());
      if (movimientoCompleto()) cuadro = requestAnimationFrame(bucle);
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
    function paso(tiempo) {
      if (t0 === null) t0 = tiempo;
      var k = Math.min(1, (tiempo - t0) / dur);
      var suave = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(inicio + (fin - inicio) * suave);
      if (k < 1) requestAnimationFrame(paso);
    }
    el.textContent = inicio;
    requestAnimationFrame(paso);
  }

  /* ---------- Proyectos: lista y ficha ---------- */
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
    var nombre = function (n) { return n === "Otros" ? t("Otros", "Other") : n; };
    var decimal = function (n) { return idioma === "en" ? n.toFixed(1) : n.toFixed(1).replace(".", ","); };
    var barra = lista.map(function (l, i) {
      return '<span style="--w:' + l.pct.toFixed(2) + "%;--c:" + (COLORES_LENGUAJE[l.nombre] || COLORES_LENGUAJE.Otros) + ";--i:" + i + '" title="' + escapar(nombre(l.nombre)) + " " + decimal(l.pct) + '%"></span>';
    }).join("");
    var leyenda = lista.map(function (l) {
      return '<li><i style="--c:' + (COLORES_LENGUAJE[l.nombre] || COLORES_LENGUAJE.Otros) + '"></i>' + escapar(nombre(l.nombre)) + " <b>" + (l.pct < 1 ? "<1" : decimal(l.pct)) + "%</b></li>";
    }).join("");
    return '<div><p class="mini-titulo">' + t("Lenguajes", "Languages") + '</p><div class="lenguajes__barra" role="img" aria-label="' +
      escapar(lista.map(function (l) { return nombre(l.nombre) + " " + Math.round(l.pct) + "%"; }).join(", ")) + '">' + barra +
      '</div><ul class="lenguajes__ley">' + leyenda + "</ul></div>";
  }

  function htmlFlujo(p) {
    var flujo = campo(p, "flujo");
    if (!flujo) return "";
    var n = flujo.length;
    return '<div class="detalle__flujo"><p class="mini-titulo">' + t("Cómo funciona", "How it works") + '</p><ol class="flujo">' + flujo.map(function (paso, i) {
      return '<li><span style="--i:' + i + ";--n:" + n + '">' + escapar(paso) + "</span></li>";
    }).join("") + "</ol></div>";
  }

  function htmlInsignias(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<span class="insignia insignia--vivo"><i></i>' + t("Demo en vivo", "Live demo") + "</span>");
    if (p.estado === "privado") s.push('<span class="insignia insignia--privado">' + ICONO_CANDADO + t("Código privado", "Private code") + "</span>");
    if (p.estado === "sitio") s.push('<span class="insignia">' + ICONO_MUNDO + t("Sitio publicado", "Published site") + "</span>");
    return s.join("");
  }

  // Vista previa del demo dentro de una ventana de navegador. Es decorativa: el enlace accesible es "Ver demo".
  function htmlCaptura(p) {
    if (!p.captura || !p.enlaces.demo) return "";
    var direccion = p.enlaces.demo.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return '<a class="captura" href="' + p.enlaces.demo + '" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">' +
      '<span class="captura__barra"><i></i><i></i><i></i><span>' + escapar(direccion) + "</span></span>" +
      '<span class="captura__vista"><img src="' + p.captura + '" alt="" width="864" height="1440" decoding="async"></span>' +
      '<span class="captura__abrir">' + t("Abrir demo", "Open demo") + " " + ICONO_EXTERNO + "</span></a>";
  }

  function htmlPie(p) {
    var s = [];
    if (p.enlaces.demo) s.push('<a class="enlace enlace--demo" href="' + p.enlaces.demo + '" target="_blank" rel="noopener">' + ICONO_EXTERNO + t("Ver demo", "View demo") + '<span class="sr"> ' + t("de", "of") + " " + escapar(campo(p, "nombre")) + "</span></a>");
    s.push('<span class="detalle__act" data-act></span>');
    return '<div class="detalle__pie">' + s.join("") + "</div>";
  }

  function htmlResumen(p) {
    var nota = campo(p, "nota");
    return '<p class="detalle__resumen">' + escapar(campo(p, "resumen")) + "</p>" +
      (nota ? '<p class="detalle__nota">' + escapar(nota) + "</p>" : "") +
      '<ul class="puntos">' + campo(p, "puntos").map(function (x) { return "<li>" + escapar(x) + "</li>"; }).join("") + "</ul>";
  }

  // Caso de estudio: el reto, las decisiones que lo resolvieron y el resultado con cifras verificables
  function htmlCaso(p) {
    var caso = campo(p, "caso");
    if (!caso) return "";
    return '<div class="caso"><p class="mini-titulo">' + t("El reto", "The challenge") + '</p><p class="caso__reto">' + escapar(caso.reto) + "</p>" +
      '<p class="mini-titulo">' + t("Decisiones clave", "Key decisions") + '</p><ol class="caso__decisiones">' +
      caso.decisiones.map(function (d) { return "<li>" + escapar(d) + "</li>"; }).join("") + "</ol>" +
      '<p class="mini-titulo">' + t("Resultado", "Outcome") + '</p><ul class="caso__cifras">' +
      caso.cifras.map(function (c) { return "<li><strong>" + escapar(c[0]) + "</strong><span>" + escapar(c[1]) + "</span></li>"; }).join("") +
      '</ul><p class="caso__resultado">' + escapar(caso.resultado) + "</p></div>";
  }

  var modoFicha = "resumen";
  function htmlDetalle(p) {
    var cab = '<header class="detalle__cab"><div class="detalle__icono"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[p.icono] || ICONOS.paquete) + "</svg></div>" +
      '<div class="detalle__titulo"><h3>' + escapar(campo(p, "nombre")) + '</h3><p class="detalle__meta"><span>' + escapar(p.periodo) + "</span><span>" + p.commits + " commits</span>" + htmlInsignias(p) + "</p></div>" +
      '<div class="segmento segmento--chico" role="tablist" aria-label="' + t("Contenido de la ficha", "Card content") + '">' +
      '<button type="button" role="tab" data-modo="resumen" aria-selected="' + (modoFicha === "resumen") + '" tabindex="' + (modoFicha === "resumen" ? 0 : -1) + '"' + (modoFicha === "resumen" ? ' class="activo"' : "") + ">" + t("Resumen", "Overview") + "</button>" +
      '<button type="button" role="tab" data-modo="caso" aria-selected="' + (modoFicha === "caso") + '" tabindex="' + (modoFicha === "caso" ? 0 : -1) + '"' + (modoFicha === "caso" ? ' class="activo"' : "") + ">" + t("Caso de estudio", "Case study") + "</button></div></header>";
    var texto = '<div class="detalle__texto"><div class="detalle__modo" data-modo="resumen"' + (modoFicha === "resumen" ? "" : " hidden") + ">" + htmlResumen(p) + "</div>" +
      '<div class="detalle__modo" data-modo="caso"' + (modoFicha === "caso" ? "" : " hidden") + ">" + htmlCaso(p) + "</div>" + htmlPie(p) + "</div>";
    var visual = '<div class="detalle__visual">' + htmlCaptura(p) + htmlFlujo(p) + htmlLenguajes(p) +
      '<div><p class="mini-titulo">' + t("Tecnologías", "Tech stack") + '</p><div class="chips chips--separado">' + p.tecnologias.map(function (x) { return "<span>" + escapar(x) + "</span>"; }).join("") + "</div></div></div>";
    return '<article class="tile detalle">' + cab + '<div class="detalle__cuerpo">' + texto + visual + "</div></article>";
  }

  var listaProyectos = $("#lista-proyectos");
  var cajaDetalle = $("#detalle");
  var proyectoActual = null;
  var pushes = {};
  function haceCuanto(fecha) {
    var formato = new Intl.RelativeTimeFormat(idioma, { numeric: "auto" });
    var seg = (new Date(fecha).getTime() - Date.now()) / 1000;
    var tramos = [[60, "second"], [60, "minute"], [24, "hour"], [30, "day"], [12, "month"], [Infinity, "year"]];
    for (var i = 0; i < tramos.length; i++) {
      if (Math.abs(seg) < tramos[i][0]) return formato.format(Math.round(seg), tramos[i][1]);
      seg /= tramos[i][0];
    }
  }
  function pintarActualizado() {
    var el = $("[data-act]", cajaDetalle);
    if (el && proyectoActual && pushes[proyectoActual.repo]) el.textContent = t("Demo actualizada ", "Demo updated ") + haceCuanto(pushes[proyectoActual.repo]);
  }

  var tabsProyecto = [];
  function pintarLista() {
    listaProyectos.innerHTML = PROYECTOS.map(function (p) {
      return '<button type="button" role="tab" class="item-proyecto" id="tab-' + p.id + '" data-id="' + p.id + '" data-categorias="' + p.categorias.join(" ") +
        '" aria-controls="detalle" aria-selected="false" tabindex="-1"><span class="item-proyecto__icono"><svg viewBox="0 0 24 24" aria-hidden="true">' + (ICONOS[p.icono] || ICONOS.paquete) +
        "</svg></span><span><strong>" + escapar(campo(p, "nombre")) + "</strong><small>" + escapar(p.periodo) + (p.enlaces.demo ? t(" · demo en vivo", " · live demo") : "") + "</small></span>" + ICONO_FLECHA + "</button>";
    }).join("");
    tabsProyecto = $$(".item-proyecto", listaProyectos);
    tabsProyecto.forEach(function (tab) { tab.addEventListener("click", function () { elegirProyecto(tab); }); });
  }

  function elegirProyecto(tab) {
    var p = PROYECTOS.filter(function (x) { return x.id === tab.dataset.id; })[0];
    if (!p) return;
    proyectoActual = p;
    tabsProyecto.forEach(function (x) {
      var on = x === tab;
      x.classList.toggle("activo", on);
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
    });
    cajaDetalle.setAttribute("aria-labelledby", tab.id);
    cajaDetalle.innerHTML = htmlDetalle(p);
    var art = $(".detalle", cajaDetalle);
    trasPintar(function () { art.classList.add("lleno"); });
    pintarActualizado();
  }

  // Resumen / Caso de estudio dentro de la ficha (se recuerda al cambiar de proyecto)
  function elegirModoFicha(boton) {
    modoFicha = boton.dataset.modo;
    $$(".segmento--chico button", cajaDetalle).forEach(function (b) {
      var on = b === boton;
      b.classList.toggle("activo", on);
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $$(".detalle__modo", cajaDetalle).forEach(function (m) { m.hidden = m.dataset.modo !== modoFicha; });
  }
  cajaDetalle.addEventListener("click", function (e) {
    var b = e.target.closest(".segmento--chico button");
    if (b) elegirModoFicha(b);
  });
  cajaDetalle.addEventListener("keydown", function (e) {
    if (!e.target.closest(".segmento--chico")) return;
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    var botones = $$(".segmento--chico button", cajaDetalle);
    var otro = botones[(botones.indexOf(e.target) + 1) % botones.length];
    e.preventDefault();
    e.stopPropagation();
    elegirModoFicha(otro);
    otro.focus();
  });

  pintarLista();
  teclasPestanas(listaProyectos, elegirProyecto);
  if (tabsProyecto.length) elegirProyecto(tabsProyecto[0]);

  // Filtros: esconden proyectos de la lista; si el elegido queda oculto, se pasa al primero visible
  var botonesFiltro = $$(".filtro");
  var filtroActual = "todos";
  function filtrar(filtro) {
    filtroActual = filtro;
    botonesFiltro.forEach(function (b) {
      var activo = b.dataset.filtro === filtro;
      b.classList.toggle("activo", activo);
      b.setAttribute("aria-pressed", String(activo));
    });
    var visibles = tabsProyecto.filter(function (x) {
      var entra = filtro === "todos" || x.dataset.categorias.split(" ").indexOf(filtro) !== -1;
      x.hidden = !entra;
      return entra;
    });
    var actual = $(".item-proyecto.activo", listaProyectos);
    if (visibles.length && (!actual || actual.hidden)) elegirProyecto(visibles[0]);
  }
  botonesFiltro.forEach(function (b) { b.addEventListener("click", function () { filtrar(b.dataset.filtro); }); });

  alCambiarIdioma.push(function () {
    var id = proyectoActual && proyectoActual.id;
    pintarLista();
    filtrar(filtroActual);
    var tab = $("#tab-" + id) || tabsProyecto[0];
    if (tab) elegirProyecto(tab);
  });

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
  var botonesSegmento = $$(".segmento[aria-label] > button").filter(function (b) { return b.dataset.panel; });
  var marcaSegmento = $(".segmento__marca");
  var panelActual = "galeria";
  function moverMarcaSegmento() {
    var b = botonesSegmento.filter(function (x) { return x.classList.contains("activo"); })[0];
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
    if (panel === "actividad") actividad.mostrar();
  }
  function elegirSegmento(b) {
    cambiarPanel(b.dataset.panel);
    history.replaceState(null, "", b.dataset.panel === "actividad" ? "#actividad" : "#proyectos");
  }
  botonesSegmento.forEach(function (b) { b.addEventListener("click", function () { elegirSegmento(b); }); });
  teclasPestanas(botonesSegmento[0].parentNode, elegirSegmento);

  /* ---------- Actividad: commits por día, como el mapa de GitHub ---------- */
  var actividad = (function () {
    var datos = window.ACTIVIDAD;
    var caja = $("#actividad");
    if (!datos || !caja || !Object.keys(datos.dias).length) {
      $("#seg-actividad").hidden = true;
      return { mostrar: function () {}, construir: function () {} };
    }
    var grilla = $("#act-grilla");
    var desliza = $("#act-desliza");
    var tabla = $(".actividad__tabla", caja);
    var tip = $("#act-tip");

    // A mediodía, para que los cambios de horario no muevan los días
    function aFecha(clave) { var p = clave.split("-"); return new Date(+p[0], p[1] - 1, +p[2], 12); }
    function aClave(f) { return f.getFullYear() + "-" + ("0" + (f.getMonth() + 1)).slice(-2) + "-" + ("0" + f.getDate()).slice(-2); }

    function construir() {
      var formatoDia = new Intl.DateTimeFormat(LOCALE[idioma], { day: "numeric", month: "short", year: "numeric" });
      var formatoMesCorto = new Intl.DateTimeFormat(LOCALE[idioma], { month: "short" });
      var formatoMesLargo = new Intl.DateTimeFormat(LOCALE[idioma], { month: "long", year: "numeric" });

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
          var texto = (n ? n + (n === 1 ? " commit" : " commits") : t("Sin commits", "No commits")) + " · " + formatoDia.format(dia);
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

      tabla.style.setProperty("--cols", col + 1);
      // Con pocas semanas las celdas crecen para que el mapa no quede perdido en la tarjeta
      tabla.style.setProperty("--celda", col < 26 ? "18px" : col < 40 ? "15px" : "12px");
      grilla.innerHTML = celdas.join("");
      $("#act-meses").innerHTML = meses.join("");
      $("#act-semana").innerHTML = (idioma === "en" ? ["Mon", "", "Wed", "", "Fri", "", ""] : ["lun", "", "mié", "", "vie", "", ""])
        .map(function (d) { return "<span>" + d + "</span>"; }).join("");
      grilla.setAttribute("aria-label", t(total + " commits en " + activos + " días, entre " + formatoMesLargo.format(primero) + " y " + formatoMesLargo.format(fin),
        total + " commits on " + activos + " days, from " + formatoMesLargo.format(primero) + " to " + formatoMesLargo.format(fin)));
      $("#act-total").dataset.contar = total;
      $("#act-dias").dataset.contar = activos;
      $("#act-racha").dataset.contar = mejorRacha;
      $("#act-max").dataset.contar = maximo.n;
      $("#act-max-fecha").textContent = t("commits el " + formatoDia.format(maximo.fecha) + ", el día más activo", "commits on " + formatoDia.format(maximo.fecha) + ", the busiest day");
      $("#act-generado").textContent = t("Actualizado al ", "Updated ") + formatoDia.format(fin);
      $$("[data-contar]", caja).forEach(function (el) { if (contadoresHechos.has(el)) el.textContent = el.dataset.contar; });
    }

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

    construir();
    alCambiarIdioma.push(construir);
    return {
      construir: construir,
      mostrar: function () {
        // Lo más reciente queda a la vista cuando el mapa no cabe completo
        desliza.scrollLeft = desliza.scrollWidth;
        $$("[data-contar]", caja).forEach(contar);
        trasPintar(function () { caja.classList.add("lleno"); });
      }
    };
  })();

  /* ---------- Trayectoria: hitos de la experiencia ---------- */
  var listaHitos = $(".hitos");
  var tabsHito = $$(".hito", listaHitos);
  function elegirHito(tab) {
    tabsHito.forEach(function (x) {
      var on = x === tab;
      x.classList.toggle("activo", on);
      x.setAttribute("aria-selected", String(on));
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).classList.toggle("activo", on);
    });
  }
  tabsHito.forEach(function (x) { x.addEventListener("click", function () { elegirHito(x); }); });
  teclasPestanas(listaHitos, elegirHito);

  /* ---------- Vistas: una sección a la vez ---------- */
  var enlacesPestana = $$(".pestanas a");
  var marcaPestanas = $(".pestanas__marca");
  var btnAnterior = $("#btn-anterior");
  var btnSiguiente = $("#btn-siguiente");
  var vistaActual = null;
  function nombreVista(id) {
    return {
      inicio: t("Inicio", "Home"), trayectoria: t("Trayectoria", "Journey"), proyectos: t("Proyectos", "Projects"),
      habilidades: t("Habilidades", "Skills"), contacto: t("Contacto", "Contact")
    }[id];
  }

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

  function actualizarPaginador() {
    var ahora = VISTAS.indexOf(vistaActual);
    btnAnterior.disabled = ahora === 0;
    btnSiguiente.disabled = ahora === VISTAS.length - 1;
    $("#paginador-sig").textContent = ahora < VISTAS.length - 1 ? nombreVista(VISTAS[ahora + 1]) : t("Fin", "End");
    btnSiguiente.setAttribute("aria-label", ahora < VISTAS.length - 1 ? t("Siguiente sección: ", "Next section: ") + nombreVista(VISTAS[ahora + 1]) : t("Última sección", "Last section"));
    $("#paginador-pos").textContent = "0" + (ahora + 1) + " / 0" + VISTAS.length;
    document.title = vistaActual === "inicio"
      ? t("Erick Colvin · Ingeniero en Computación e Informática", "Erick Colvin · Computer Engineer")
      : nombreVista(vistaActual) + " · Erick Colvin";
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
      actualizarPaginador();
      if (opciones.foco) {
        var titulo = $("h1, h2", vista);
        if (titulo) titulo.focus({ preventScroll: true });
      }
    }
    if (id === "proyectos") cambiarPanel(opciones.panel || panelActual);
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

  // Flechas izquierda y derecha cambian de sección (salvo dentro de pestañas, campos o el diálogo de idioma)
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var x = e.target;
    if (x.closest && x.closest('[role="tablist"], input, textarea, select, [contenteditable], dialog')) return;
    irRelativo(e.key === "ArrowRight" ? 1 : -1);
  });

  // Deslizar con el dedo cambia de sección, salvo en las filas que se desplazan de lado
  (function () {
    var inicio = null;
    var escenario = $(".escenario");
    escenario.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1 || e.target.closest(".actividad__desliza, .lista-proyectos, .hitos")) { inicio = null; return; }
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
  function medirMarcas() { moverMarcaPestanas(); moverMarcaSegmento(); }
  window.addEventListener("resize", function () {
    if (pendienteMedida) return;
    pendienteMedida = true;
    requestAnimationFrame(function () { pendienteMedida = false; medirMarcas(); });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirMarcas);
  // Los textos cambian de ancho con el idioma: las píldoras se vuelven a medir
  alCambiarIdioma.push(function () { actualizarPaginador(); requestAnimationFrame(medirMarcas); });

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
      etiqueta.textContent = t("¡Copiado!", "Copied!");
      setTimeout(function () { etiqueta.textContent = t("Copiar correo", "Copy email"); }, 2000);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(correo).then(hecho, function () { window.location.href = "mailto:" + correo; });
    } else {
      window.location.href = "mailto:" + correo;
    }
  });

  /* ---------- Hora local de Santiago y año ---------- */
  function pintarHora() {
    $("#hora-local").textContent = new Intl.DateTimeFormat(LOCALE[idioma], { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" }).format(new Date());
  }
  setInterval(pintarHora, 30000);
  alCambiarIdioma.push(pintarHora);
  $("#anio").textContent = new Date().getFullYear();

  /* ---------- Arranque ---------- */
  aplicarTextos();
  pintarTema();
  pintarMovimiento();
  pintarHora();
  rotarRol();
  tipearTerminal(false);
  aplicarDireccion();

  /* ---------- Elección de idioma en la primera visita ---------- */
  var dialogo = $("#dialogo-idioma");
  function cerrarDialogo(elegido) {
    guardar("idioma", elegido);
    cambiarIdioma(elegido);
    raiz.dataset.idiomaElegido = "si";
    if (!movimientoCompleto()) { dialogo.close(); mostrarAviso(); return; }
    dialogo.classList.add("cerrando");
    setTimeout(function () { dialogo.classList.remove("cerrando"); dialogo.close(); mostrarAviso(); }, 260);
  }
  if (raiz.dataset.idiomaElegido === "no" && dialogo && typeof dialogo.showModal === "function") {
    dialogo.showModal();
    var sugerido = $('.opcion-idioma[data-idioma="' + idioma + '"]', dialogo);
    sugerido.classList.add("sugerida");
    sugerido.focus();
    $$(".opcion-idioma", dialogo).forEach(function (b) {
      b.addEventListener("click", function () { cerrarDialogo(b.dataset.idioma); });
    });
    // Escape cierra con el idioma detectado
    dialogo.addEventListener("cancel", function (e) { e.preventDefault(); cerrarDialogo(idioma); });
  } else {
    mostrarAviso();
  }
})();
