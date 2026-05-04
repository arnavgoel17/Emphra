import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getCachedModeration, setCachedModeration, ratelimit } from "@/lib/redis";
import { ModerationResult } from "@/types";

export const runtime = "edge";

const PERSPECTIVE_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b:free";

interface ChatMessage {
  sender: string;
  text: string;
}

interface ModerationRequestBody {
  text: string;
  history?: ChatMessage[];
  mode?: "moderate" | "chat";
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (Latency: ~5-10ms)
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
          }
        }
      );
    }

    const { text, history = [], mode = "moderate" }: ModerationRequestBody = await req.json();

    // 2. Global Cache Check (Latency: ~10-20ms)
    // We only cache moderation decisions, not dynamic chat replies
    if (mode === "moderate") {
        const cached = await getCachedModeration(text);
        if (cached) return NextResponse.json(cached);
    }

    // Helper for AI API
    const callAI = async (messages: { role: string; content: string }[]) => {
        try {
            const res = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${env.QWEN_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://emphra.com",
                    "X-Title": "Emphra Moderation"
                },
                body: JSON.stringify({ model: MODEL, messages })
            });
            const json = await res.json();
            return json.choices?.[0]?.message?.content?.trim() || "";
        } catch (error) {
            console.error("AI Call Error:", error);
            return "";
        }
    };

    // Special handling for Bot Reply Generation
    if (text.startsWith("GENERATE_BOT_REPLY:") || mode === "chat") {
        const userPrompt = text.replace("GENERATE_BOT_REPLY:", "");
        
        const systemPrompt = "You are Emphra AI, a highly intelligent, empathetic, and context-aware chat assistant. You are participating in a conversation. Your goal is to be helpful, natural, and engaging. You have access to the chat history and should use it to provide relevant responses. Do not act like a robot; act like a knowledgeable peer. IMPORTANT: Keep your responses concise and never exceed 20 words. ALWAYS reply in the exact same script and language as the user's last message. If the user uses transliteration (e.g., writing Hindi using Latin/English letters), you MUST do the same. Do NOT switch to native scripts like Devanagari unless the user uses them.";
        
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(m => ({ 
                role: m.sender.toLowerCase().includes("bot") ? "assistant" : "user", 
                content: m.text 
            })),
            { role: "user", content: userPrompt }
        ];

        const reply = await callAI(messages);
        return NextResponse.json({ reply });
    }

    // 2. Perspective API Analysis
    const perspectivePromise = fetch(`${PERSPECTIVE_URL}?key=${env.PERSPECTIVE_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment: { text },
        requestedAttributes: { 
            TOXICITY: {}, 
            INSULT: {}, 
            THREAT: {},
            PROFANITY: {},
            IDENTITY_ATTACK: {}
        },
      }),
    }).then(res => res.json());

    const perspectiveData = await perspectivePromise;
    const scores = perspectiveData.attributeScores || {};
    
    const attributes = {
        toxicity: scores.TOXICITY?.summaryScore?.value || 0,
        insult: scores.INSULT?.summaryScore?.value || 0,
        threat: scores.THREAT?.summaryScore?.value || 0,
        profanity: scores.PROFANITY?.summaryScore?.value || 0,
        identity_attack: scores.IDENTITY_ATTACK?.summaryScore?.value || 0,
    };

    let suggestion = "";
    let contextualSummary = "";

    // Optimization: Parallel AI calls if potentially toxic
    if (attributes.toxicity > 0.3) {
        const [summary, rephrase] = await Promise.all([
            callAI([
                { role: "system", content: "You are a moderation assistant. Analyze the conversation history and the new message to provide a concise summary of the context." },
                { role: "user", content: `History:\n${history.map(m => `${m.sender}: ${m.text}`).join("\n")}\nNew Message: "${text}"` }
            ]),
            callAI([
                { role: "system", content: "You are a helpful assistant that rephrases toxic messages into polite, constructive alternatives. IMPORTANT: Always provide the rephrased message in the exact same script and language as the original message. If the original uses transliteration (e.g., Hindi in Latin letters), the rephrased version MUST use the same script." },
                { role: "user", content: `Please provide a polite, constructive rephrasing of: "${text}". Only output the rephrased message.` }
            ])
        ]);
        contextualSummary = summary;
        suggestion = rephrase;
    } else {
        contextualSummary = "Everything looks clean.";
    }

    const result = {
      ...attributes,
      action: attributes.toxicity > 0.7 ? "block" : attributes.toxicity > 0.3 ? "warn" : "allow",
      suggestion: suggestion || "Please be more respectful.",
      contextualSummary: contextualSummary || "No context available.",
      flagged: attributes.toxicity > 0.3
    };

    // 3. Store in Global Cache (Non-blocking)
    if (mode === "moderate") {
        setCachedModeration(text, result).catch(err => console.error("Cache Set Error:", err));
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Moderation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
