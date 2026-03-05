const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const MAX_REQUESTS = 5
const WINDOW_MS = 10 * 60 * 1000 // 10 minutes

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    // New window
    const resetAt = now + WINDOW_MS
    rateLimitMap.set(ip, { count: 1, resetAt })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetAt: record.resetAt }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(ip)
    }
  }
}, WINDOW_MS)

