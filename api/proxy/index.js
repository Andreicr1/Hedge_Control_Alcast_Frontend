function sanitizeHeaders(headers) {
  const hopByHop = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'host',
    'content-length',
  ])

  const out = {}
  for (const [key, value] of Object.entries(headers || {})) {
    if (!key) continue
    const lower = key.toLowerCase()
    if (hopByHop.has(lower)) continue
    if (lower.startsWith('x-ms-')) continue
    if (lower.startsWith('x-arr-')) continue
    out[lower] = value
  }
  return out
}

function pickBody(req) {
  if (!req) return undefined
  if (typeof req.rawBody === 'string') return req.rawBody
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody

  // For form-urlencoded, Functions often gives body as string.
  if (typeof req.body === 'string') return req.body

  // For JSON, body may already be an object.
  if (req.body && typeof req.body === 'object') return JSON.stringify(req.body)

  return undefined
}

function sanitizeResponseHeaders(headers) {
  const hopByHop = new Set([
    'connection',
    'keep-alive',
    'proxy-authenticate',
    'proxy-authorization',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
  ])

  const out = {}
  headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (hopByHop.has(lower)) return
    out[key] = value
  })
  return out
}

module.exports = async function (context, req) {
  const backendBase = process.env.BACKEND_BASE_URL
  if (!backendBase) {
    context.res = { status: 500, body: 'BACKEND_BASE_URL is not set' }
    return
  }

  const path = (req.params && req.params.path) ? req.params.path : ''

  // Governance hard-stop: legacy surfaces must not be reachable from the frontend origin.
  // If a client calls /api/market/*, /api/prices/*, /api/live, or any live/LME/spot legacy path,
  // respond deterministically with 404.
  const normalizedPath = String(path || '').replace(/^\/+/, '')
  const lowerPath = normalizedPath.toLowerCase()
  const blockedPrefixes = [
    'market/',
    'prices/',
    'live',
    'market-data/lme',
  ]

  if (blockedPrefixes.some((p) => lowerPath === p || lowerPath.startsWith(`${p}/`) || lowerPath.startsWith(p))) {
    context.res = {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ detail: 'Not Found' }),
    }
    return
  }

  const qs = req.originalUrl && req.originalUrl.includes('?')
    ? req.originalUrl.substring(req.originalUrl.indexOf('?'))
    : ''

  const targetUrl = `${backendBase.replace(/\/+$/, '')}/${path}${qs}`

  // Normalize/sanitize headers.
  // NOTE: Some hosting layers may strip/override the standard Authorization header.
  // To be robust, we also accept a custom header and map it to Authorization upstream.
  const headers = sanitizeHeaders(req.headers)
  const customAuth =
    req?.headers?.['x-hc-authorization'] ??
    req?.headers?.['x-authorization'] ??
    req?.headers?.['x-auth-token']

  const auth = req?.headers?.authorization ?? req?.headers?.Authorization

  const upstreamAuth = (customAuth || auth || '').toString().trim()
  if (upstreamAuth) headers['authorization'] = upstreamAuth

  // Never forward our custom auth headers upstream.
  delete headers['x-hc-authorization']
  delete headers['x-authorization']
  delete headers['x-auth-token']

  // Keep content-type if present (especially for form-urlencoded)
  const ct = req?.headers?.['content-type'] ?? req?.headers?.['Content-Type']
  if (ct && !headers['content-type']) headers['content-type'] = ct

  // Optional: handle OPTIONS fast
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'allow': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
      },
    }
    return
  }

  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : pickBody(req)

  const resp = await fetch(targetUrl, { method: req.method, headers, body, redirect: 'manual' })
  const responseHeaders = sanitizeResponseHeaders(resp.headers)
  const arrayBuffer = await resp.arrayBuffer()

  context.res = {
    status: resp.status,
    headers: responseHeaders,
    body: Buffer.from(arrayBuffer),
    isRaw: true,
  }
}
