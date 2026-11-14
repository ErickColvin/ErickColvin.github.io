// Prueba en navegador real (se ejecuta con navegador.mjs medir <url> @este-archivo <tamaño>).
// Recorrido: iniciar, avance a los 8 s, pausa, continuar, pausa por rueda y por tecla. Ventana: abrir, foco, cerrar, foco devuelto.
(async () => {
  const z = (ms) => new Promise((r) => setTimeout(r, ms));
  const r = { errores: [] };
  window.addEventListener("error", (e) => r.errores.push(e.message));
  const activa = () => [...document.querySelectorAll(".hitos [role=tab]")].findIndex((t) => t.getAttribute("aria-selected") === "true") + 1;
  const boton = () => document.querySelector("#recorrido button");
  const texto = () => boton().textContent.trim();
  const estado = () => (document.querySelector("#recorrido [role=status]") || {}).textContent || "";

  location.hash = "trayectoria"; await z(900);
  r.botonInicial = texto(); r.estadoInicial = estado(); r.activaInicial = activa();
  const focoAntes = document.activeElement && document.activeElement.tagName;

  boton().click(); await z(300);
  r.trasIniciar = { boton: texto(), activa: activa(), estado: estado() };
  await z(7300); r.alos7_6s = activa();          // todavía no avanza
  await z(900); r.alos8_5s = activa();           // ya avanzó una
  r.focoSeMovio = (document.activeElement && document.activeElement.tagName) !== focoAntes && document.activeElement !== boton();

  boton().click(); await z(200);                 // pausar
  r.pausado = { boton: texto(), activa: activa(), estado: estado() };
  await z(8600); r.sigueEnPausa = activa();

  boton().click(); await z(8500);                // continuar: avanza una más
  r.trasContinuar = { boton: texto(), activa: activa() };

  document.dispatchEvent(new WheelEvent("wheel", { bubbles: true, deltaY: 40 })); await z(200);
  r.trasRueda = texto();
  boton().click(); await z(200);
  document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown", bubbles: true })); await z(200);
  r.trasTecla = texto();

  // Elegir a mano la última y continuar: debe terminar sin bucle y ofrecer reiniciar
  const tabs = [...document.querySelectorAll(".hitos [role=tab]")];
  tabs[tabs.length - 1].click(); await z(300);
  boton().click(); await z(8700);
  r.enLaUltima = { boton: texto(), activa: activa(), estado: estado() };

  // Cambio de vista durante el recorrido
  tabs[0].click(); await z(200); boton().click(); await z(300);
  const corriendo = texto();
  location.hash = "proyectos"; await z(900);
  location.hash = "trayectoria"; await z(900);
  r.trasCambiarDeVista = { antes: corriendo, despues: texto() };

  // ---- Vista ampliada del proyecto
  location.hash = "proyectos"; await z(900);
  const ampliar = document.querySelector("[data-ampliar]");
  ampliar.focus(); ampliar.click(); await z(500);
  const v = document.getElementById("ventana-proyecto");
  const caja = v.querySelector(".ventana__caja").getBoundingClientRect();
  r.ventana = {
    abierta: v.open, titulo: v.querySelector("h2").textContent, focoDentro: v.contains(document.activeElement),
    ancho: Math.round(caja.width), alto: Math.round(caja.height), margen: Math.round(caja.left), cabeEnPantalla: caja.bottom <= innerHeight && caja.top >= 0,
    scrollInterno: getComputedStyle(v.querySelector(".ventana__cuerpo")).overflowY, anchoPagina: document.documentElement.scrollWidth,
    fondoInerte: !document.querySelector(".pestanas a").matches(":focus") && v.matches(":modal")
  };
  v.close(); await z(300);
  r.ventanaCerrada = { abierta: v.open, focoDevuelto: document.activeElement === ampliar, cuerpoVacio: !v.querySelector(".ventana__cuerpo").children.length };
  return r;
})()
