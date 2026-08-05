/**
 * Shared chat completion logic for OpenRouter free models.
 * Used by both /api/chat and /api/moderate (mode: "chat").
 */

interface ChatMessage {
  sender: string;
  text: string;
}

const SYSTEM_PROMPT =
  "You are a human chatting in the Emphra conversation playground. " +
  "Reply like a real person would — casual, concise (1-3 sentences), natural, and on-topic. " +
  "You have access to the full conversation history and should respond in context, " +
  "referencing earlier messages when relevant, just like a human would in a real chat. " +
  "Use a conversational tone — contractions, mild humor, occasional emojis are fine. " +
  "Do not mention that you are an AI, a bot, language model, or that you are using a playground. " +
  "Never say things like 'As an AI...' or 'I'm a language model'. " +
  "If you don't know something, say so like a human would. " +
  "Keep the flow natural — don't be overly formal or robotic.";

// Free models on OpenRouter, tried in order.
const FREE_MODELS = [
  "openrouter/free",
  "google/gemini-2.5-flash",
  "meta-llama/llama-3.3-8b-instruct:free",
] as const;

async function callFreeModel(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  apiKey: string
): Promise<string> {
  const errors: string[] = [];

  for (const model of FREE_MODELS) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "https://emphra.dev",
          "X-Title": "Emphra Playground",
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "");
        errors.push(`${model}: ${res.status} ${body.slice(0, 120)}`);
        continue;
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) {
        errors.push(`${model}: empty reply`);
        continue;
      }
      return reply;
    } catch (err) {
      errors.push(`${model}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  throw new Error(`All free models failed:\n${errors.join("\n")}`);
}

export async function generateChatReply(
  text: string,
  history: ChatMessage[] = []
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  for (const msg of history.slice(-20)) {
    const role = msg.sender?.toLowerCase().includes("user") ? "user" : "assistant";
    messages.push({ role, content: msg.text });
  }

  const lastEntry = messages[messages.length - 1];
  if (lastEntry?.role !== "user" || lastEntry.content !== text) {
    messages.push({ role: "user", content: text });
  }

  return callFreeModel(messages, apiKey);
}

const REWRITE_SYSTEM_PROMPT =
  "You are a helpful assistant that rewrites rude or toxic messages into polite, respectful ones. " +
  "The user will give you a message that was flagged as toxic. " +
  "Rewrite it to be polite and constructive while keeping the original intent. " +
  "Return ONLY the rewritten message — no explanation, no quotes, no prefix, no lecturing. " +
  "Do NOT say things like 'Here's a better version' or 'You should try'. " +
  "Just output the polite message as if the user had written it that way originally.";

/**
 * Generate a safe rewrite of a potentially toxic message.
 * Returns a polite version of the text that the user can send instead.
 */
export async function generateSafeSuggestion(text: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: REWRITE_SYSTEM_PROMPT },
    {
      role: "user",
      content: "Rewrite this message to be polite and respectful:\n" + text,
    },
  ];

  return callFreeModel(messages, apiKey);
}

const TOXIC_REPLY_SYSTEM_PROMPT =
  "You are a human chatting in a conversation. " +
  "The other person just sent you a rude, aggressive, or toxic message. " +
  "Reply as a real person would — acknowledge their frustration but ask them to be more polite and respectful. " +
  "Keep it short (1-3 sentences), natural, and conversational. " +
  "Do NOT be overly nice or robotic. Do NOT mention you are an AI. " +
  "Examples of good replies:\n" +
  "- \"I get where you're coming from, but let's keep it civil.\"\n" +
  "- \"Hey, I understand you're frustrated, but that language isn't cool.\"\n" +
  "- \"Whoa, that's pretty harsh. Can we dial it back a bit?\"";

/**
 * Generate a human-like reply to a toxic message the user sent anyway.
 * The bot responds from a receiver's POV — acknowledging but asking for civility.
 */
export async function generateToxicReply(text: string, history: ChatMessage[] = []): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: TOXIC_REPLY_SYSTEM_PROMPT },
  ];

  for (const msg of history.slice(-20)) {
    const role = msg.sender?.toLowerCase().includes("user") ? "user" : "assistant";
    messages.push({ role, content: msg.text });
  }

  const lastEntry = messages[messages.length - 1];
  if (lastEntry?.role !== "user" || lastEntry.content !== text) {
    messages.push({ role: "user", content: text });
  }

  return callFreeModel(messages, apiKey);
}
