/**
 * Detoxify Toxicity Detection API client
 * Uses Hugging Face Inference API with pre-trained detoxify models
 *
 * Returns detailed toxicity scores for multiple categories.
 * Free tier: 1500 requests/day on Hugging Face
 */

export interface DetoxifyScores {
  /** 0-1 probability of the comment being toxic */
  toxic: number;
  /** 0-1 probability of the comment being severely toxic */
  severe_toxic: number;
  /** 0-1 probability of the comment being obscene */
  obscene: number;
  /** 0-1 probability of the comment being a threat */
  threat: number;
  /** 0-1 probability of the comment being an insult */
  insult: number;
  /** 0-1 probability of the comment being an identity hate */
  identity_hate: number;
}

export interface DetoxifyResult {
  /** 0-1 overall toxicity (max of all categories) */
  toxicity: number;
  scores: DetoxifyScores;
  flagged: boolean;
  source: "detoxify";
}

const HF_API_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert";

// ── Token-bucket rate limiter ──────────────────────────────────────────────

const MAX_TOKENS = 1;          // bucket capacity
const REFILL_MS = 1000;        // 1 token per second (rate limit for free tier)

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

/**
 * Call Hugging Face Inference API with Detoxify model
 */
export async function analyzeToxicityDetoxify(text: string): Promise<DetoxifyResult> {
  const apiKey = process.env.HF_API_KEY;
  if (!apiKey) {
    throw new Error("HF_API_KEY not set");
  }

  if (!acquireToken()) {
    throw new Error("Hugging Face API rate limit exceeded. Falling back to Perspective.");
  }

  try {
    const res = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      throw new Error(`Detoxify API error: ${res.status} ${errorBody}`);
    }

    const data = await res.json();

    // Hugging Face Inference API returns an array
    // [{ label: "TOXIC", score: 0.87 }, { label: "SEVERE_TOXIC", score: 0.12 }, ...]
    const scores: DetoxifyScores = {
      toxic: 0,
      severe_toxic: 0,
      obscene: 0,
      threat: 0,
      insult: 0,
      identity_hate: 0,
    };

    if (Array.isArray(data)) {
      for (const item of data) {
        const label = item.label?.toUpperCase().replace(/\s+/g, "_") || "";
        const score = item.score || 0;

        if (label === "TOXIC") scores.toxic = score;
        else if (label === "SEVERE_TOXIC") scores.severe_toxic = score;
        else if (label === "OBSCENE") scores.obscene = score;
        else if (label === "THREAT") scores.threat = score;
        else if (label === "INSULT") scores.insult = score;
        else if (label === "IDENTITY_HATE") scores.identity_hate = score;
      }
    }

    // Calculate overall toxicity as max of all categories
    const toxicity = Math.max(
      scores.toxic,
      scores.severe_toxic,
      scores.obscene,
      scores.threat,
      scores.insult,
      scores.identity_hate
    );

    return {
      toxicity,
      scores,
      flagged: toxicity >= 0.5,
      source: "detoxify" as const,
    };
  } catch (error) {
    throw new Error(`Detoxify analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
