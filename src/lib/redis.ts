import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "./env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Rate limiter for the moderation API
 * Allows 10 requests per 10 seconds per IP
 */
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
  prefix: "ratelimit",
});

/**
 * Normalizes text for better cache hit rates
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "") // Remove punctuation
    .replace(/\s+/g, " ");   // Collapse whitespace
}

/**
 * Gets a moderation result from the global cache
 */
export async function getCachedModeration(text: string) {
  const key = `mod:${normalizeText(text)}`;
  return await redis.get(key);
}

/**
 * Sets a moderation result in the global cache with a 24h TTL
 */
export async function setCachedModeration(text: string, result: any) {
  const key = `mod:${normalizeText(text)}`;
  await redis.set(key, result, { ex: 86400 });
}
