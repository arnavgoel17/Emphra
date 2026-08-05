import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";
import { generateSafeSuggestion } from "@/lib/chat";
import { moderateContent } from "@/lib/mock-api";

interface SafetySuggestionBody {
  text: string;
}

export async function POST(req: Request) {
  try {
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

    const { text }: SafetySuggestionBody = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    try {
      const suggestion = await generateSafeSuggestion(text);
      return NextResponse.json({ suggestion });
    } catch {
      // Fallback: use the static mock suggestion.
      const mock = moderateContent(text);
      return NextResponse.json({ suggestion: mock.suggestion });
    }
  } catch (error) {
    console.error("Safety Suggestion Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 502 }
    );
  }
}
