const http = require('http')
const https = require('https')

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

  // Support both WHATWG Headers (fetch) and Node's plain header objects.
  if (headers && typeof headers.forEach === 'function') {
    headers.forEach((value, key) => {
      const lower = String(key).toLowerCase()
      if (hopByHop.has(lower)) return
      out[key] = value
    })
    return out
  }

  for (const [key, rawValue] of Object.entries(headers || {})) {
    const lower = String(key).toLowerCase()
    if (hopByHop.has(lower)) continue
    if (rawValue === undefined || rawValue === null) continue

    // Azure Functions response headers expect strings; normalize arrays.
    const value = Array.isArray(rawValue) ? rawValue.join(',') : String(rawValue)
    out[key] = value
  }
  return out
}

function proxyRequest(targetUrl, { method, headers, body }) {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl)
    const lib = url.protocol === 'https:' ? https : http

    const req = lib.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method,
        headers,
      },
      (res) => {
        const chunks = []
        res.on('data', (chunk) => chunks.push(chunk))
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 502,
            headers: res.headers || {},
            body: Buffer.concat(chunks),
          })
        })
      }
    )

    req.on('error', reject)
    req.setTimeout(30000, () => {
      req.destroy(new Error('Upstream timeout'))
    })

    if (body !== undefined) req.write(body)
    req.end()
  })
}

module.exports = async function (context, req) {
  const backendBase = process.env.BACKEND_BASE_URL
  if (!backendBase) {
    context.res = { status: 500, body: 'BACKEND_BASE_URL is not set' }
    return
  }

  const path =
    (context && context.bindingData && context.bindingData.path) ??
    ((req.params && req.params.path) ? req.params.path : '')

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

  try {
    const resp = await proxyRequest(targetUrl, { method: req.method, headers, body })

    context.res = {
      status: resp.statusCode,
      headers: sanitizeResponseHeaders(resp.headers || {}),
      body: resp.body,
      isRaw: true,
    }
  } catch (err) {
    context.res = {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ detail: 'Bad Gateway' }),
    }
  }
}
