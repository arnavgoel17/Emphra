import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";
import {
  buildFullAnalysis,
  generateHumanLikeResponse,
} from "@/lib/mock-api";

export const runtime = "edge";

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
    const result = buildFullAnalysis(text, history, strictness);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Moderation Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
