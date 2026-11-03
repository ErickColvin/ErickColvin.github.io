/*
  Proyectos del portafolio.
  Para agregar uno nuevo, copia un bloque y ajusta los campos:
  - repo: repositorio público de la demo en github.com/ErickColvin (se usa para "Demo actualizada hace…", en vivo).
  - estado: "privado" (el código no se enlaza) o "publico" (se muestra el botón "Código" si hay enlaces.codigo).
  - categorias: "fullstack", "ia", "web" (deben coincidir con los filtros del HTML).
  - lenguajes: bytes por lenguaje, tal como los entrega la API de GitHub (/repos/:dueño/:repo/languages).
  - commits: suma de los repositorios del proyecto.
  - captura (opcional, solo con demo): imagen alta de la página en assets/proyectos/; en la tarjeta se recorre de arriba abajo al pasar el cursor.
*/
window.PROYECTOS = [
  {
    id: "tracelink",
    nombre: "TraceLink V2 · CH Market",
    repo: "tracelink-preview",
    inicio: "2026-08",
    periodo: "2025 — 2026",
    estado: "privado",
    icono: "paquete",
    categorias: ["fullstack"],
    resumen: "Plataforma de comercio, inventario, pedidos y trazabilidad de Colvin Solutions, con API autoritativa, PostgreSQL y checkout real.",
    puntos: [
      "API Express 5 modular con PostgreSQL 18, Prisma y modelos separados por cliente (multi-tenant).",
      "Checkout con reserva de stock y pagos Mercado Pago (sandbox): webhooks firmados, reconciliación e idempotencia.",
      "Seguridad: Argon2id, sesiones revocables con cookie HttpOnly, CSRF, seis roles con permisos en servidor y rate limits.",
      "CI/CD con GitHub Actions, outbox de notificaciones, logs redactados y tests unitarios, de integración, seguridad y E2E."
    ],
    flujo: ["Storefront React", "API Express 5", "PostgreSQL 18", "Mercado Pago", "CI/CD y monitoreo"],
    tecnologias: ["TypeScript", "React", "Vite", "Express 5", "PostgreSQL", "Prisma", "Zod", "GitHub Actions"],
    lenguajes: { TypeScript: 1895929, JavaScript: 35314, CSS: 2878, HTML: 592 },
    commits: 98,
    captura: "assets/proyectos/tracelink.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/tracelink-preview/" }
  },
  {
    id: "finanzas",
    nombre: "Finanzas Personales",
    repo: "finanzas-preview",
    inicio: "2026-10",
    periodo: "2026",
    estado: "privado",
    icono: "billetera",
    categorias: ["fullstack", "ia"],
    resumen: "App auto-hospedada que convierte los avisos del banco en un dashboard. Ningún dato financiero sale del equipo.",
    puntos: [
      "Lee Gmail en solo lectura (OAuth) y valida SPF, DKIM y DMARC antes de confiar en un correo.",
      "Un parser versionado por banco, con IA local (Ollama) de respaldo y categorización por reglas + LLM.",
      "Detecta cobros recurrentes, membresías que suben de precio y posibles estafas.",
      "Avisos por Telegram con botones para confirmar o recategorizar cada movimiento."
    ],
    nota: "La demo usa movimientos inventados: ningún dato real.",
    flujo: ["Gmail (solo lectura)", "Parsers por banco", "IA local", "SQLite cifrada", "Telegram"],
    tecnologias: [".NET 10", "C#", "React", "TypeScript", "Ollama", "SQLite", "Docker"],
    lenguajes: { "C#": 1053213, TypeScript: 157997, PowerShell: 3877, Dockerfile: 1872, Shell: 1293, HTML: 371, CSS: 199 },
    commits: 18,
    captura: "assets/proyectos/finanzas.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/finanzas-preview/" }
  },
  {
    id: "santa-marta",
    nombre: "Condominio Santa Marta",
    repo: "santa-marta-preview",
    inicio: "2026-10",
    periodo: "2026",
    estado: "privado",
    icono: "edificio",
    categorias: ["fullstack"],
    resumen: "MVP para administrar un condominio de 306 casas, con perfiles de residente, administración y portería.",
    puntos: [
      "Cobranza y pagos (simulados) con Mercado Pago, multas, convenios, asambleas con voto en línea y encomiendas.",
      "Verificación en dos pasos (TOTP) para la administración y permisos por perfil.",
      "Auditoría inalterable: registro encadenado por hash, con verificación de integridad y exportación a CSV.",
      "Modo demostración: las mismas reglas de negocio corren en el navegador, sin servidor."
    ],
    flujo: ["SPA con Vite", "API Express 5", "SQLite (node:sqlite)", "Auditoría con hash"],
    tecnologias: ["JavaScript", "Vite", "Express 5", "SQLite", "TOTP"],
    lenguajes: { JavaScript: 287248, CSS: 60545, HTML: 3781 },
    commits: 12,
    captura: "assets/proyectos/santa-marta.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/santa-marta-preview/" }
  },
  {
    id: "rayo",
    nombre: "Rayo · Sitio de venta",
    repo: "rayo-web",
    inicio: "2026-10",
    periodo: "2026",
    estado: "privado",
    icono: "rayo",
    categorias: ["web"],
    resumen: "Landing de venta para Rayo, un optimizador de FPS para Windows.",
    puntos: [
      "Sitio estático, responsive y animado, publicado en GitHub Pages.",
      "Cifras tomadas del repositorio del producto: configuraciones de juegos y optimizaciones.",
      "Flujo de compra configurable desde un solo objeto: ticket por Discord o checkout directo."
    ],
    flujo: ["Repo del producto", "Landing estática", "Descarga directa", "Compra"],
    tecnologias: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
    lenguajes: { HTML: 61289, CSS: 45997, JavaScript: 13478 },
    commits: 6,
    captura: "assets/proyectos/rayo.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/rayo-web/" }
  }
];
