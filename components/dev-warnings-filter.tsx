'use client';

/**
 * Silences false-positive hydration warnings caused by browser security
 * extensions (Bitdefender, Kaspersky, etc.) that inject `bis_skin_checked`
 * into DOM elements before React hydrates.
 *
 * WHY module-level (not useEffect):
 * React emits hydration warnings during its hydration pass, which runs before
 * any useEffect can fire. A useEffect patch would always be too late. Patching
 * at module load time ensures our wrapper is the outermost console.error by the
 * time React starts hydrating — so we intercept (and drop) the noise before
 * Next.js's error overlay ever sees it.
 *
 * Only active in development; production builds tree-shake this entirely.
 */
if (
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'development'
) {
  const _orig = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    // React passes the full tree diff (including "bis_skin_checked") either
    // inline in args[0] or as a subsequent argument — check all of them.
    const isBisExtensionWarning = args.some(
      (arg) => typeof arg === 'string' && arg.includes('bis_skin_checked')
    );
    if (isBisExtensionWarning) return;
    _orig(...args);
  };
}

export function DevWarningsFilter() {
  return null;
}
