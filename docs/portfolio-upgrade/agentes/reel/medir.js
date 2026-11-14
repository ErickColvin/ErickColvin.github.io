// Expresión para navegador.mjs (modo medir) sobre prueba.html. Devuelve un objeto con lo observado.
(async () => {
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const $ = (s) => document.querySelector(s);
  const videosPedidos = () => performance.getEntriesByType("resource").map((e) => e.name).filter((n) => /\.(mp4|webm)(\?|$)/.test(n)).map((n) => n.split("/").pop());
  const caja = (el) => { const r = el.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left) }; };
  const estado = (id) => {
    const reel = $(id + " [data-reel]"), b = reel.querySelector(".reel__play");
    return { estado: reel.dataset.estado, videos: reel.querySelectorAll("video").length, botonVisible: !!b && b.getClientRects().length > 0,
      rotulo: b.querySelector(".reel__rotulo").textContent, aviso: reel.querySelector(".reel__aviso").textContent, foco: document.activeElement.className || document.activeElement.tagName };
  };
  const r = { idioma: document.documentElement.dataset.idioma, motion: document.documentElement.dataset.motion };

  // Al cargar: sin <video> y sin peticiones de video
  r.alCargar = { videosEnDom: document.querySelectorAll("video").length, videosPedidos: videosPedidos(), casoA: $("#caso-a").innerHTML, resA: $("#res-a").textContent };

  // Portada y botón del caso B
  const bB = $("#caso-b .reel__play");
  r.botonB = { etiqueta: bB.tagName + "[type=" + bB.type + "]", nombre: bB.textContent.replace(/\s+/g, " ").trim(), caja: caja(bB), pastilla: caja(bB.querySelector(".reel__pastilla")),
    alt: $("#caso-b .reel__portada").alt, duracion: $("#caso-b .reel__duracion").textContent,
    transicion: getComputedStyle(bB.querySelector(".reel__pastilla")).transitionDuration };
  r.marcoB = caja($("#caso-b .reel__marco"));
  r.marcoC = { marco: caja($("#caso-c .reel__marco")), reel: caja($("#caso-c .reel")), altoVentana: innerHeight };
  r.marcoD = caja($("#caso-d .reel__marco"));
  const altoAntes = $("#caso-b .reel").getBoundingClientRect().height;

  // B: src inexistente
  bB.focus(); bB.click();
  r.trasPulsarB = { videos: $("#caso-b").querySelectorAll("video").length, preload: ($("#caso-b video") || {}).preload, controles: ($("#caso-b video") || {}).controls, playsinline: $("#caso-b video") ? $("#caso-b video").hasAttribute("playsinline") : null, autoplay: ($("#caso-b video") || {}).autoplay };
  await espera(1500);
  r.falloB = estado("#caso-b");
  r.falloB.saltoDeAlto = Math.round($("#caso-b .reel__marco").getBoundingClientRect().height - r.marcoB.h);

  // C: webm + mp4 inexistentes
  $("#caso-c .reel__play").click();
  await espera(1500);
  r.falloC = estado("#caso-c");

  // D: servidor que no responde (espera de 1,5 s)
  const t0 = performance.now();
  $("#caso-d .reel__play").click();
  await espera(400);
  r.duranteD = { estado: $("#caso-d [data-reel]").dataset.estado, videos: $("#caso-d").querySelectorAll("video").length };
  await espera(1800);
  r.falloD = estado("#caso-d");
  r.videosPedidosAlFinal = videosPedidos();

  // E: video real en memoria
  try {
    await window.generarVideoDePrueba();
    Reel.espera = 12000;
    let clics = 0;
    $("main").addEventListener("click", () => clics++);
    const bE = $("#caso-e .reel__play");
    bE.focus(); bE.click();
    r.clicsContados = clics;
    r.videosTrasUnClic = $("#caso-e").querySelectorAll("video").length;
    await espera(600);
    const v = $("#caso-e video");
    r.reproduciendoE = v ? { estado: $("#caso-e [data-reel]").dataset.estado, pausado: v.paused, listo: v.readyState, tiempo: +v.currentTime.toFixed(2), ajuste: getComputedStyle(v).objectFit } : "sin video";
    // detener a mitad de reproducción
    Reel.detener($("main"));
    r.trasDetenerE = estado("#caso-e");
    // reproducir hasta el final
    $("#caso-e .reel__play").click();
    const v2 = $("#caso-e video");
    if (v2 && v2.paused) { v2.muted = true; await v2.play().catch((e) => { r.errorPlay = e.name; }); }
    for (let i = 0; i < 40 && $("#caso-e [data-reel]").dataset.estado === "video"; i++) await espera(200);
    r.alTerminarE = estado("#caso-e");
    // «Ver de nuevo» vuelve a reproducir
    $("#caso-e .reel__play").click();
    await espera(300);
    r.verDeNuevoE = { estado: $("#caso-e [data-reel]").dataset.estado, videos: $("#caso-e").querySelectorAll("video").length };
    Reel.detener();
    r.videosAlFinal = document.querySelectorAll("video").length;
  } catch (e) { r.errorE = String(e); }
  return r;
})()
