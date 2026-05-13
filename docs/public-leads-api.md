# Public Lead Ingestion API

`POST /api/public/leads`

Secure, rate-limited endpoint for collecting leads from authorised Revosso ecosystem applications.

---

## Authorised origins

| Domain | Subdomains |
|---|---|
| `revosso.com` | `*.revosso.com` |
| `revofin.com` | `*.revofin.com` |
| `revomaket.com` | `*.revomaket.com` |

Requests from any other origin receive `403 Unauthorized origin`.

In **non-production** environments the following localhost origins are also accepted:
`http://localhost:3000`, `http://localhost:3001`, `http://localhost:5173`

---

## Request

### Headers

```
Content-Type: application/json
Origin: https://revofin.com        # required – injected automatically by browsers
```

### Body

```json
{
  "product":      "REVOFIN",
  "source":       "revofin.com",
  "name":         "John Doe",
  "email":        "john@example.com",
  "businessType": "Restaurant",
  "interests":    ["POS", "Accounting"],

  // Optional – Cloudflare Turnstile token (see Bot Protection below)
  "turnstileToken": "<token>",

  // Honeypot – leave empty / omit in legitimate forms
  "hp": ""
}
```

### Field rules

| Field | Type | Required | Notes |
|---|---|---|---|
| `product` | `"REVOSSO" \| "REVOFIN" \| "REVOMAKET"` | ✅ | Exact enum value |
| `source` | string | ✅ | Submitting domain, max 253 chars |
| `name` | string | ✅ | 2–120 chars |
| `email` | string (email) | ✅ | Normalised to lowercase |
| `businessType` | string | ✅ | 1–120 chars |
| `interests` | string[] | ✅ | 1–20 items, each ≤ 100 chars |
| `turnstileToken` | string | ❌ | Required only when Turnstile is configured |
| `hp` | string | ❌ | Honeypot – must be empty or absent |

---

## Responses

### 200 – Success

```json
{ "success": true }
```

> Duplicate email submissions within 24 hours also return `200` (silent dedup).

### 400 – Validation error

```json
{ "success": false, "message": "Validation failed" }
```

### 403 – Unauthorised origin

```json
{ "success": false, "message": "Unauthorized origin" }
```

### 413 – Payload too large (> 8 KB)

```json
{ "success": false, "message": "Payload too large" }
```

### 429 – Rate limited

```json
{ "success": false, "message": "Too many requests. Please try again later." }
```

Headers: `Retry-After: <seconds>`, `X-RateLimit-Remaining: 0`

### 500 – Server error

```json
{ "success": false, "message": "Unable to process your request" }
```

---

## Example – Frontend fetch (TypeScript)

```typescript
// lib/submit-lead.ts  (on revofin.com or any authorised domain)

export interface LeadPayload {
  product: "REVOSSO" | "REVOFIN" | "REVOMAKET"
  source: string
  name: string
  email: string
  businessType: string
  interests: string[]
  turnstileToken?: string
}

export interface LeadResult {
  success: boolean
  message?: string
}

const REVOSSO_API_BASE = "https://revosso.com"

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  const response = await fetch(`${REVOSSO_API_BASE}/api/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // 'credentials: omit' – no cookies should cross domain boundaries
    credentials: "omit",
    body: JSON.stringify({
      ...payload,
      // Honeypot – always send as empty string from legitimate forms
      hp: "",
    }),
  })

  if (!response.ok && response.status !== 200) {
    const error = (await response.json().catch(() => ({}))) as { message?: string }
    return { success: false, message: error.message ?? "Unknown error" }
  }

  return response.json() as Promise<LeadResult>
}
```

### Usage in a React component

```tsx
import { submitLead } from "@/lib/submit-lead"

async function handleSubmit(formData: FormData) {
  const result = await submitLead({
    product: "REVOFIN",
    source: "revofin.com",
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    businessType: formData.get("businessType") as string,
    interests: formData.getAll("interests") as string[],
  })

  if (!result.success) {
    console.error("Lead submission failed:", result.message)
  }
}
```

---

## Bot Protection – Cloudflare Turnstile (optional)

1. Add the Turnstile widget to your form and obtain a token client-side.
2. Pass the token in the `turnstileToken` field of the request body.
3. Configure `TURNSTILE_SECRET_KEY` on the Revosso server.

When `TURNSTILE_SECRET_KEY` is not set, the token field is accepted but **not verified** (fail-open). Set it to enable enforcement.

---

## Environment variables

Add the following to your `.env.local` / deployment secrets:

```dotenv
# ── Database (already required) ──────────────────────────────────────────────
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# ── Bot protection (optional) ─────────────────────────────────────────────────
# Cloudflare Turnstile secret key – enables server-side token verification.
# Obtain from: https://dash.cloudflare.com → Turnstile → your site → Secret key
TURNSTILE_SECRET_KEY=

# ── Public lead rate limiter (optional overrides) ────────────────────────────
# Maximum submissions per IP per window (default: 5)
PUBLIC_LEADS_RATE_LIMIT_MAX=5
# Window duration in milliseconds (default: 900000 = 15 minutes)
PUBLIC_LEADS_RATE_LIMIT_WINDOW_MS=900000
```

---

## Security notes

- `Access-Control-Allow-Origin` is **never** `*` – only the exact requesting origin is reflected.
- Internal error details are **never** exposed in responses.
- Duplicate submissions return `200` to prevent email enumeration.
- Honeypot field (`hp`) returns a silent `200` to confuse bots.
- All validation is **server-side only**; client-side checks are advisory.

---

## Future extension points

| Concern | Extension path |
|---|---|
| New Revosso product | Add domain to `PRODUCTION_ALLOWED_EXACT_ORIGINS` + suffix list in `lib/public-api/allowed-origins.ts`; add enum value to `ALLOWED_PRODUCTS` in `lib/public-api/public-leads-validation.ts` |
| CRM integration | Add a CRM adapter call in `PublicLeadsService.createPublicLead` after DB insert |
| Analytics pipeline | Emit an event/message in the service layer; consume in a worker |
| Advanced anti-spam | Replace or augment `existsByEmailSince` with a third-party reputation API |
| Multi-instance rate limiting | Swap `Map` in `public-rate-limiter.ts` for a Redis/Upstash adapter behind the same interface |

