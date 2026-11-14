// Movimiento reducido + inglés + contacto: el recorrido conserva controles e intervalo sin desplazamiento animado;
// la ventana abre sin animación; los enlaces de contacto apuntan donde deben; la hora usa America/Santiago.
(async () => {
  const z = (ms) => new Promise((r) => setTimeout(r, ms));
  const r = { motion: document.documentElement.dataset.motion, idioma: document.documentElement.dataset.idioma };
  location.hash = "trayectoria"; await z(800);
  const b = document.querySelector("#recorrido button");
  r.boton = b.textContent.trim();
  b.click(); await z(300);
  r.trasIniciar = b.textContent.trim();
  const barra = document.querySelector(".recorrido__barra, #recorrido [class*=barra]");
  r.barraAnimacion = barra ? getComputedStyle(barra.firstElementChild || barra).animationName + " " + getComputedStyle(barra.firstElementChild || barra).animationDuration : "sin barra";
  await z(8400);
  r.avanzoA = [...document.querySelectorAll(".hitos [role=tab]")].findIndex((t) => t.getAttribute("aria-selected") === "true") + 1;
  r.estado = (document.querySelector("#recorrido [role=status]") || {}).textContent;
  b.click();
  location.hash = "proyectos"; await z(800);
  document.querySelector("[data-ampliar]").click(); await z(150);
  const caja = document.querySelector(".ventana__caja");
  r.ventanaAnimacion = getComputedStyle(caja).animationName + " " + getComputedStyle(caja).animationDuration;
  r.cerrarNombre = document.getElementById("ventana-cerrar").getAttribute("aria-label");
  document.getElementById("ventana-proyecto").close();
  location.hash = "contacto"; await z(800);
  r.contacto = [...document.querySelectorAll("#contacto a")].map((a) => a.textContent.trim().replace(/\s+/g, " ").slice(0, 28) + " → " + a.getAttribute("href"));
  const hora = document.getElementById("hora-local").textContent;
  const santiago = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/Santiago" }).format(new Date());
  r.hora = { mostrada: hora, santiago };
  r.botonesCopiar = [...document.querySelectorAll("#contacto button")].map((x) => x.textContent.trim());
  return r;
})()
