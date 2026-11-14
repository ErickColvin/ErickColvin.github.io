/* Recorrido automático por las experiencias de la vista Experiencia.
   Dos partes:
   1) crearRecorrido(): la lógica, sin DOM, para poder probarla en Node.
   2) montar(): el botón, el estado y la barra dentro de <div id="recorrido">. */
(function (global) {
  "use strict";

  function nada() {}

  /* ---------- 1) Lógica pura ---------- */
  // Fases: "inactivo" → "reproduciendo" ⇄ "pausado" → "terminado".
  // total:     cantidad de experiencias.
  // actual:    función que devuelve el índice visible (base 0); también acepta un número inicial.
  // irA(i):    muestra la experiencia i.
  // alCambiar(estado, evento): avisa cada cambio de fase o de posición
  //            (evento: "inicio" | "avance" | "pausa" | "continuar" | "reinicio" | "fin").
  function crearRecorrido(opciones) {
    var op = opciones || {};
    var total = Math.max(0, op.total | 0);
    var irA = op.irA || nada;
    var alCambiar = op.alCambiar || nada;
    var intervalo = op.intervalo == null ? 8000 : op.intervalo;
    // Se resuelven al llamar, no al crear: así sirven también los temporizadores simulados
    var programar = op.programar || function (fn, ms) { return setTimeout(fn, ms); };
    var cancelar = op.cancelar || function (id) { clearTimeout(id); };

    var fase = "inactivo";
    var motivo = null;
    var temporizador = null; // nunca hay más de uno pendiente
    var posicion = typeof op.actual === "number" ? acotar(op.actual) : 0;

    function acotar(i) {
      i = Number(i);
      if (!isFinite(i)) return 0;
      return Math.min(Math.max(0, Math.round(i)), Math.max(0, total - 1));
    }
    function leerActual() {
      return typeof op.actual === "function" ? acotar(op.actual()) : posicion;
    }
    function estado() {
      // Fuera de la reproducción manda lo que se ve: el usuario pudo elegir otra a mano
      return { fase: fase, posicion: fase === "reproduciendo" ? posicion : leerActual(), total: total, motivo: motivo };
    }
    function avisar(evento) { alCambiar(estado(), evento); }

    function cancelarPendiente() {
      if (temporizador === null) return;
      cancelar(temporizador);
      temporizador = null;
    }
    function reproducirDesde(i, evento, mover) {
      cancelarPendiente();
      posicion = acotar(i);
      motivo = null;
      if (mover) irA(posicion);
      if (posicion >= total - 1) { fase = "terminado"; avisar("fin"); return; }
      fase = "reproduciendo";
      temporizador = programar(avanzar, intervalo);
      avisar(evento);
    }
    function avanzar() {
      temporizador = null;
      if (fase !== "reproduciendo") return;
      posicion = acotar(posicion + 1);
      irA(posicion);
      // Sin bucle: en la última se detiene
      if (posicion >= total - 1) { fase = "terminado"; avisar("fin"); return; }
      temporizador = programar(avanzar, intervalo);
      avisar("avance");
    }

    // Parte desde la experiencia visible. Si ya está en la última, vuelve a la primera
    // (empezar y terminar en el mismo instante no le serviría a nadie).
    function iniciar() {
      if (fase === "reproduciendo") return;
      var i = leerActual();
      if (total > 1 && i >= total - 1) reproducirDesde(0, "inicio", true);
      else reproducirDesde(i, "inicio", false);
    }
    function pausar(porQue) {
      if (fase !== "reproduciendo") return;
      cancelarPendiente();
      fase = "pausado";
      motivo = porQue || null;
      avisar("pausa");
    }
    // Sigue desde la posición visible, con el intervalo completo por delante:
    // quien pausó para mirar otra cosa necesita de nuevo el tiempo de lectura entero.
    function continuar() {
      if (fase !== "pausado") return;
      reproducirDesde(leerActual(), "continuar", false);
    }
    function reiniciar() { reproducirDesde(0, "reinicio", true); }
    function alternar() {
      if (fase === "reproduciendo") pausar("boton");
      else if (fase === "pausado") continuar();
      else if (fase === "terminado") reiniciar();
      else iniciar();
    }

    return { iniciar: iniciar, pausar: pausar, continuar: continuar, reiniciar: reiniciar, alternar: alternar, estado: estado };
  }

  /* ---------- 2) Interfaz ---------- */
  var ICONOS = {
    reproducir: "M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z",
    pausar: "M7 5h3.5v14H7zM13.5 5H17v14h-3.5z",
    reiniciar: "M12 5a7 7 0 1 1-6.71 5H3.2A9 9 0 1 0 12 3V.5L7.5 4 12 7.5z"
  };
  var TECLAS_NAVEGACION = { ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1, Home: 1, End: 1, PageUp: 1, PageDown: 1, " ": 1, Spacebar: 1 };

  function montar(contenedor) {
    var doc = global.document;
    if (!doc) return null;
    var raiz = doc.documentElement;
    var cont = contenedor || doc.getElementById("recorrido");
    if (!cont || cont.dataset.recorridoListo) return null;
    var seccion = cont.closest(".vista") || doc.getElementById("trayectoria");
    var lista = seccion && seccion.querySelector('.hitos[role="tablist"]');
    if (!lista) return null;
    var tabs = Array.prototype.slice.call(lista.querySelectorAll('.hito[role="tab"]'));
    if (tabs.length < 2) return null;
    cont.dataset.recorridoListo = "si";

    var INTERVALO = 8000;
    var SVG = "http://www.w3.org/2000/svg";

    // Marcado: botón + estado + barra fina
    var boton = doc.createElement("button");
    boton.type = "button";
    boton.className = "btn btn--chico btn--fantasma recorrido__btn";
    var icono = doc.createElementNS(SVG, "svg");
    icono.setAttribute("viewBox", "0 0 24 24");
    icono.setAttribute("width", "14");
    icono.setAttribute("height", "14");
    icono.setAttribute("fill", "currentColor");
    icono.setAttribute("aria-hidden", "true");
    icono.setAttribute("focusable", "false");
    var trazo = doc.createElementNS(SVG, "path");
    icono.appendChild(trazo);
    var etiqueta = doc.createElement("span");
    etiqueta.className = "recorrido__etiqueta";
    boton.appendChild(icono);
    boton.appendChild(etiqueta);

    var textoEstado = doc.createElement("span");
    textoEstado.className = "recorrido__estado";
    textoEstado.setAttribute("role", "status");
    textoEstado.setAttribute("aria-live", "polite");

    var barra = doc.createElement("span");
    barra.className = "recorrido__barra";
    barra.setAttribute("aria-hidden", "true");
    var relleno = doc.createElement("span");
    relleno.className = "recorrido__relleno";
    relleno.style.setProperty("--recorrido-ms", INTERVALO + "ms");
    barra.appendChild(relleno);

    cont.setAttribute("role", "group");
    cont.textContent = "";
    cont.appendChild(boton);
    cont.appendChild(textoEstado);
    cont.appendChild(barra);

    function ingles() { return raiz.dataset.idioma === "en"; }
    function movimientoCompleto() { return raiz.dataset.motion === "completo"; }
    function indiceActual() {
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].getAttribute("aria-selected") === "true") return i;
      }
      return 0;
    }

    // Lleva la pestaña activa al centro de .hitos (en móvil es una fila que se desplaza).
    // Solo mueve el contenedor de pestañas: nunca la página ni el foco.
    function llevarALaVista(tab) {
      var sobraX = lista.scrollWidth - lista.clientWidth;
      var sobraY = lista.scrollHeight - lista.clientHeight;
      if (sobraX <= 1 && sobraY <= 1) return;
      var rl = lista.getBoundingClientRect();
      var rt = tab.getBoundingClientRect();
      var x = sobraX > 1 ? Math.min(Math.max(0, lista.scrollLeft + (rt.left - rl.left) - (lista.clientWidth - rt.width) / 2), sobraX) : lista.scrollLeft;
      var y = sobraY > 1 ? Math.min(Math.max(0, lista.scrollTop + (rt.top - rl.top) - (lista.clientHeight - rt.height) / 2), sobraY) : lista.scrollTop;
      if (movimientoCompleto() && typeof lista.scrollTo === "function") {
        try { lista.scrollTo({ left: x, top: y, behavior: "smooth" }); return; } catch (e) {}
      }
      lista.scrollLeft = x;
      lista.scrollTop = y;
    }

    var avanzando = false; // true solo mientras el recorrido hace su propio clic

    function pintar() {
      var e = recorrido.estado();
      var en = ingles();
      var n = indiceActual() + 1;
      var total = tabs.length;
      var textoBoton, d, texto;

      if (e.fase === "reproduciendo") {
        textoBoton = en ? "Pause" : "Pausar"; d = ICONOS.pausar;
      } else if (e.fase === "pausado") {
        textoBoton = en ? "Resume" : "Continuar"; d = ICONOS.reproducir;
      } else if (e.fase === "terminado") {
        textoBoton = en ? "Restart" : "Reiniciar"; d = ICONOS.reiniciar;
      } else {
        textoBoton = en ? "Start tour" : "Iniciar recorrido"; d = ICONOS.reproducir;
      }

      if (e.fase === "inactivo") texto = "";
      else {
        texto = en ? "Experience " + n + " of " + total : "Experiencia " + n + " de " + total;
        if (e.fase === "pausado") texto += en ? " · paused" : " · en pausa";
        if (e.fase === "terminado") texto += en ? " · tour finished" : " · recorrido terminado";
      }

      cont.dataset.fase = e.fase;
      cont.setAttribute("aria-label", en ? "Automatic tour of the experiences" : "Recorrido automático por las experiencias");
      if (etiqueta.textContent !== textoBoton) etiqueta.textContent = textoBoton;
      if (trazo.getAttribute("d") !== d) trazo.setAttribute("d", d);
      // Solo se toca el texto si cambió: así el lector de pantalla no lo repite
      if (textoEstado.textContent !== texto) textoEstado.textContent = texto;
      // Con movimiento reducido la barra avanza por pasos (lo usa el CSS)
      relleno.style.setProperty("--recorrido-paso", String(n / total));
    }

    var recorrido = crearRecorrido({
      total: tabs.length,
      actual: indiceActual,
      intervalo: INTERVALO,
      irA: function (i) {
        avanzando = true;
        try { tabs[i].click(); } finally { avanzando = false; } // click() cambia el panel sin mover el foco
      },
      alCambiar: function (estado, evento) {
        if (evento !== "pausa") {
          // Alternar entre dos animaciones iguales reinicia la barra sin forzar un reflujo
          if (evento !== "fin") cont.dataset.ciclo = cont.dataset.ciclo === "a" ? "b" : "a";
          llevarALaVista(tabs[estado.posicion]);
        }
        pintar();
      }
    });

    function reproduciendo() { return recorrido.estado().fase === "reproduciendo"; }
    function pausarPor(motivo) { if (reproduciendo()) recorrido.pausar(motivo); }
    function esPropio(e) { return e.target && e.target.nodeType === 1 && cont.contains(e.target); }

    boton.addEventListener("click", function () { recorrido.alternar(); });

    // El usuario elige una experiencia a mano
    lista.addEventListener("click", function () { if (!avanzando) pausarPor("eleccion"); });

    // El usuario se desplaza o navega: rueda, gesto táctil o teclado.
    // Los gestos y teclas sobre el propio control no cuentan (si no, tocar «Pausar» lo reanudaría).
    doc.addEventListener("wheel", function () { pausarPor("rueda"); }, { passive: true });
    doc.addEventListener("touchmove", function (e) { if (!esPropio(e)) pausarPor("gesto"); }, { passive: true });
    // En captura: las pestañas detienen la propagación de sus flechas
    doc.addEventListener("keydown", function (e) {
      if (TECLAS_NAVEGACION[e.key] && !esPropio(e)) pausarPor("teclado");
    }, true);
    doc.addEventListener("visibilitychange", function () { if (doc.hidden) pausarPor("oculta"); });

    // Un solo observador para todo lo que cambia fuera de este script
    if (typeof global.MutationObserver === "function") {
      var observador = new global.MutationObserver(function (cambios) {
        var repintar = false;
        for (var i = 0; i < cambios.length; i++) {
          var c = cambios[i];
          if (c.attributeName === "open") {
            if (c.target.nodeName === "DIALOG" && c.target.hasAttribute("open")) pausarPor("dialogo");
          } else if (c.attributeName === "class") {
            if (!seccion.classList.contains("activa")) pausarPor("vista");
          } else if (c.attributeName === "aria-selected") {
            // Respaldo: la selección cambió y no fue el recorrido (p. ej. flechas sobre las pestañas)
            if (reproduciendo() && indiceActual() !== recorrido.estado().posicion) recorrido.pausar("eleccion");
            repintar = true;
          } else {
            repintar = true; // idioma o movimiento
          }
        }
        if (repintar) pintar();
      });
      observador.observe(raiz, { attributes: true, attributeFilter: ["data-idioma", "data-motion"] });
      observador.observe(seccion, { attributes: true, attributeFilter: ["class"] });
      observador.observe(lista, { attributes: true, subtree: true, attributeFilter: ["aria-selected"] });
      observador.observe(doc.body, { attributes: true, subtree: true, attributeFilter: ["open"] });
    }

    pintar();
    return recorrido;
  }

  var api = { crearRecorrido: crearRecorrido, montar: montar };
  if (typeof module === "object" && module && module.exports) module.exports = api;
  if (typeof window !== "undefined") {
    window.Recorrido = api;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { api.instancia = montar(); });
    else api.instancia = montar();
  }
})(typeof window !== "undefined" ? window : globalThis);
