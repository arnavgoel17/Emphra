import { ModerationResult, SentimentResult, SmartReply, Action, Message, ApiResponse } from "@/types";

/**
 * EMPHRA Master Mock API Engine
 * Simulates sophisticated AI responses for both the playground and advanced demo.
 */

const TOXIC_KEYWORDS = ["idiot", "stupid", "hate", "kill", "die", "dumb", "trash", "worst"];
const SPAM_KEYWORDS = ["free money", "winner", "prize", "click here", "unlimited", "claim now"];
const SCAM_KEYWORDS = ["bank", "password", "send otp", "crypto", "bitcoin", "investment", "security code"];

const SAFE_SUGGESTIONS: Record<string, string> = {
  "idiot": "I see your point, but I think there might be a more constructive way to frame this.",
  "stupid": "That seems like an interesting point, but I see it differently.",
  "hate": "I understand you're frustrated, but let's try to focus on the issue rather than personal attacks.",
  "kill": "That's quite intense. Can we dial down the language and keep things respectful?",
  "die": "Let's keep the conversation respectful and safe for everyone.",
  "trash": "I think there is room for improvement here.",
  "worst": "This is a challenging experience for me.",
};

export const moderateContent = (text: string, strictness: number | "Low" | "Medium" | "High" = "Medium"): ModerationResult => {
  const lowercase = text.toLowerCase();
  const flagged = TOXIC_KEYWORDS.filter(word => lowercase.includes(word));
  
  let toxicity = flagged.length * 25;
  if (text === text.toUpperCase() && text.length > 5) toxicity += 10;
  if (toxicity > 100) toxicity = 100;

  let threshold = 50;
  if (typeof strictness === "string") {
    threshold = strictness === "Low" ? 70 : strictness === "Medium" ? 40 : 20;
  } else {
    threshold = strictness;
  }

  let action: Action = "allow";
  if (toxicity >= threshold) {
    action = toxicity >= 80 ? "block" : "warn";
  }

  const categories: string[] = [];
  if (flagged.some(w => ["kill", "die"].includes(w))) categories.push("violence");
  if (flagged.some(w => ["idiot", "stupid", "dumb"].includes(w))) categories.push("harassment");

  const triggerWord = flagged.find(w => SAFE_SUGGESTIONS[w]);
  const suggestion = triggerWord ? SAFE_SUGGESTIONS[triggerWord] : "Could you rephrase that in a way that helps us move forward?";

  return { 
    toxicity: Math.min(toxicity, 100), 
    flagged, 
    action, 
    categories,
    suggestion,
    contextualSummary: action === "allow" ? "Everything looks clean." : "Potential community guideline violation detected."
  };
};

export const detectSpam = (text: string): { probability: number; categories: string[] } => {
  const lowercase = text.toLowerCase();
  const matches = SPAM_KEYWORDS.filter(word => lowercase.includes(word));
  const probability = Math.min(matches.length * 0.3, 1);
  return { probability, categories: matches.length > 0 ? ["spam"] : [] };
};

export const detectScam = (text: string): { probability: number; categories: string[] } => {
  const lowercase = text.toLowerCase();
  const matches = SCAM_KEYWORDS.filter(word => lowercase.includes(word));
  const probability = Math.min(matches.length * 0.35, 1);
  return { probability, categories: matches.length > 0 ? ["scam"] : [] };
};

export const analyzeSentiment = (text: string): SentimentResult => {
  const lowercase = text.toLowerCase();
  const positive = ["good", "great", "awesome", "excellent", "happy", "love", "thanks"].filter(w => lowercase.includes(w)).length;
  const negative = ["bad", "awful", "terrible", "worst", "unhappy", "angry", "hate"].filter(w => lowercase.includes(w)).length;
  
  const score = 50 + (positive * 10) - (negative * 10);
  
  let label = "Neutral";
  if (score > 65) label = "Positive";
  if (score > 85) label = "Excited";
  if (score < 45) label = "Negative";
  if (score < 25 || lowercase.includes("hate") || lowercase.includes("stupid")) label = "Angry";

  return { score: Math.min(Math.max(score, 0), 100), label };
};

export const generateSmartReplies = (text: string): SmartReply[] => {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes("hello") || lowercaseText.includes("hi")) {
    return [{ text: "Hello! How can I help you today?" }, { text: "Hi there! Welcome to the chat." }, { text: "Greetings! Need any assistance?" }];
  }
  
  if (lowercaseText.includes("help") || lowercaseText.includes("support")) {
    return [{ text: "I can help with that! What's the issue?" }, { text: "Our support team is here. Tell me more." }, { text: "Sure, let me guide you through it." }];
  }

  const mod = moderateContent(text);
  if (mod.action === "block") {
    return [{ text: "Please keep the conversation respectful." }, { text: "I'm sorry, I cannot engage with that kind of language." }, { text: "Let's stick to community guidelines." }];
  }

  return [
    { text: "That's interesting! Tell me more." },
    { text: "I see. What do you think about the next steps?" },
    { text: "Got it. Let's explore that further." }
  ];
};

export const summarizeConversation = (messages: Message[]): string => {
  if (messages.length === 0) return "No conversation history.";
  if (messages.length < 3) return "The conversation is just beginning.";
  
  const userMessages = messages.filter(m => m.isUser || m.sender?.startsWith("User")).length;
  const lastMsg = messages[messages.length - 1].text;
  
  const sentiment = analyzeSentiment(messages.map(m => m.text).join(" "));
  return `The conversation involves ${userMessages} user messages discussing various topics, most recently: "${lastMsg.substring(0, 30)}...". The tone is generally ${sentiment.label.toLowerCase()}.`;
};

export const generateHumanLikeResponse = (text: string): string => {
  const lowercase = text.toLowerCase();
  
  if (lowercase.includes("hello") || lowercase.includes("hi") || lowercase.includes("hey")) {
    const options = [
      "Hey! How's your day going?",
      "Hello! Great to see you here. How can I help?",
      "Hi there! What's on your mind today?",
      "Hey! Ready to explore what Emphra can do?"
    ];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  if (lowercase.includes("help") || lowercase.includes("how do i") || lowercase.includes("support")) {
    return "I'd be happy to guide you through that. Are you looking for technical docs or just a quick overview of our features?";
  }

  if (moderateContent(text).action === "block") {
    return "I'm here to keep things helpful and respectful. Let's try to pivot back to a more constructive topic, shall we?";
  }

  const genericOptions = [
    "That's a really interesting point! Tell me more about that.",
    "I see what you mean. How does that fit into your overall workflow?",
    "Got it. I'm curious to hear your thoughts on the next steps.",
    "That makes sense. Is there anything specific you'd like to dive deeper into?",
  ];
  return genericOptions[Math.floor(Math.random() * genericOptions.length)];
};

export const buildApiResponse = (messages: Message[], settings: { strictness?: number | "Low" | "Medium" | "High" }): ApiResponse => {
  const lastMessage = messages[messages.length - 1]?.text || "";
  const strictness = settings.strictness ?? "Medium";
  
  const mod = moderateContent(lastMessage, strictness);
  const spam = detectSpam(lastMessage);
  const scam = detectScam(lastMessage);
  const sentiment = analyzeSentiment(lastMessage);
  
  const allCategories = Array.from(new Set([...mod.categories, ...spam.categories, ...scam.categories]));
  
  return {
    ...mod,
    request_id: `emphra_${Math.floor(Math.random() * 100000)}`,
    latency: `${Math.floor(Math.random() * 150) + 20}ms`,
    sentiment,
    summary: summarizeConversation(messages),
    smart_replies: generateSmartReplies(lastMessage).map(r => r.text),
    ers_impact: mod.toxicity > 20 ? Math.floor(mod.toxicity / 2) : 0,
    spam_probability: spam.probability,
    scam_probability: scam.probability,
    categories: allCategories
  };
};
