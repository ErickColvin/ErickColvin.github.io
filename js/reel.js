/*
  Reel: video breve de demostración de un proyecto, con portada.
  El video no se descarga hasta que la persona pulsa reproducir; si falla, queda la portada con un aviso.

  Dato por proyecto, en js/proyectos.js (solo cuando el video exista de verdad):
    video: {
      src: "assets/videos/tracelink.mp4",      // obligatorio (MP4 H.264)
      poster: "assets/videos/tracelink.jpg",   // obligatorio
      formato: "16:9",                         // "9:16" | "16:9" | "4:3" (por defecto 16:9)
      duracion: "0:38",                        // opcional
      webm: "assets/videos/tracelink.webm",    // opcional, se ofrece antes que el MP4
      subtitulos: "assets/videos/tracelink.es.vtt"  // opcional; también { es: "…", en: "…" }
    }

  Uso:
    if (Reel.tiene(p)) html = Reel.html(p);   // "" si el proyecto no tiene video
    Reel.montar(contenedor);                  // tras pintar; se puede llamar las veces que haga falta
    Reel.detener(contenedor);                 // al cerrar la ventana o cambiar de proyecto
*/
(function () {
  "use strict";

  var FORMATOS = { "9:16": "9x16", "16:9": "16x9", "4:3": "4x3" };
  var TIPOS = { mp4: "video/mp4", m4v: "video/mp4", webm: "video/webm" };
  var TEXTOS = {
    es: {
      reproducir: "Ver video",
      repetir: "Ver de nuevo",
      de: "de",
      duracion: "duración",
      portada: "Portada del video de demostración de",
      video: "Video de demostración de",
      subtitulos: "Subtítulos",
      fallo: "No se pudo cargar el video. Se muestra la portada."
    },
    en: {
      reproducir: "Watch video",
      repetir: "Watch again",
      de: "of",
      duracion: "duration",
      portada: "Cover of the demo video for",
      video: "Demo video of",
      subtitulos: "Subtitles",
      fallo: "The video could not be loaded. Showing the cover instead."
    }
  };
  var ICONO_PLAY = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>';
  var ICONO_REPETIR = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Estado por reproductor ({ video, reloj }) y contenedores ya conectados
  var estados = new WeakMap();
  var montados = new WeakMap();

  function idioma() { return document.documentElement.dataset.idioma === "en" ? "en" : "es"; }
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function mezclar(extra) {
    var base = TEXTOS[idioma()], t = {}, k;
    for (k in base) t[k] = base[k];
    if (extra) for (k in extra) if (typeof extra[k] === "string" && extra[k]) t[k] = extra[k];
    return t;
  }
  // Textos del reproductor en el idioma actual, más los propios que se pasaron a html()
  function textosDe(reel) {
    var extra = null;
    try { extra = reel.dataset.textos ? JSON.parse(reel.dataset.textos) : null; } catch (e) {}
    return mezclar(extra);
  }
  function nombreDe(p) {
    return idioma() === "en" && p.en && p.en.nombre ? p.en.nombre : (p.nombre || "");
  }
  function tipoDe(ruta) {
    var ext = (String(ruta).split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i) || [])[1];
    return ext ? TIPOS[ext.toLowerCase()] || "" : "";
  }
  function reelsDe(contenedor) {
    var raiz = contenedor || document;
    var lista = Array.prototype.slice.call(raiz.querySelectorAll("[data-reel]"));
    if (raiz.matches && raiz.matches("[data-reel]")) lista.unshift(raiz);
    return lista;
  }

  function tiene(p) {
    return !!(p && p.video && typeof p.video.src === "string" && p.video.src &&
      typeof p.video.poster === "string" && p.video.poster);
  }

  function html(p, textos) {
    if (!tiene(p)) return "";
    var v = p.video, t = mezclar(textos), nombre = nombreDe(p);
    var subs = "", subsIdioma = "";
    if (typeof v.subtitulos === "string") { subs = v.subtitulos; subsIdioma = "es"; }
    else if (v.subtitulos) {
      subsIdioma = v.subtitulos[idioma()] ? idioma() : (v.subtitulos.es ? "es" : "en");
      subs = v.subtitulos[subsIdioma] || "";
    }
    var datos = ' data-src="' + escapar(v.src) + '"' +
      (v.webm ? ' data-webm="' + escapar(v.webm) + '"' : "") +
      (subs ? ' data-subtitulos="' + escapar(subs) + '" data-subtitulos-idioma="' + subsIdioma + '"' : "") +
      (textos ? ' data-textos="' + escapar(JSON.stringify(textos)) + '"' : "") +
      ' data-nombre="' + escapar(nombre) + '"';
    var oculto = " " + t.de + " " + escapar(nombre) + (v.duracion ? ", " + t.duracion + " " + escapar(v.duracion) : "");
    return '<div class="reel reel--' + (FORMATOS[v.formato] || "16x9") + '" data-reel data-estado="portada"' + datos + ">" +
      '<div class="reel__marco">' +
        '<img class="reel__portada" src="' + escapar(v.poster) + '" alt="' + escapar(t.portada + " " + nombre) + '" loading="lazy" decoding="async">' +
        '<button type="button" class="reel__play">' +
          '<span class="reel__pastilla"><span class="reel__icono">' + ICONO_PLAY + "</span>" +
          '<span class="reel__rotulo">' + escapar(t.reproducir) + "</span></span>" +
          '<span class="reel__sr">' + oculto + "</span>" +
        "</button>" +
        (v.duracion ? '<span class="reel__duracion" aria-hidden="true">' + escapar(v.duracion) + "</span>" : "") +
      "</div>" +
      '<p class="reel__aviso" role="status" tabindex="-1"></p>' +
    "</div>";
  }

  // Quita el video y corta su descarga
  function liberar(reel) {
    var e = estados.get(reel);
    if (!e) return;
    estados.delete(reel);
    clearTimeout(e.reloj);
    var video = e.video;
    try {
      video.pause();
      while (video.firstChild) video.removeChild(video.firstChild);
      video.removeAttribute("src");
      video.load();
    } catch (err) {}
    if (video.parentNode) video.parentNode.removeChild(video);
  }

  function conFoco(reel) { return reel.contains(document.activeElement); }

  // Vuelve a la portada. Con «repetir», el botón pasa a ofrecer «Ver de nuevo».
  function aPortada(reel, repetir) {
    var foco = conFoco(reel);
    liberar(reel);
    if (reel.dataset.estado === "fallo") return;
    var t = textosDe(reel), boton = reel.querySelector(".reel__play");
    reel.dataset.estado = repetir ? "fin" : "portada";
    if (!boton) return;
    boton.querySelector(".reel__rotulo").textContent = repetir ? t.repetir : t.reproducir;
    boton.querySelector(".reel__icono").innerHTML = repetir ? ICONO_REPETIR : ICONO_PLAY;
    if (foco && repetir) boton.focus();
  }

  // El video no cargó: queda la portada, sin botón, con un aviso breve
  function fallar(reel) {
    var foco = conFoco(reel);
    liberar(reel);
    reel.dataset.estado = "fallo";
    var boton = reel.querySelector(".reel__play"), duracion = reel.querySelector(".reel__duracion");
    var aviso = reel.querySelector(".reel__aviso");
    if (boton) boton.hidden = true;
    if (duracion) duracion.hidden = true;
    if (aviso) {
      aviso.textContent = textosDe(reel).fallo;
      if (foco) aviso.focus();
    }
  }

  function reproducir(reel, contenedor) {
    if (!reel || estados.has(reel) || reel.dataset.estado === "fallo" || !reel.dataset.src) return;
    // Un solo video a la vez dentro del mismo contenedor
    reelsDe(contenedor).forEach(function (otro) { if (otro !== reel && estados.has(otro)) aPortada(otro, false); });

    var t = textosDe(reel), marco = reel.querySelector(".reel__marco"), portada = reel.querySelector(".reel__portada");
    var video = document.createElement("video");
    video.className = "reel__video";
    video.controls = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.preload = "metadata";
    if (portada) video.poster = portada.currentSrc || portada.src;
    video.setAttribute("aria-label", t.video + " " + (reel.dataset.nombre || ""));

    var rutas = [];
    if (reel.dataset.webm) rutas.push(reel.dataset.webm);
    rutas.push(reel.dataset.src);
    var ultima;
    rutas.forEach(function (ruta) {
      ultima = document.createElement("source");
      var tipo = tipoDe(ruta);
      if (tipo) ultima.type = tipo;
      ultima.src = ruta;
      video.appendChild(ultima);
    });
    if (reel.dataset.subtitulos) {
      var pista = document.createElement("track");
      pista.kind = "subtitles";
      pista.src = reel.dataset.subtitulos;
      pista.srclang = reel.dataset.subtitulosIdioma || "es";
      pista.label = t.subtitulos;
      pista.default = true;
      video.appendChild(pista);
    }

    var estado = { video: video, reloj: 0 };
    function vigente() { return estados.get(reel) === estado; }
    function fallo() { if (vigente()) fallar(reel); }
    // Con varias fuentes el error llega a la última <source>; un error al decodificar llega al <video>
    ultima.addEventListener("error", fallo);
    video.addEventListener("error", fallo);
    video.addEventListener("loadedmetadata", function () { clearTimeout(estado.reloj); });
    video.addEventListener("ended", function () { if (vigente()) aPortada(reel, true); });
    estado.reloj = setTimeout(fallo, Reel.espera);

    estados.set(reel, estado);
    reel.dataset.estado = "video";
    marco.appendChild(video);
    video.focus({ preventScroll: true });
    var promesa = video.play();
    if (promesa && promesa.catch) {
      promesa.catch(function (err) {
        // Formato no admitido: se trata como fallo. Si el navegador solo bloqueó el inicio, quedan los controles nativos.
        if (err && err.name === "NotSupportedError") fallo();
      });
    }
  }

  function alPulsar(e) {
    var boton = e.target && e.target.closest ? e.target.closest(".reel__play") : null;
    if (!boton || !this.contains(boton)) return;
    reproducir(boton.closest("[data-reel]"), this);
  }

  // Un solo listener delegado por contenedor: sirve aunque su contenido se vuelva a pintar
  function montar(contenedor) {
    var raiz = contenedor || document;
    if (!montados.has(raiz)) {
      montados.set(raiz, true);
      raiz.addEventListener("click", alPulsar);
    }
    return reelsDe(raiz).length;
  }

  function detener(contenedor) {
    reelsDe(contenedor).forEach(function (reel) { if (estados.has(reel)) aPortada(reel, false); });
  }

  var Reel = {
    tiene: tiene,
    html: html,
    montar: montar,
    detener: detener,
    // Milisegundos que se espera a que el video entregue sus metadatos antes de volver a la portada
    espera: 12000
  };
  window.Reel = Reel;
})();
