// Demo estática de Finanzas Personales (GitHub Pages, sin servidor).
// Responde las llamadas a /api y /health con las respuestas grabadas de la API en modo demostración
// (datos inventados) y replica en el navegador los filtros, el orden y la paginación del backend.
// Los cambios (movimientos, reglas, presupuestos, alertas, membresías, nombres, cuentas) viven solo en memoria:
// se pierden al recargar. Exportar genera el CSV en el navegador con los mismos filtros.
import datos from './datos-demo.json'

/* ---------- Reloj de la demo ----------
   "Hoy" es el día del último movimiento grabado y el tiempo corre desde que se abre la página.
   Así el mes actual siempre tiene datos, aunque la demo se visite meses después. */
const FechaReal = Date
const inicioReal = FechaReal.now()
const hoyDemo = new FechaReal(datos.ultimoMovimiento).getTime() + 60 * 60 * 1000
function ahora() { return hoyDemo + (FechaReal.now() - inicioReal) }
class FechaDemo extends FechaReal {
  constructor(...args) {
    if (args.length === 0) super(ahora())
    else super(...args)
  }
  static now() { return ahora() }
}
globalThis.Date = FechaDemo

/* ---------- Estado en memoria ---------- */
const movimientos = datos.movimientos.map((m) => ({ ...m }))
const detalles = Object.fromEntries(Object.entries(datos.detalles).map(([id, d]) => [id, { ...d }]))
const categorias = datos.respuestas['/api/categories']
let siguienteId = Math.max(...movimientos.map((m) => m.id)) + 1

/* ---------- Filtros, igual que EfMovementQueries.Filter ---------- */
const plegar = (t) => String(t ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const textoBusqueda = (m) => plegar([m.merchant, m.counterparty, m.display?.name, m.display?.place, m.display?.via, m.categoryName, m.notes, m.accountLabel].join(' '))
const diaLocal = (m) => m.occurredAt.slice(0, 10)
const aMenor = (valor, moneda) => (moneda === 'USD' ? Math.round(Number(valor) * 100) : Math.round(Number(valor)))
function ultimoDia(mes) { const [a, m] = mes.split('-').map(Number); return `${mes}-${String(new FechaReal(a, m, 0).getDate()).padStart(2, '0')}` }

function filtrar(q) {
  let lista = movimientos
  for (const termino of plegar(q.get('q')).split(/\s+/).filter(Boolean)) lista = lista.filter((m) => textoBusqueda(m).includes(termino))
  let desde = q.get('from'), hasta = q.get('to')
  if (!desde && !hasta && q.get('month')) { desde = `${q.get('month')}-01`; hasta = ultimoDia(q.get('month')) }
  if (desde) lista = lista.filter((m) => diaLocal(m) >= desde)
  if (hasta) lista = lista.filter((m) => diaLocal(m) <= hasta)
  if (q.get('category')) {
    const partes = q.get('category').split(',')
    const ids = partes.filter((p) => p !== 'none').map(Number)
    const sin = partes.includes('none')
    lista = lista.filter((m) => (m.categoryId !== null && ids.includes(m.categoryId)) || (sin && m.categoryId === null))
  }
  if (q.get('type')) { const tipos = q.get('type').split(','); lista = lista.filter((m) => tipos.includes(m.type)) }
  if (q.get('direction')) lista = lista.filter((m) => m.direction === q.get('direction'))
  const estado = q.get('status') || 'all'
  if (estado === 'visible') lista = lista.filter((m) => !m.isIgnored)
  else if (estado === 'confirmed') lista = lista.filter((m) => m.status === 'Confirmed' && !m.isIgnored)
  else if (estado === 'pending') lista = lista.filter((m) => m.status === 'PendingReview' && !m.isIgnored)
  else if (estado === 'internal') lista = lista.filter((m) => m.isInternal)
  else if (estado === 'ignored') lista = lista.filter((m) => m.isIgnored)
  const moneda = q.get('currency')
  if (moneda) lista = lista.filter((m) => m.currency === moneda)
  // Sin moneda, el rango se aplica a cada movimiento en su moneda
  if (q.get('min')) lista = lista.filter((m) => m.amountMinor >= aMenor(q.get('min'), m.currency))
  if (q.get('max')) lista = lista.filter((m) => m.amountMinor <= aMenor(q.get('max'), m.currency))
  if (q.get('account')) lista = lista.filter((m) => m.accountId === Number(q.get('account')))
  if (q.get('origin')) lista = lista.filter((m) => m.origin === q.get('origin'))
  return lista
}

const ORDEN_MONEDA = { CLP: 0, USD: 1 }
function ordenar(lista, orden) {
  const fecha = (m) => new FechaReal(m.occurredAt).getTime()
  const copia = lista.slice()
  if (orden === 'date_asc') return copia.sort((a, b) => fecha(a) - fecha(b) || a.id - b.id)
  if (orden === 'amount_desc') return copia.sort((a, b) => ORDEN_MONEDA[a.currency] - ORDEN_MONEDA[b.currency] || b.amountMinor - a.amountMinor || b.id - a.id)
  if (orden === 'amount_asc') return copia.sort((a, b) => ORDEN_MONEDA[a.currency] - ORDEN_MONEDA[b.currency] || a.amountMinor - b.amountMinor || a.id - b.id)
  return copia.sort((a, b) => fecha(b) - fecha(a) || b.id - a.id)
}

function totales(lista) {
  const grupos = {}
  for (const m of lista) {
    if (m.isIgnored) continue
    const g = (grupos[m.currency] ??= { currency: m.currency, outMinor: 0, inMinor: 0, count: 0, noTuyo: 0, compartidos: 0 })
    g.count++
    if (m.direction === 'Out') {
      g.outMinor += m.amountMinor
      if (m.share) { g.noTuyo += m.amountMinor - m.share.amountMinor; g.compartidos++ }
    } else {
      g.inMinor += m.amountMinor
    }
  }
  return Object.values(grupos).sort((a, b) => ORDEN_MONEDA[a.currency] - ORDEN_MONEDA[b.currency]).map((g) => ({
    currency: g.currency, outMinor: g.outMinor, inMinor: g.inMinor, count: g.count, myOutMinor: g.compartidos ? g.outMinor - g.noTuyo : null,
  }))
}

function pagina(q) {
  const lista = ordenar(filtrar(q), q.get('sort') || 'date_desc')
  const numero = Math.max(1, Number(q.get('page')) || 1)
  const tamano = Math.min(200, Math.max(1, Number(q.get('pageSize')) || 50))
  return { items: lista.slice((numero - 1) * tamano, numero * tamano), total: lista.length, page: numero, pageSize: tamano, totals: totales(lista) }
}

/* ---------- Cambios en memoria ---------- */
function aplicarCambios(m, cambios) {
  for (const [clave, valor] of Object.entries(cambios)) {
    if (clave === 'categoryId') {
      const c = categorias.find((x) => x.id === valor)
      m.categoryId = valor
      m.categoryName = c ? c.name : null
      m.categoryKind = c ? c.kind : null
      m.categorySource = valor === null ? 'None' : 'User'
    } else if (clave === 'installments') {
      m.installmentsCount = valor
    } else if (clave === 'occurredAt') {
      m.occurredAt = String(valor).length <= 10 ? `${valor}T12:00:00-03:00` : valor
    } else if (clave in m) {
      m[clave] = valor
    }
  }
  // Decidir un movimiento en revisión lo confirma
  if ('isInternal' in cambios || 'categoryId' in cambios || 'isIgnored' in cambios) { m.status = 'Confirmed'; m.reviewReason = null }
}

function detalleDe(m) {
  const d = (detalles[m.id] ??= { movement: m, cardLast4: null, categoryConfidence: null, source: null, changes: [], createdAtUtc: new FechaDemo().toISOString(), updatedAtUtc: new FechaDemo().toISOString() })
  d.movement = m
  return d
}

/* ---------- Rutas ---------- */
function responder(metodo, ruta, q, cuerpo) {
  if (ruta === '/health') return [200, 'Healthy']
  const id = Number((ruta.match(/^\/api\/movements\/(\d+)/) || [])[1])

  if (metodo === 'GET') {
    if (ruta === '/api/movements') return [200, pagina(q)]
    if (ruta === '/api/movements/export') return [404, { title: 'La exportación se descarga desde los botones CSV y Excel.' }]
    if (id) {
      const m = movimientos.find((x) => x.id === id)
      return m ? [200, detalleDe(m)] : [404, { title: 'No existe ese movimiento.' }]
    }
    if (ruta === '/api/dashboard') {
      const mes = q.get('month')
      return [200, datos.resumenes[mes] ?? { ...datos.resumenes[datos.meses[0]], month: mes, currencies: [] }]
    }
    if (ruta === '/api/budgets') {
      const mes = q.get('month')
      return [200, datos.presupuestos[mes] ?? datos.presupuestos[datos.meses.at(-1)]]
    }
    if (ruta === '/api/status') {
      const base = datos.respuestas['/api/status']
      return [200, { ...base, movements: movimientos.length, pendingReview: movimientos.filter((m) => m.status === 'PendingReview' && !m.isIgnored).length }]
    }
    if (ruta in datos.respuestas) return [200, datos.respuestas[ruta]]
    return [404, { title: 'No disponible en la demo.' }]
  }

  if (metodo === 'PATCH' && id) {
    const m = movimientos.find((x) => x.id === id)
    if (!m) return [404, { title: 'No existe ese movimiento.' }]
    aplicarCambios(m, cuerpo || {})
    return [200, detalleDe(m)]
  }
  if (metodo === 'POST' && ruta === '/api/movements') {
    const c = cuerpo || {}
    const cuenta = datos.respuestas['/api/accounts'].find((a) => a.id === c.accountId)
    const m = {
      id: siguienteId++, occurredAt: c.occurredAt && String(c.occurredAt).length <= 10 ? `${c.occurredAt}T12:00:00-03:00` : c.occurredAt || new FechaDemo().toISOString(),
      type: c.type, direction: c.direction, amountMinor: c.amountMinor ?? 0, currency: c.currency || 'CLP', merchant: c.merchant ?? null, counterparty: null,
      categoryId: null, categoryName: null, categoryKind: null, categorySource: 'None', accountId: c.accountId ?? null, accountLabel: cuenta ? cuenta.label ?? cuenta.institution : null,
      status: 'Confirmed', reviewReason: null, possibleInternal: false, isInternal: false, isIgnored: false, origin: 'Manual', installmentsCount: null,
      notes: c.notes ?? null, cashFlow: c.direction === 'In' ? 'Income' : 'Expense', relatedMovementId: null, display: null, share: null,
    }
    aplicarCambios(m, { categoryId: c.categoryId ?? null })
    m.status = 'Confirmed'
    movimientos.push(m)
    return [201, detalleDe(m)]
  }
  if (metodo === 'DELETE' && id) {
    const i = movimientos.findIndex((x) => x.id === id)
    if (i !== -1) movimientos.splice(i, 1)
    return [204, null]
  }
  return responderAjustes(metodo, ruta, q, cuerpo)
}

/* ---------- Reglas, categorías, cuentas, presupuestos, alertas y comercios (en memoria) ---------- */
const reglas = datos.respuestas['/api/rules']
const cuentas = datos.respuestas['/api/accounts']
const alertas = datos.respuestas['/api/alerts']
const alias = datos.respuestas['/api/merchant-aliases']
const compartidos = datos.respuestas['/api/cost-shares']
const etiquetaOriginal = Object.fromEntries(cuentas.map((c) => [c.id, c.alias ? c.institution : c.label]))
const nombreOriginal = {}
for (const m of movimientos) if (m.display && !(m.display.key in nombreOriginal)) nombreOriginal[m.display.key] = m.display.name
let idNuevo = 5000
const ahoraIso = () => new FechaDemo().toISOString()

function nuevaRegla(match, pattern, categoryId) {
  const c = categorias.find((x) => x.id === categoryId)
  const regla = { id: idNuevo++, match, pattern, categoryId, categoryName: c ? c.name : '', origin: 'Ui', hits: 0, createdAtUtc: ahoraIso(), lastUsedAtUtc: null }
  // La regla se aplica a los movimientos sin categoría elegida por el usuario
  let aplicados = 0
  for (const m of movimientos) {
    const texto = (m.merchant ?? m.counterparty ?? '').toLowerCase()
    const coincide = match === 'Exact' ? texto === pattern.toLowerCase() : texto.includes(pattern.toLowerCase())
    if (coincide && m.categorySource !== 'User') { aplicarCambios(m, { categoryId }); m.categorySource = 'Rule'; aplicados++ }
  }
  regla.hits = aplicados
  reglas.push(regla)
  return { ruleId: regla.id, applied: aplicados }
}

function estadoPresupuesto(linea) {
  if (linea.budgetMinor === null) return null
  if (linea.spentMinor > linea.budgetMinor) return 'Over'
  return linea.spentMinor >= linea.budgetMinor * 0.8 ? 'Warning' : 'Ok'
}
function recalcularPresupuesto(vista) {
  for (const l of vista.lines) l.state = estadoPresupuesto(l)
  const con = vista.lines.filter((l) => l.budgetMinor !== null)
  vista.totalBudgetMinor = con.reduce((s, l) => s + l.budgetMinor, 0)
  vista.spentInBudgetedMinor = con.reduce((s, l) => s + l.spentMinor, 0)
}
// month = null cambia el presupuesto de todos los meses (salvo los ajustados a mano)
function fijarPresupuesto(categoryId, monto, mes) {
  for (const [m, vista] of Object.entries(datos.presupuestos)) {
    const linea = vista.lines.find((l) => l.categoryId === categoryId)
    if (!linea) continue
    if (mes === null) {
      linea.defaultBudgetMinor = monto
      if (!linea.isMonthOverride) linea.budgetMinor = monto
    } else if (m === mes) {
      linea.budgetMinor = monto ?? linea.defaultBudgetMinor
      linea.isMonthOverride = monto !== null
    }
    recalcularPresupuesto(vista)
  }
}

function aplicarCompartido(clave, compartido) {
  for (const m of movimientos) {
    if (m.display?.key !== clave) continue
    m.share = compartido ? { id: compartido.id, numerator: compartido.numerator, denominator: compartido.denominator, amountMinor: Math.round(m.amountMinor * compartido.numerator / compartido.denominator) } : null
  }
}

function mensual(item) { return item.cycle === 'Annual' ? Math.round(item.amountMinor / 12) : item.amountMinor }

function responderAjustes(metodo, ruta, q, cuerpo) {
  const c = cuerpo || {}
  const idRuta = Number((ruta.match(/\/(\d+)$/) || [])[1])

  if (metodo === 'POST' && /^\/api\/movements\/\d+\/remember$/.test(ruta)) {
    const m = movimientos.find((x) => x.id === Number(ruta.split('/')[3]))
    return [200, m ? nuevaRegla('Exact', m.merchant ?? m.counterparty ?? '', c.categoryId) : { ruleId: 0, applied: 0 }]
  }
  if (metodo === 'POST' && ruta === '/api/rules') return [200, nuevaRegla(c.match, c.pattern, c.categoryId)]
  if (metodo === 'DELETE' && ruta.startsWith('/api/rules/')) { reglas.splice(reglas.findIndex((r) => r.id === idRuta) >>> 0, 1); return [204, null] }
  if (metodo === 'POST' && ruta === '/api/categorize') return [200, { byRule: 0, byAi: 0, doubtful: 0, unmatched: 0, aiUnavailable: true }]

  if (metodo === 'POST' && ruta === '/api/categories') {
    const nueva = { id: idNuevo++, name: c.name, kind: c.kind, parentId: null, archived: false, color: c.color ?? null, icon: c.icon ?? null }
    categorias.push(nueva)
    return [200, { id: nueva.id }]
  }
  if (metodo === 'PATCH' && ruta.startsWith('/api/categories/')) {
    const cat = categorias.find((x) => x.id === idRuta)
    if (cat) Object.assign(cat, c)
    return [204, null]
  }
  if (metodo === 'PATCH' && ruta.startsWith('/api/accounts/')) {
    const cuenta = cuentas.find((x) => x.id === idRuta)
    if (cuenta) {
      cuenta.alias = c.alias || null
      cuenta.label = cuenta.alias || etiquetaOriginal[cuenta.id]
      for (const m of movimientos) if (m.accountId === cuenta.id) m.accountLabel = cuenta.label
    }
    return [204, null]
  }

  if (metodo === 'PUT' && ruta.startsWith('/api/budgets/')) { fijarPresupuesto(idRuta, c.amountMinor, c.month ?? null); return [204, null] }
  if (metodo === 'DELETE' && ruta.startsWith('/api/budgets/')) { fijarPresupuesto(idRuta, null, q.get('month')); return [204, null] }

  if (metodo === 'POST' && ruta === '/api/alerts/decisions') {
    if (c.decision === 'Reported') {
      for (const a of alertas.suspicious) if (a.key === c.key) a.reported = true
    } else {
      for (const lista of ['suspicious', 'membershipAlerts', 'recurring']) alertas[lista] = alertas[lista].filter((a) => a.key !== c.key)
    }
    alertas.pending = alertas.suspicious.filter((a) => !a.reported).length + alertas.membershipAlerts.length
    return [204, null]
  }
  if (metodo === 'POST' && ruta === '/api/memberships') {
    const item = { id: idNuevo++, merchantKey: c.merchantKey, name: c.name, cycle: c.cycle, amountMinor: c.amountMinor, currency: c.currency, active: true,
      monthlyMinor: 0, lastChargeAt: null, lastChargeMinor: null, nextExpected: null, charges: 0, share: null, myMonthlyMinor: null }
    item.monthlyMinor = mensual(item)
    const recurrente = alertas.recurring.find((r) => r.merchantKey === c.merchantKey)
    if (recurrente) Object.assign(item, { lastChargeAt: recurrente.lastAt, lastChargeMinor: recurrente.lastAmountMinor, nextExpected: recurrente.nextExpected, charges: recurrente.count })
    alertas.recurring = alertas.recurring.filter((r) => r.merchantKey !== c.merchantKey)
    alertas.memberships.push(item)
    return [200, { id: item.id }]
  }
  if (metodo === 'PATCH' && ruta.startsWith('/api/memberships/')) {
    const item = alertas.memberships.find((x) => x.id === idRuta)
    if (item) { Object.assign(item, c); item.monthlyMinor = mensual(item) }
    return [204, null]
  }
  if (metodo === 'DELETE' && ruta.startsWith('/api/memberships/')) { alertas.memberships = alertas.memberships.filter((x) => x.id !== idRuta); return [204, null] }

  if (metodo === 'PUT' && ruta === '/api/merchant-aliases') {
    const nombre = (c.name || '').trim()
    const i = alias.findIndex((a) => a.key === c.key)
    if (!nombre) { if (i !== -1) alias.splice(i, 1) } else if (i !== -1) Object.assign(alias[i], { name: nombre, updatedAtUtc: ahoraIso() })
    else alias.push({ id: idNuevo++, key: c.key, name: nombre, updatedAtUtc: ahoraIso() })
    for (const m of movimientos) if (m.display?.key === c.key) Object.assign(m.display, { name: nombre || nombreOriginal[c.key], renamed: Boolean(nombre) })
    return [204, null]
  }
  if (metodo === 'DELETE' && ruta.startsWith('/api/merchant-aliases/')) {
    const i = alias.findIndex((a) => a.id === idRuta)
    if (i !== -1) {
      const clave = alias[i].key
      alias.splice(i, 1)
      for (const m of movimientos) if (m.display?.key === clave) Object.assign(m.display, { name: nombreOriginal[clave], renamed: false })
    }
    return [204, null]
  }
  if (metodo === 'PUT' && ruta === '/api/cost-shares') {
    let item = compartidos.find((x) => x.merchantKey === c.merchantKey)
    if (item) Object.assign(item, { numerator: c.numerator, denominator: c.denominator })
    else {
      item = { id: idNuevo++, merchantKey: c.merchantKey, name: nombreOriginal[c.merchantKey] ?? c.merchantKey, numerator: c.numerator, denominator: c.denominator, movements: movimientos.filter((m) => m.display?.key === c.merchantKey).length }
      compartidos.push(item)
    }
    aplicarCompartido(c.merchantKey, item)
    return [200, { id: item.id }]
  }
  if (metodo === 'DELETE' && ruta.startsWith('/api/cost-shares/')) {
    const i = compartidos.findIndex((x) => x.id === idRuta)
    if (i !== -1) { aplicarCompartido(compartidos[i].merchantKey, null); compartidos.splice(i, 1) }
    return [204, null]
  }
  // Cerrar sesión y lo demás: se acepta (la demo no tiene usuarios)
  return [204, null]
}

/* ---------- Exportar: CSV generado en el navegador con los mismos filtros de la lista ---------- */
function celda(v) { const t = String(v ?? ''); return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t }
function exportar(q) {
  const lista = ordenar(filtrar(q), q.get('sort') || 'date_desc')
  const filas = [['Fecha', 'Detalle', 'Categoría', 'Cuenta', 'Moneda', 'Monto', 'Sentido', 'Tipo', 'Estado', 'Notas']]
  for (const m of lista) {
    const monto = m.currency === 'USD' ? (m.amountMinor / 100).toFixed(2) : String(m.amountMinor)
    filas.push([m.occurredAt.slice(0, 16).replace('T', ' '), m.display?.name ?? m.merchant ?? m.counterparty ?? '', m.categoryName ?? '', m.accountLabel ?? '',
      m.currency, (m.direction === 'Out' ? '-' : '') + monto, m.direction === 'Out' ? 'Egreso' : 'Ingreso', m.type, m.status === 'Confirmed' ? 'Confirmado' : 'Por revisar', m.notes ?? ''])
  }
  // Punto y coma y BOM: así Excel en español lo abre bien con doble clic
  const csv = '﻿' + filas.map((f) => f.map(celda).join(';')).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  a.download = `movimientos-demo-${new FechaDemo().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove() }, 1000)
}
document.addEventListener('click', (e) => {
  const enlace = e.target.closest && e.target.closest('a[href*="/api/movements/export"]')
  if (!enlace) return
  e.preventDefault()
  exportar(new URL(enlace.getAttribute('href'), location.origin).searchParams)
}, true)

const fetchReal = globalThis.fetch.bind(globalThis)
globalThis.fetch = async (entrada, opciones = {}) => {
  const url = new URL(typeof entrada === 'string' ? entrada : entrada.url, location.origin)
  if (url.origin !== location.origin || !(url.pathname.startsWith('/api/') || url.pathname === '/health')) return fetchReal(entrada, opciones)
  const metodo = (opciones.method || 'GET').toUpperCase()
  let cuerpo = null
  try { cuerpo = opciones.body ? JSON.parse(opciones.body) : null } catch { cuerpo = null }
  const [estado, datosRespuesta] = responder(metodo, url.pathname, url.searchParams, cuerpo)
  // Una pequeña espera, como una red real, para que se vean los estados de carga
  await new Promise((r) => setTimeout(r, 120))
  if (estado === 204) return new Response(null, { status: 204 })
  const texto = typeof datosRespuesta === 'string' ? datosRespuesta : JSON.stringify(datosRespuesta)
  return new Response(texto, { status: estado, headers: { 'Content-Type': typeof datosRespuesta === 'string' ? 'text/plain' : 'application/json' } })
}
