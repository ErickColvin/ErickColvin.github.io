// Regenera js/actividad.js: commits propios por día en los repositorios de los proyectos.
// Requiere GitHub CLI con sesión iniciada (gh auth login). Uso, desde la carpeta del portafolio:
//   node scripts/actividad.mjs
// Solo se publican fechas y cantidades; nada del contenido de los repositorios privados.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const DUENO = "ErickColvin";
// Solo los proyectos del portafolio; las demos generadas (tracelink-preview, finanzas-preview) no cuentan
const REPOS = [
  "TraceLink",
  "finanzas-personales", "finanzas-personales-demo",
  "condominio-santa-marta", "santa-marta-preview",
  "rayo-web"
];
// Commits de equipos o de equipos sin cuenta vinculada: se reconocen por login o por nombre de autor
const MIOS = { logins: ["ErickColvin"], nombres: ["Erick Colvin", "ErickColvin"] };
const ZONA = "America/Santiago";

const gh = (ruta, jq) => execFileSync("gh", ["api", "--paginate", ruta, "--jq", jq], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
  .split("\n").filter(Boolean);
const diaLocal = new Intl.DateTimeFormat("en-CA", { timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit" });

const vistos = new Set();
const dias = {};
for (const repo of REPOS) {
  const ramas = gh(`repos/${DUENO}/${repo}/branches?per_page=100`, ".[].name");
  for (const rama of ramas) {
    const filas = gh(`repos/${DUENO}/${repo}/commits?sha=${encodeURIComponent(rama)}&per_page=100`,
      '.[] | [.sha, .commit.author.date, (.author.login // ""), .commit.author.name] | @tsv');
    for (const fila of filas) {
      const [sha, fecha, login, nombre] = fila.split("\t");
      if (vistos.has(sha)) continue;
      vistos.add(sha);
      if (!MIOS.logins.includes(login) && !MIOS.nombres.includes(nombre)) continue;
      const dia = diaLocal.format(new Date(fecha));
      dias[dia] = (dias[dia] || 0) + 1;
    }
  }
  console.log(repo.padEnd(26), ramas.length, "ramas");
}

const ordenados = Object.fromEntries(Object.keys(dias).sort().map((d) => [d, dias[d]]));
const hoy = diaLocal.format(new Date());
const total = Object.values(dias).reduce((a, b) => a + b, 0);
writeFileSync("js/actividad.js",
  "/* Generado por scripts/actividad.mjs: commits propios por día en los repositorios de los proyectos. No editar a mano. */\n" +
  "window.ACTIVIDAD = " + JSON.stringify({ generado: hoy, dias: ordenados }) + ";\n");
console.log(`js/actividad.js: ${total} commits en ${Object.keys(dias).length} días (al ${hoy})`);
