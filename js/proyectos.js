/*
  Proyectos del portafolio.
  Para agregar uno nuevo, copia un bloque y ajusta los campos:
  - repo: nombre del repositorio público en github.com/ErickColvin (se usa para la fecha de actualización en vivo).
  - estado: "publico", "privado" (código privado, se muestra igual si tiene demo) o "demo-publica".
  - categorias: "fullstack", "ia", "frontend", "web" (deben coincidir con los filtros del HTML).
  - lenguajes: bytes por lenguaje, tal como los entrega la API de GitHub (/repos/:dueño/:repo/languages).
  - commits: suma de los repositorios del proyecto.
  - captura (opcional, solo con demo): imagen alta de la página en assets/proyectos/; en la tarjeta se recorre de arriba abajo al pasar el cursor.
*/
window.PROYECTOS = [
  {
    id: "tracelink",
    nombre: "TraceLink V2 · CH Market",
    repo: "TraceLink",
    inicio: "2026-08",
    periodo: "2025 — 2026",
    estado: "publico",
    destacado: true,
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
    enlaces: { codigo: "https://github.com/ErickColvin/TraceLink" }
  },
  {
    id: "finanzas",
    nombre: "Finanzas Personales",
    repo: "finanzas-personales-demo",
    inicio: "2026-10",
    periodo: "2026",
    estado: "demo-publica",
    icono: "billetera",
    categorias: ["fullstack", "ia"],
    resumen: "App auto-hospedada que convierte los avisos del banco en un dashboard. Ningún dato financiero sale del equipo.",
    puntos: [
      "Lee Gmail en solo lectura (OAuth) y valida SPF, DKIM y DMARC antes de confiar en un correo.",
      "Un parser versionado por banco, con IA local (Ollama) de respaldo y categorización por reglas + LLM.",
      "Detecta cobros recurrentes, membresías que suben de precio y posibles estafas.",
      "Avisos por Telegram con botones para confirmar o recategorizar cada movimiento."
    ],
    nota: "Repositorio público con modo demostración y datos inventados.",
    flujo: ["Gmail (solo lectura)", "Parsers por banco", "IA local", "SQLite cifrada", "Telegram"],
    tecnologias: [".NET 10", "C#", "React", "TypeScript", "Ollama", "SQLite", "Docker"],
    lenguajes: { "C#": 1053213, TypeScript: 157997, PowerShell: 3877, Dockerfile: 1872, Shell: 1293, HTML: 371, CSS: 199 },
    commits: 16,
    enlaces: { codigo: "https://github.com/ErickColvin/finanzas-personales-demo" }
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
    estado: "publico",
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
    commits: 3,
    captura: "assets/proyectos/rayo.jpg",
    enlaces: { demo: "https://erickcolvin.github.io/rayo-web/", codigo: "https://github.com/ErickColvin/rayo-web" }
  },
  {
    id: "tesis",
    nombre: "My Digital Platform · Tesis",
    repo: "Tesis1",
    inicio: "2025-09",
    periodo: "2025",
    estado: "publico",
    icono: "birrete",
    categorias: ["fullstack"],
    resumen: "Proyecto de título: plataforma logística con trazabilidad de productos y paquetes. Fue el punto de partida de TraceLink.",
    puntos: [
      "Importación masiva desde Excel con validación de datos y detección de duplicados.",
      "Alertas de stock bajo por correo y gestión de devoluciones de Mercado Libre.",
      "API con autenticación JWT, roles y tests de integración con Jest y Supertest."
    ],
    tecnologias: ["React", "Vite", "Tailwind CSS", "Express", "MongoDB", "Jest"],
    lenguajes: { JavaScript: 261302, CSS: 4485, HTML: 331 },
    commits: 10,
    enlaces: { codigo: "https://github.com/ErickColvin/Tesis1" }
  },
  {
    id: "tracelink-frontend",
    nombre: "TraceLink · Frontend v1",
    repo: "tracelink-frontend",
    inicio: "2025-09",
    periodo: "2025",
    estado: "publico",
    icono: "panel",
    categorias: ["frontend"],
    resumen: "Primera interfaz de TraceLink para el seguimiento de productos y paquetes.",
    puntos: [
      "Dashboard, alertas, paquetes, productos e importación de datos.",
      "Inicio de sesión y modo oscuro con componentes Flowbite."
    ],
    tecnologias: ["React", "Vite", "Tailwind CSS", "Flowbite"],
    lenguajes: { JavaScript: 36828, CSS: 2399, HTML: 1533, TypeScript: 490 },
    commits: 3,
    enlaces: { codigo: "https://github.com/ErickColvin/tracelink-frontend" }
  },
  {
    id: "proyecto-1",
    nombre: "Proyecto 1 · Gestión de servicios",
    repo: "Proyecto-1",
    inicio: "2025-05",
    periodo: "2025",
    estado: "publico",
    icono: "equipo",
    categorias: ["frontend"],
    resumen: "Proyecto en equipo organizado por historias de usuario, trabajado con ramas y merges en GitHub.",
    puntos: [
      "Gestión de servicios con búsqueda, paginación y cambio de estado.",
      "Rutas protegidas, creación de usuarios e importación desde Excel."
    ],
    tecnologias: ["React", "Vite", "Tailwind CSS", "Context API"],
    lenguajes: { JavaScript: 82011, CSS: 964, HTML: 331 },
    commits: 18,
    enlaces: { codigo: "https://github.com/ErickColvin/Proyecto-1" }
  }
];
