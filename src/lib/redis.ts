/**
 * In-memory rate limiter and cache — zero external dependencies, zero cost.
 * Works perfectly for single-instance deployments (Vercel, Node, etc.).
 */

// ── Rate Limiter ────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 60s to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now >= entry.resetAt) rateLimitStore.delete(key);
  }
}, 60_000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  reset: number;
  remaining: number;
}

/**
 * Sliding-window rate limiter.
 * Allows `maxRequests` per `windowMs` milliseconds per key.
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  return {
    async limit(key: string): Promise<RateLimitResult> {
      const now = Date.now();
      const entry = rateLimitStore.get(key);

      if (!entry || now >= entry.resetAt) {
        // New window
        rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
        return {
          success: true,
          limit: maxRequests,
          reset: now + windowMs,
          remaining: maxRequests - 1,
        };
      }

      // Existing window
      const success = entry.count < maxRequests;
      if (success) entry.count++;

      return {
        success,
        limit: maxRequests,
        reset: entry.resetAt,
        remaining: Math.max(0, maxRequests - entry.count),
      };
    },
  };
}

/** Default rate limiter: 10 requests per 10 seconds per IP */
export const ratelimit = createRateLimiter(10, 10_000);

// ── Simple In-Memory Cache ──────────────────────────────────────────────────

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cacheStore = new Map<string, CacheEntry>();

// Cleanup expired cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cacheStore) {
    if (now >= entry.expiresAt) cacheStore.delete(key);
  }
}, 300_000);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, " ");
}

export async function getCachedModeration(text: string) {
  const key = `mod:${normalizeText(text)}`;
  const entry = cacheStore.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    cacheStore.delete(key);
    return null;
  }
  return entry.value;
}

export async function setCachedModeration(text: string, result: unknown) {
  const key = `mod:${normalizeText(text)}`;
  cacheStore.set(key, { value: result, expiresAt: Date.now() + 86400_000 }); // 24h TTL
}
