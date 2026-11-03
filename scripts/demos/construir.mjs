// Reconstruye una demo en vivo y, con --publicar, la sube a su repositorio de GitHub Pages.
// Uso, desde la carpeta del portafolio:
//   node scripts/demos/construir.mjs tracelink [--publicar]
//   node scripts/demos/construir.mjs finanzas [--publicar]
// Requiere git, GitHub CLI con sesión (los repositorios de código son privados), Node 24+ y npx.
// Trabaja en una carpeta temporal: no toca los repositorios originales ni deja nada en el portafolio.
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const DEMOS = {
  tracelink: {
    fuente: "ErickColvin/TraceLink",
    destino: "ErickColvin/tracelink-preview",
    base: "/tracelink-preview/",
    parche: "tracelink.patch",
    salida: "apps/web/dist",
    construir(dir, base) {
      // La app web ya trae servicios de prueba: basta con el modo mock y la subcarpeta de Pages
      npx(dir, ["-y", "pnpm@11.24.0", "install", "--frozen-lockfile", "--filter", "@tracelink/web..."]);
      npx(dir, ["-y", "pnpm@11.24.0", "--filter", "@tracelink/contracts", "build"]);
      npx(dir, ["-y", "pnpm@11.24.0", "--filter", "@tracelink/web", "exec", "vite", "build", "--base", base], { VITE_DATA_MODE: "mock" });
    }
  },
  finanzas: {
    fuente: "ErickColvin/finanzas-personales-demo",
    destino: "ErickColvin/finanzas-preview",
    base: "/finanzas-preview/",
    parche: "finanzas.patch",
    salida: "src/frontend/dist",
    construir(dir, base) {
      // La página responde la API desde los datos grabados (finanzas-grabar.mjs) con demo-estatica.js
      const web = join(dir, "src/frontend");
      cpSync(join(AQUI, "finanzas-demo-estatica.js"), join(web, "src/demo-estatica.js"));
      cpSync(join(AQUI, "finanzas-datos.json"), join(web, "src/datos-demo.json"));
      ejecutar("npm", ["ci", "--no-audit", "--no-fund"], web);
      npx(web, ["vite", "build", "--base", base]);
    }
  }
};

const [nombre, ...opciones] = process.argv.slice(2);
const demo = DEMOS[nombre];
if (!demo) {
  console.error("Uso: node scripts/demos/construir.mjs <" + Object.keys(DEMOS).join("|") + "> [--publicar]");
  process.exit(1);
}
const publicar = opciones.includes("--publicar");

function ejecutar(comando, args, cwd, env = {}) {
  console.log(`\n> ${comando} ${args.join(" ")}`);
  // En Windows npm y npx son .cmd y necesitan la shell (sus argumentos no llevan espacios); git y gh no
  const shell = process.platform === "win32" && (comando === "npm" || comando === "npx");
  const r = spawnSync(comando, args, { cwd, stdio: "inherit", shell, env: { ...process.env, ...env } });
  if (r.status !== 0) throw new Error(`Falló: ${comando} ${args.join(" ")}`);
}
function npx(cwd, args, env) { ejecutar("npx", args, cwd, env); }

const tmp = mkdtempSync(join(tmpdir(), `demo-${nombre}-`));
const fuente = join(tmp, "fuente");
const sitio = join(tmp, "sitio");
console.log(`Carpeta de trabajo: ${tmp}`);

// 1. Código fuente (privado) y los ajustes para servirlo desde una subcarpeta de GitHub Pages
ejecutar("gh", ["repo", "clone", demo.fuente, fuente, "--", "--depth", "1", "-c", "core.longpaths=true"], tmp);
ejecutar("git", ["-c", "core.longpaths=true", "apply", "--whitespace=nowarn", join(AQUI, demo.parche)], fuente);

// 2. Compilación
demo.construir(fuente, demo.base);

// 3. Sitio listo para Pages: sin archivos de Netlify/Cloudflare, con el botón de vuelta al portafolio y 404 para rutas internas
cpSync(join(fuente, demo.salida), sitio, { recursive: true });
for (const extra of ["_headers", "_redirects"]) rmSync(join(sitio, extra), { force: true });
const indice = join(sitio, "index.html");
const html = readFileSync(indice, "utf8").replace("</body>", readFileSync(join(AQUI, "insignia.html"), "utf8").trim() + "</body>");
writeFileSync(indice, html);
writeFileSync(join(sitio, "404.html"), html);
writeFileSync(join(sitio, ".nojekyll"), "");
console.log(`\nSitio listo en ${sitio}`);

// 4. Publicación: un commit nuevo encima del historial del repositorio de la demo
if (publicar) {
  const repo = join(tmp, "publicado");
  ejecutar("gh", ["repo", "clone", demo.destino, repo, "--", "--depth", "1"], tmp);
  for (const f of readdirSync(repo)) if (f !== ".git") rmSync(join(repo, f), { recursive: true, force: true });
  cpSync(sitio, repo, { recursive: true });
  ejecutar("git", ["add", "-A"], repo);
  const cambios = spawnSync("git", ["status", "--porcelain"], { cwd: repo, encoding: "utf8" }).stdout.trim();
  if (!cambios) {
    console.log("La demo publicada ya está al día: no hay nada que subir.");
  } else {
    ejecutar("git", ["commit", "-q", "-m", "Demo actualizada con scripts/demos/construir.mjs"], repo);
    ejecutar("git", ["push", "-q", "origin", "HEAD"], repo);
    console.log(`Publicada: https://erickcolvin.github.io${demo.base}`);
  }
}
if (existsSync(tmp) && publicar) rmSync(tmp, { recursive: true, force: true });
