'use client';

/**
 * Authenticated API Client
 *
 * Utilities for making authenticated API calls from the frontend.
 * Automatically attaches the JWT access token to requests.
 *
 * Usage:
 * const data = await authenticatedFetch('/api/admin/leads', getAccessToken);
 */

/**
 * Matches Auth0 `getTokenSilently` cache behavior — use `cacheMode: 'off'` to force a fresh access token.
 */
export type GetAccessTokenFn = (
  opts?: { cacheMode?: 'on' | 'off' | 'cache-only' }
) => Promise<string | undefined>

/**
 * Make an authenticated API call
 *
 * @param url - API endpoint URL
 * @param getAccessToken - Function to get the access token (from `useAccessToken()`)
 * @param options - Fetch options (method, body, etc.). Pass `{ raw: true }` to get the
 *   native `Response` (e.g. to handle 422 validation bodies yourself).
 * @returns Parsed JSON by default, or `Response` when `raw: true`.
 *
 * @example
 * const getAccessToken = useAccessToken();
 * const data = await authenticatedFetch('/api/admin/leads', getAccessToken);
 */
export type AuthenticatedFetchInit = RequestInit & { raw?: boolean }

export async function authenticatedFetch(
  url: string,
  getAccessToken: GetAccessTokenFn,
  options?: AuthenticatedFetchInit
): Promise<any | Response> {
  const { raw, ...init } = options ?? {}

  const doFetch = (accessToken: string) =>
    fetch(url, {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })

  let token = await getAccessToken()
  if (!token) {
    throw new Error('No access token available')
  }

  let response = await doFetch(token)

  // Stale in-memory token after refresh / expiry — ask Auth0 for a fresh access token once.
  if (!raw && response.status === 401) {
    const fresh = await getAccessToken({ cacheMode: 'off' })
    if (fresh) {
      response = await doFetch(fresh)
    }
  }

  if (raw) {
    return response
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || `Request failed with status ${response.status}`)
  }

  return await response.json()
}

/**
 * Hook-like helper to create an authenticated fetch function
 *
 * @param getAccessToken - Function to get the access token
 * @returns Fetch function with token pre-configured
 *
 * @example
 * const fetchAuthenticated = useAuthenticatedFetch(getAccessToken);
 * const data = await fetchAuthenticated('/api/admin/leads');
 */
export function useAuthenticatedFetch(getAccessToken: GetAccessTokenFn) {
  return async (url: string, options?: RequestInit) => {
    return authenticatedFetch(url, getAccessToken, options)
  }
}

/**
 * Make an authenticated GET request
 */
export async function authenticatedGet(url: string, getAccessToken: GetAccessTokenFn) {
  return authenticatedFetch(url, getAccessToken, { method: 'GET' })
}

/**
 * Make an authenticated POST request
 */
export async function authenticatedPost(
  url: string,
  getAccessToken: GetAccessTokenFn,
  body: any
) {
  return authenticatedFetch(url, getAccessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Make an authenticated PATCH request
 */
export async function authenticatedPatch(
  url: string,
  getAccessToken: GetAccessTokenFn,
  body: any
) {
  return authenticatedFetch(url, getAccessToken, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

/**
 * Make an authenticated DELETE request
 */
export async function authenticatedDelete(url: string, getAccessToken: GetAccessTokenFn) {
  return authenticatedFetch(url, getAccessToken, { method: 'DELETE' })
}
