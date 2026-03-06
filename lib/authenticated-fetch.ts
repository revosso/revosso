'use client';

/**
 * Authenticated API Client
 * 
 * Utilities for making authenticated API calls from the frontend.
 * Automatically attaches the JWT access token to requests.
 * 
 * Usage:
 * const { data } = await authenticatedFetch('/api/admin/leads', getAccessToken);
 */

/**
 * Make an authenticated API call
 * 
 * @param url - API endpoint URL
 * @param getAccessToken - Function to get the access token
 * @param options - Fetch options (method, body, etc.)
 * @returns Response data
 * 
 * @example
 * const getAccessToken = useAccessToken();
 * const data = await authenticatedFetch('/api/admin/leads', getAccessToken);
 */
export async function authenticatedFetch(
  url: string,
  getAccessToken: () => Promise<string | undefined>,
  options?: RequestInit
): Promise<any> {
  const token = await getAccessToken();
  
  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed with status ${response.status}`);
  }

  return await response.json();
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
export function useAuthenticatedFetch(
  getAccessToken: () => Promise<string | undefined>
) {
  return async (url: string, options?: RequestInit) => {
    return authenticatedFetch(url, getAccessToken, options);
  };
}

/**
 * Make an authenticated GET request
 */
export async function authenticatedGet(
  url: string,
  getAccessToken: () => Promise<string | undefined>
) {
  return authenticatedFetch(url, getAccessToken, { method: 'GET' });
}

/**
 * Make an authenticated POST request
 */
export async function authenticatedPost(
  url: string,
  getAccessToken: () => Promise<string | undefined>,
  body: any
) {
  return authenticatedFetch(url, getAccessToken, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated PATCH request
 */
export async function authenticatedPatch(
  url: string,
  getAccessToken: () => Promise<string | undefined>,
  body: any
) {
  return authenticatedFetch(url, getAccessToken, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * Make an authenticated DELETE request
 */
export async function authenticatedDelete(
  url: string,
  getAccessToken: () => Promise<string | undefined>
) {
  return authenticatedFetch(url, getAccessToken, { method: 'DELETE' });
}
