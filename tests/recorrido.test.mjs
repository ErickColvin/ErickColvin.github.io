// Pruebas de la lógica del recorrido automático (js/recorrido.js).
// Se ejecutan con: node --test tests/
import { test, mock, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { crearRecorrido } = require("../js/recorrido.js");

// Simula la vista: 5 experiencias y un índice visible que el usuario también puede cambiar
function preparar({ total = 5, desde = 0, ...resto } = {}) {
  const vista = { indice: desde };
  const visitas = [];
  const eventos = [];
  const recorrido = crearRecorrido({
    total,
    actual: () => vista.indice,
    irA: (i) => { vista.indice = i; visitas.push(i); },
    alCambiar: (estado, evento) => eventos.push(evento + ":" + estado.fase + ":" + estado.posicion),
    ...resto,
  });
  return { recorrido, vista, visitas, eventos };
}

// Un tic grande no encadena los temporizadores que se programan durante el propio tic:
// se avanza intervalo por intervalo, como pasaría en la página.
function pasar(intervalos, ms = 8000) {
  for (let i = 0; i < intervalos; i++) mock.timers.tick(ms);
}

beforeEach(() => mock.timers.enable({ apis: ["setTimeout"] }));
afterEach(() => mock.timers.reset());

test("no inicia solo", () => {
  const { recorrido, visitas, eventos } = preparar();
  mock.timers.tick(60000);
  assert.equal(recorrido.estado().fase, "inactivo");
  assert.deepEqual(visitas, []);
  assert.deepEqual(eventos, []);
});

test("avanza cada 8000 ms, ni antes ni dos veces", () => {
  const { recorrido, vista, visitas } = preparar();
  recorrido.iniciar();
  assert.equal(recorrido.estado().fase, "reproduciendo");
  mock.timers.tick(7999);
  assert.equal(vista.indice, 0);
  mock.timers.tick(1);
  assert.equal(vista.indice, 1);
  mock.timers.tick(7999);
  assert.equal(vista.indice, 1);
  mock.timers.tick(1);
  assert.equal(vista.indice, 2);
  assert.deepEqual(visitas, [1, 2]);
});

test("parte desde la experiencia actual", () => {
  const { recorrido, visitas } = preparar({ desde: 2 });
  recorrido.iniciar();
  assert.equal(recorrido.estado().posicion, 2);
  mock.timers.tick(8000);
  assert.deepEqual(visitas, [3]);
});

test("pausar cancela el avance pendiente", () => {
  const { recorrido, vista } = preparar();
  recorrido.iniciar();
  mock.timers.tick(7999);
  recorrido.pausar("prueba");
  assert.deepEqual(recorrido.estado(), { fase: "pausado", posicion: 0, total: 5, motivo: "prueba" });
  mock.timers.tick(60000);
  assert.equal(vista.indice, 0);
  assert.equal(recorrido.estado().fase, "pausado");
});

test("continuar sigue desde la posición actual con el intervalo completo", () => {
  const { recorrido, vista, visitas } = preparar();
  recorrido.iniciar();
  mock.timers.tick(8000); // está en 1
  recorrido.pausar();
  vista.indice = 3; // el usuario eligió otra a mano durante la pausa
  recorrido.continuar();
  assert.equal(recorrido.estado().fase, "reproduciendo");
  assert.equal(recorrido.estado().posicion, 3);
  mock.timers.tick(7999);
  assert.equal(vista.indice, 3);
  mock.timers.tick(1);
  assert.equal(vista.indice, 4);
  assert.deepEqual(visitas, [1, 4]);
});

test("continuar no hace nada si no estaba en pausa", () => {
  const { recorrido, visitas } = preparar();
  recorrido.continuar();
  mock.timers.tick(20000);
  assert.equal(recorrido.estado().fase, "inactivo");
  assert.deepEqual(visitas, []);
});

test("se detiene en la última, sin bucle", () => {
  const { recorrido, vista, visitas, eventos } = preparar();
  recorrido.iniciar();
  pasar(4);
  assert.equal(vista.indice, 4);
  assert.equal(recorrido.estado().fase, "terminado");
  pasar(10);
  assert.equal(vista.indice, 4);
  assert.deepEqual(visitas, [1, 2, 3, 4]);
  assert.equal(eventos.at(-1), "fin:terminado:4");
  assert.equal(eventos.filter((e) => e.startsWith("fin")).length, 1);
});

test("reiniciar vuelve a la primera y reproduce", () => {
  const { recorrido, vista, visitas } = preparar();
  recorrido.iniciar();
  pasar(4);
  recorrido.reiniciar();
  assert.equal(vista.indice, 0);
  assert.equal(recorrido.estado().fase, "reproduciendo");
  mock.timers.tick(8000);
  assert.equal(vista.indice, 1);
  assert.deepEqual(visitas, [1, 2, 3, 4, 0, 1]);
});

test("iniciar dos veces no deja temporizadores duplicados", () => {
  const programar = mock.fn((fn, ms) => setTimeout(fn, ms));
  const cancelar = mock.fn((id) => clearTimeout(id));
  const { recorrido, vista, visitas } = preparar({ programar, cancelar });
  recorrido.iniciar();
  recorrido.iniciar();
  assert.equal(programar.mock.callCount(), 1);
  assert.equal(cancelar.mock.callCount(), 0);
  mock.timers.tick(8000);
  assert.equal(vista.indice, 1); // avanzó una, no dos
  assert.deepEqual(visitas, [1]);
  // Reiniciar en plena reproducción cancela el pendiente antes de programar otro
  assert.equal(programar.mock.callCount(), 2); // el que se cumplió y el siguiente
  recorrido.reiniciar();
  assert.equal(cancelar.mock.callCount(), 1);
  assert.equal(programar.mock.callCount(), 3);
  mock.timers.tick(8000);
  assert.deepEqual(visitas, [1, 0, 1]);
});

test("nunca hay más de un temporizador pendiente", () => {
  let pendientes = 0;
  let maximo = 0;
  const programar = (fn, ms) => {
    pendientes++;
    maximo = Math.max(maximo, pendientes);
    return setTimeout(() => { pendientes--; fn(); }, ms);
  };
  const cancelar = (id) => { pendientes--; clearTimeout(id); };
  const { recorrido } = preparar({ programar, cancelar });
  recorrido.iniciar();
  recorrido.iniciar();
  mock.timers.tick(8000);
  recorrido.pausar();
  recorrido.pausar();
  recorrido.continuar();
  recorrido.continuar();
  recorrido.reiniciar();
  recorrido.alternar(); // pausa
  recorrido.alternar(); // continúa
  pasar(6);
  assert.equal(maximo, 1);
  assert.equal(pendientes, 0);
  assert.equal(recorrido.estado().fase, "terminado");
});

test("alternar recorre iniciar → pausar → continuar → reiniciar", () => {
  const { recorrido, vista } = preparar({ desde: 3 });
  recorrido.alternar();
  assert.equal(recorrido.estado().fase, "reproduciendo");
  recorrido.alternar();
  assert.equal(recorrido.estado().fase, "pausado");
  assert.equal(recorrido.estado().motivo, "boton");
  recorrido.alternar();
  assert.equal(recorrido.estado().fase, "reproduciendo");
  mock.timers.tick(8000);
  assert.equal(recorrido.estado().fase, "terminado");
  recorrido.alternar();
  assert.equal(vista.indice, 0);
  assert.equal(recorrido.estado().fase, "reproduciendo");
});

test("iniciar estando en la última vuelve a la primera", () => {
  const { recorrido, vista, visitas } = preparar({ desde: 4 });
  recorrido.iniciar();
  assert.equal(vista.indice, 0);
  assert.equal(recorrido.estado().fase, "reproduciendo");
  assert.deepEqual(visitas, [0]);
});

test("continuar en la última termina sin programar nada", () => {
  const { recorrido, vista, visitas } = preparar();
  recorrido.iniciar();
  recorrido.pausar();
  vista.indice = 4;
  recorrido.continuar();
  assert.equal(recorrido.estado().fase, "terminado");
  mock.timers.tick(60000);
  assert.deepEqual(visitas, []);
});

test("avisa solo los cambios, no cada tic", () => {
  const { recorrido, eventos } = preparar();
  recorrido.iniciar();
  mock.timers.tick(4000);
  mock.timers.tick(3999);
  assert.deepEqual(eventos, ["inicio:reproduciendo:0"]);
  mock.timers.tick(1);
  recorrido.pausar();
  recorrido.continuar();
  assert.deepEqual(eventos, [
    "inicio:reproduciendo:0", "avance:reproduciendo:1", "pausa:pausado:1", "continuar:reproduciendo:1",
  ]);
});

test("acepta otro intervalo", () => {
  const { recorrido, vista } = preparar({ intervalo: 500 });
  recorrido.iniciar();
  mock.timers.tick(499);
  assert.equal(vista.indice, 0);
  mock.timers.tick(1);
  assert.equal(vista.indice, 1);
});
