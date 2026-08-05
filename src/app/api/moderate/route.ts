import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";
import {
  buildFullAnalysis,
  generateHumanLikeResponse,
  moderateContent,
} from "@/lib/mock-api";
import { analyzeToxicityDetoxify } from "@/lib/detoxify";
import { analyzeToxicity } from "@/lib/perspective";

interface ChatMessage {
  sender: string;
  text: string;
}

interface ModerationRequestBody {
  text: string;
  history?: ChatMessage[];
  mode?: "moderate" | "chat";
  strictness?: number | "Low" | "Medium" | "High";
}

/**
 * Try Detoxify first (if API key available), then Perspective, then mock fallback
 */
async function scoreToxicity(text: string): Promise<{
  toxicity: number;
  source: "detoxify" | "perspective" | "mock";
}> {
  // Try Detoxify if HF_API_KEY is available
  try {
    const result = await analyzeToxicityDetoxify(text);
    return { toxicity: result.toxicity, source: "detoxify" };
  } catch {
    // Try Perspective API as fallback
    try {
      const result = await analyzeToxicity(text);
      return { toxicity: result.toxicity, source: "perspective" };
    } catch {
      // Fall back to mock engine
      const mock = moderateContent(text);
      return { toxicity: mock.toxicity / 100, source: "mock" };
    }
  }
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const {
      text,
      history = [],
      mode = "moderate",
      strictness = "Medium",
    }: ModerationRequestBody = await req.json();

    // ── Chat / Bot Reply Mode ──────────────────────────────────────────
    if (text.startsWith("GENERATE_BOT_REPLY:") || mode === "chat") {
      const userPrompt = text.replace("GENERATE_BOT_REPLY:", "");
      const reply = generateHumanLikeResponse(userPrompt);
      return NextResponse.json({ reply });
    }

    // ── Moderation Mode ────────────────────────────────────────────────
    const { toxicity, source } = await scoreToxicity(text);

    // Build full analysis with toxicity from primary source
    const fallback = buildFullAnalysis(text, history, strictness);

    return NextResponse.json({
      ...fallback,
      toxicity,
      action: fallback.action,
      source,
    });
  } catch (error) {
    console.error("Moderation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
