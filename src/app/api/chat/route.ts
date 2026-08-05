import { NextResponse } from "next/server";
import { ratelimit } from "@/lib/redis";
import { generateChatReply, generateToxicReply } from "@/lib/chat";

interface ChatMessage {
  sender: string;
  text: string;
}

interface ChatRequestBody {
  text: string;
  history?: ChatMessage[];
  wasToxic?: boolean; // true if user sent a toxic message "anyway"
}

export async function POST(req: Request) {
  try {
    // Rate limit
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

    const { text, history = [], wasToxic = false }: ChatRequestBody = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // If the user sent a toxic message "anyway", reply from a human receiver's POV
    const reply = wasToxic
      ? await generateToxicReply(text, history)
      : await generateChatReply(text, history);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Chat generation failed: ${error.message}`
            : "Chat generation failed",
      },
      { status: 502 }
    );
  }
}
