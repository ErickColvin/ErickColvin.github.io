/*
  Proyectos del portafolio, en español y en inglés.
  Para agregar uno nuevo, copia un bloque y ajusta los campos:
  - repo: repositorio público de la demo en github.com/ErickColvin (se usa para "Demo actualizada hace…", en vivo).
  - estado: "privado" (insignia "Código privado") o "sitio" (el código es el propio sitio publicado: insignia "Sitio publicado").
  - categorias: "fullstack", "ia", "web" (deben coincidir con los filtros del HTML).
  - lenguajes: bytes por lenguaje, tal como los entrega la API de GitHub (/repos/:dueño/:repo/languages).
  - commits: commits propios en los repositorios del proyecto (los mismos que cuenta scripts/actividad.mjs).
  - rol: qué hizo Erick en el proyecto (se muestra junto al período, en ambos idiomas).
  - captura: imagen alta de la demo en assets/proyectos/; en la ficha se recorre de arriba abajo.
  - caso: el caso de estudio (reto, decisiones y resultado). Solo cifras verificables en los repositorios.
  - en: los mismos textos en inglés.
*/
window.PROYECTOS = [
  {
    id: "tracelink",
    nombre: "TraceLink V2 · CH Market",
    repo: "tracelink-preview",
    inicio: "2026-08",
    periodo: "2025 – 2026",
    rol: "Arquitectura y desarrollo full-stack",
    estado: "privado",
    icono: "paquete",
    categorias: ["fullstack"],
    resumen: "Plataforma de comercio, inventario, pedidos y trazabilidad de Colvin Solutions, con API autoritativa, PostgreSQL y checkout real.",
    puntos: [
      "API Express 5 modular con PostgreSQL 18, Prisma y modelos separados por cliente (multi-tenant).",
      "Checkout con reserva de stock y pagos Mercado Pago (sandbox): webhooks firmados, reconciliación e idempotencia.",
      "Seguridad: Argon2id, sesiones revocables con cookie HttpOnly, CSRF, seis roles con permisos en servidor y rate limits.",
      "CI/CD con GitHub Actions, outbox de notificaciones, logs redactados y pruebas unitarias, de integración, seguridad y E2E."
    ],
    nota: "La demo usa los datos de prueba de la propia app: entra como cliente o como personal sin contraseña.",
    flujo: ["Storefront React", "API Express 5", "PostgreSQL 18", "Mercado Pago", "CI/CD y monitoreo"],
    caso: {
      reto: "Vender en línea sin perder el control del inventario: stock, pedidos y pagos debían coincidir siempre, aunque un pago llegara tarde o dos veces.",
      decisiones: [
        "El servidor manda: la API calcula precios y stock, y el checkout reserva el stock por 15 minutos.",
        "Pagos idempotentes: webhooks firmados, reconciliación periódica y un outbox para no perder ni repetir avisos.",
        "Seguridad desde el inicio: Argon2id, sesiones revocables, CSRF y seis roles validados en el servidor."
      ],
      cifras: [["282", "pruebas automatizadas"], ["5", "flujos de CI/CD"], ["6", "roles con permisos"]],
      resultado: "Lista para staging. Los pagos reales siguen desactivados hasta terminar la validación."
    },
    tecnologias: ["TypeScript", "React", "Vite", "Express 5", "PostgreSQL", "Prisma", "Zod", "GitHub Actions"],
    lenguajes: { TypeScript: 1895929, JavaScript: 35314, CSS: 2878, HTML: 592 },
    commits: 98,
    captura: "assets/proyectos/tracelink.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/tracelink-preview/" },
    en: {
      rol: "Architecture and full-stack development",
      resumen: "Commerce, inventory, orders and traceability platform for Colvin Solutions, with an authoritative API, PostgreSQL and a real checkout.",
      puntos: [
        "Modular Express 5 API on PostgreSQL 18 and Prisma, with per-tenant data models.",
        "Checkout with stock reservation and Mercado Pago payments (sandbox): signed webhooks, reconciliation and idempotency.",
        "Security: Argon2id, revocable HttpOnly cookie sessions, CSRF, six server-enforced roles and rate limits.",
        "CI/CD on GitHub Actions, notification outbox, redacted logs and unit, integration, security and E2E tests."
      ],
      nota: "The demo runs on the app's own test data: sign in as a customer or as staff, no password needed.",
      flujo: ["React storefront", "Express 5 API", "PostgreSQL 18", "Mercado Pago", "CI/CD and monitoring"],
      caso: {
        reto: "Sell online without losing control of inventory: stock, orders and payments must always match, even if a payment arrives late or twice.",
        decisiones: [
          "The server is the source of truth: the API computes prices and stock, and checkout holds stock for 15 minutes.",
          "Idempotent payments: signed webhooks, periodic reconciliation and an outbox so no notification is lost or repeated.",
          "Security from day one: Argon2id, revocable sessions, CSRF and six server-enforced roles."
        ],
        cifras: [["282", "automated tests"], ["5", "CI/CD workflows"], ["6", "permission roles"]],
        resultado: "Ready for staging. Live payments stay off until validation is complete."
      }
    }
  },
  {
    id: "finanzas",
    nombre: "Finanzas Personales",
    repo: "finanzas-preview",
    inicio: "2026-10",
    periodo: "2026",
    rol: "Diseño y desarrollo de punta a punta",
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
    nota: "La demo usa movimientos inventados: puedes filtrar, editar y exportar, y los cambios se borran al recargar.",
    flujo: ["Gmail (solo lectura)", "Parsers por banco", "IA local", "SQLite cifrada", "Telegram"],
    caso: {
      reto: "Saber en qué se va la plata sin anotar cada gasto a mano y sin entregarle los datos bancarios a una app de terceros.",
      decisiones: [
        "Todo corre en casa: Gmail en solo lectura, base SQLite cifrada e IA local con Ollama.",
        "No confiar en cualquier correo: valida SPF, DKIM y DMARC y solo abre remitentes de una lista blanca.",
        "Un parser por banco y la IA solo de respaldo; su resultado se valida (el monto tiene que aparecer en el correo)."
      ],
      cifras: [["503", "pruebas automatizadas"], ["10", "fases documentadas"], ["0", "datos en la nube"]],
      resultado: "Se instala con Docker en un equipo propio. Cada fase documenta sus decisiones y los errores que se corrigieron."
    },
    tecnologias: [".NET 10", "C#", "React", "TypeScript", "Ollama", "SQLite", "Docker"],
    lenguajes: { "C#": 1053213, TypeScript: 157997, PowerShell: 3877, Dockerfile: 1872, Shell: 1293, HTML: 371, CSS: 199 },
    commits: 18,
    captura: "assets/proyectos/finanzas.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/finanzas-preview/" },
    en: {
      rol: "End-to-end design and development",
      resumen: "Self-hosted app that turns bank notification emails into a dashboard. No financial data ever leaves the machine.",
      puntos: [
        "Reads Gmail read-only (OAuth) and checks SPF, DKIM and DMARC before trusting an email.",
        "A versioned parser per bank, with a local AI (Ollama) fallback and rule + LLM categorization.",
        "Flags recurring charges, memberships that raise their price and possible fraud.",
        "Telegram alerts with buttons to confirm or re-categorize each transaction."
      ],
      nota: "The demo uses made-up transactions (in Spanish): filter, edit and export freely; changes reset on reload.",
      flujo: ["Gmail (read-only)", "Per-bank parsers", "Local AI", "Encrypted SQLite", "Telegram"],
      caso: {
        reto: "Know where the money goes without logging every expense by hand and without handing bank data to a third-party app.",
        decisiones: [
          "Everything runs at home: read-only Gmail, an encrypted SQLite database and local AI with Ollama.",
          "Don't trust just any email: it checks SPF, DKIM and DMARC and only opens allow-listed senders.",
          "One parser per bank with AI only as a fallback, and its output is validated (the amount must appear in the email)."
        ],
        cifras: [["503", "automated tests"], ["10", "documented phases"], ["0", "data in the cloud"]],
        resultado: "Installs with Docker on your own machine. Every phase documents its decisions and the bugs that were fixed."
      }
    }
  },
  {
    id: "santa-marta",
    nombre: "Condominio Santa Marta",
    repo: "santa-marta-preview",
    inicio: "2026-10",
    periodo: "2026",
    rol: "Diseño y desarrollo del MVP",
    estado: "privado",
    icono: "edificio",
    categorias: ["fullstack"],
    resumen: "MVP para administrar un condominio de 306 casas, con perfiles de residente, administración, comité y portería.",
    puntos: [
      "Cobranza y pagos (simulados) con Mercado Pago, multas, convenios, asambleas con voto en línea y encomiendas.",
      "Verificación en dos pasos (TOTP) para la administración y permisos por perfil.",
      "Auditoría inalterable: registro encadenado por hash, con verificación de integridad y exportación a CSV.",
      "Modo demostración: las mismas reglas de negocio corren en el navegador, sin servidor."
    ],
    nota: "La demo usa datos ficticios y se puede cambiar de perfil desde la barra superior.",
    flujo: ["SPA con Vite", "API Express 5", "SQLite (node:sqlite)", "Auditoría con hash"],
    caso: {
      reto: "Administrar 306 casas implica cobros, multas, asambleas y portería, normalmente repartidos entre planillas y grupos de WhatsApp.",
      decisiones: [
        "Un perfil por rol (residente, administración, comité y portería): cada uno ve solo lo que necesita.",
        "Auditoría inalterable: cada cambio queda en un registro encadenado por hash que se puede verificar y exportar.",
        "Las reglas de negocio viven en un solo módulo que usan el servidor y la demo, así ambos se comportan igual."
      ],
      cifras: [["306", "casas modeladas"], ["4", "perfiles con permisos"], ["2FA", "para la administración"]],
      resultado: "MVP listo para mostrar a la comunidad. Los pagos con Mercado Pago todavía son simulados."
    },
    tecnologias: ["JavaScript", "Vite", "Express 5", "SQLite", "TOTP"],
    lenguajes: { JavaScript: 287248, CSS: 60545, HTML: 3781 },
    commits: 12,
    captura: "assets/proyectos/santa-marta.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/santa-marta-preview/" },
    en: {
      rol: "MVP design and development",
      resumen: "MVP to manage a 306-home gated community, with resident, management, committee and front-desk profiles.",
      puntos: [
        "Billing and (simulated) Mercado Pago payments, fines, payment plans, online voting at meetings and parcel tracking.",
        "Two-step verification (TOTP) for management and per-profile permissions.",
        "Tamper-proof audit trail: a hash-chained log with integrity checks and CSV export.",
        "Demo mode: the same business rules run in the browser, no server needed."
      ],
      nota: "The demo uses fictional data (in Spanish); switch profiles from the top bar.",
      flujo: ["Vite SPA", "Express 5 API", "SQLite (node:sqlite)", "Hash-chained audit"],
      caso: {
        reto: "Running 306 homes means billing, fines, meetings and a front desk, usually scattered across spreadsheets and WhatsApp groups.",
        decisiones: [
          "One profile per role (resident, management, committee, front desk): each one sees only what it needs.",
          "Tamper-proof audit: every change goes into a hash-chained log that can be verified and exported.",
          "Business rules live in a single module shared by the server and the demo, so both behave the same."
        ],
        cifras: [["306", "homes modeled"], ["4", "permission profiles"], ["2FA", "for management"]],
        resultado: "MVP ready to show the community. Mercado Pago payments are still simulated."
      }
    }
  },
  {
    id: "rayo",
    nombre: "Rayo · Sitio de venta",
    repo: "rayo-web",
    inicio: "2026-10",
    periodo: "2026",
    rol: "Diseño y desarrollo del sitio",
    estado: "sitio",
    icono: "rayo",
    categorias: ["web"],
    resumen: "Sitio de venta de Rayo, un optimizador de FPS para Windows, en su propio dominio: rayofps.cl.",
    puntos: [
      "Publicado en su propio dominio, rayofps.cl, con Netlify.",
      "Navegación por pantallas con barra inferior, como una app; las animaciones respetan «reducir movimiento».",
      "Cifras tomadas del repositorio del producto: 87 optimizaciones y configuraciones para 18 juegos.",
      "Compra en una ventana: Mercado Pago o transferencia, y la licencia llega por un ticket de Discord."
    ],
    flujo: ["Repo del producto", "Sitio por pantallas", "Descarga gratis", "Mercado Pago o transferencia", "Licencia por Discord"],
    caso: {
      reto: "El creador de Rayo necesitaba explicar qué hace el optimizador y venderlo sin montar un servidor de pagos.",
      decisiones: [
        "Las cifras salen del repositorio del producto, no de un resumen: así la página no promete de más.",
        "Compra sin backend: links de pago de Mercado Pago o transferencia, y una planilla de Google Sheets (Apps Script) que registra los pedidos.",
        "Contra el spam: tokens HMAC de un solo uso, tiempo mínimo de llenado y límite de intentos."
      ],
      cifras: [["87", "optimizaciones explicadas"], ["18", "juegos con configuración"], ["0", "servidores que mantener"]],
      resultado: "En línea en rayofps.cl, con planes Pro y Elite de pago único. Las licencias se entregan a mano por un ticket de Discord."
    },
    tecnologias: ["HTML", "CSS", "JavaScript", "Apps Script", "Netlify"],
    lenguajes: { HTML: 55750, CSS: 51938, JavaScript: 33306 },
    commits: 19,
    captura: "assets/proyectos/rayo.jpg",
    enlaces: { demo: "https://rayofps.cl/" },
    en: {
      rol: "Site design and development",
      nombre: "Rayo · Sales site",
      resumen: "Sales site for Rayo, an FPS optimizer for Windows, on its own domain: rayofps.cl.",
      puntos: [
        "Live on its own domain, rayofps.cl, hosted on Netlify.",
        "Screen-by-screen navigation with a bottom bar, like an app; animations respect “reduce motion”.",
        "Figures pulled from the product's repository: 87 optimizations and configs for 18 games.",
        "Checkout in one window: Mercado Pago or bank transfer, and the license arrives through a Discord ticket."
      ],
      flujo: ["Product repo", "Screen-based site", "Free download", "Mercado Pago or transfer", "License via Discord"],
      caso: {
        reto: "Rayo's creator needed to explain what the optimizer does and sell it without running a payment server.",
        decisiones: [
          "Figures come from the product's repository, not from a summary, so the page never over-promises.",
          "No backend: Mercado Pago payment links or bank transfer, plus a Google Sheets log (Apps Script) that records orders.",
          "Against spam: single-use HMAC tokens, a minimum fill time and rate limits."
        ],
        cifras: [["87", "optimizations explained"], ["18", "game configs"], ["0", "servers to maintain"]],
        resultado: "Live at rayofps.cl, with one-time Pro and Elite plans. License keys are delivered by hand through a Discord ticket."
      }
    }
  }
];
