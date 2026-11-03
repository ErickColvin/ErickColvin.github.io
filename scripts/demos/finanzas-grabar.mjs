// Graba las respuestas de la API de Finanzas en modo demostración para servirlas en una demo estática.
// Uso: node finanzas-grabar.mjs <salida.json> [api=http://localhost:5080]
// La API debe correr con Demo__Enabled=true y una base demo*.db (datos inventados).
import { writeFileSync } from "node:fs";

const [salida, API = "http://localhost:5080"] = process.argv.slice(2);
if (!salida) { console.error("Uso: node finanzas-grabar.mjs <salida.json> [api]"); process.exit(1); }

async function leer(ruta) {
  const r = await fetch(API + ruta, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`${ruta} → ${r.status}`);
  return r.status === 204 ? null : r.json();
}

const respuestas = {};
for (const ruta of ["/api/auth/me", "/api/info", "/api/status", "/api/categories", "/api/accounts", "/api/rules", "/api/ai",
  "/api/telegram", "/api/alerts", "/api/merchant-aliases", "/api/cost-shares"]) {
  respuestas[ruta] = await leer(ruta);
}

// Todos los movimientos (la API entrega como máximo 200 por página)
const movimientos = [];
for (let pagina = 1; ; pagina++) {
  const p = await leer(`/api/movements?status=all&sort=date_desc&page=${pagina}&pageSize=200`);
  movimientos.push(...p.items);
  if (movimientos.length >= p.total || !p.items.length) break;
}

const detalles = {};
for (const m of movimientos) detalles[m.id] = await leer(`/api/movements/${m.id}`);

// Resumen y presupuestos de cada mes con datos
const meses = [...new Set(movimientos.map((m) => m.occurredAt.slice(0, 7)))].sort();
const resumenes = {}, presupuestos = {};
for (const mes of meses) {
  resumenes[mes] = await leer(`/api/dashboard?month=${mes}`);
  presupuestos[mes] = await leer(`/api/budgets?month=${mes}`);
}

const fecha = movimientos.map((m) => m.occurredAt).sort().at(-1);
writeFileSync(salida, JSON.stringify({ grabado: new Date().toISOString(), ultimoMovimiento: fecha, meses, respuestas, movimientos, detalles, resumenes, presupuestos }));
console.log(`${movimientos.length} movimientos, ${meses.length} meses (${meses[0]} a ${meses.at(-1)}) → ${salida}`);
