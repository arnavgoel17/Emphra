/**
 * Google Perspective API client — returns a normalized toxicity score.
 * Docs: https://developers.google.com/perspective/api
 *
 * Rate-limited to 1 request / second (free tier quota). When the bucket is
 * empty we throw immediately so the caller can fall back to the mock engine
 * instead of queueing behind a long timeout.
 */

const PERSPECTIVE_ENDPOINT =
  "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";

export interface PerspectiveResult {
  /** 0–1 overall toxicity score. */
  toxicity: number;
  /** True when toxicity >= 0.5 (warn threshold). */
  flagged: boolean;
}

// ── Token-bucket rate limiter ──────────────────────────────────────────────

const MAX_TOKENS = 1;          // bucket capacity
const REFILL_MS = 1000;        // 1 token per second

let tokens = MAX_TOKENS;
let lastRefill = Date.now();

function acquireToken(): boolean {
  const now = Date.now();
  const elapsed = now - lastRefill;

  // Refill proportional to elapsed time (capped at MAX_TOKENS)
  if (elapsed > 0) {
    tokens = Math.min(MAX_TOKENS, tokens + elapsed / REFILL_MS);
    lastRefill = now;
  }

  if (tokens >= 1) {
    tokens -= 1;
    return true;
  }
  return false;
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function analyzeToxicity(text: string): Promise<PerspectiveResult> {
  const apiKey = process.env.PERSPECTIVE_API_KEY;
  if (!apiKey) {
    throw new Error("PERSPECTIVE_API_KEY not set");
  }

  if (!acquireToken()) {
    throw new Error("Perspective API rate limit exceeded (1 req/s). Falling back to mock.");
  }

  const url = `${PERSPECTIVE_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      comment: { text },
      languages: ["en"],
      requestedAttributes: { TOXICITY: {} },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Perspective API ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    attributeScores?: {
      TOXICITY?: { summaryScore?: { value?: number } };
    };
  };

  const toxicity = data.attributeScores?.TOXICITY?.summaryScore?.value ?? 0;
  return {
    toxicity: Math.min(Math.max(toxicity, 0), 1),
    flagged: toxicity >= 0.5,
  };
}
