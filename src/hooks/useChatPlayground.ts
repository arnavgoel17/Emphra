import { useState, useCallback } from "react";
import { Message, ModerationResult, SentimentResult, SmartReply } from "@/types";
import { generateHumanLikeResponse } from "@/lib/mock-api";
import { toast } from "sonner";

const INITIAL_MESSAGES: Message[] = [
  { id: "1", text: "Hello! Welcome to the Emphra playground. How can I assist you today?", isUser: false, timestamp: new Date() }
];

export function useChatPlayground() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [strictness, setStrictness] = useState<"Low" | "Medium" | "High">("Medium");
  const [enableModeration, setEnableModeration] = useState(true);

  const [moderation, setModeration] = useState<ModerationResult | null>(null);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [summary, setSummary] = useState("Conversation hasn't started yet.");
  const [history, setHistory] = useState<{ toxicity: number; time: string }[]>([]);
  const [ersScore, setErsScore] = useState(100);

  // Safety Popup State
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [safetySuggestion, setSafetySuggestion] = useState<string | null>(null);

  const processMessage = useCallback(async (text: string, isUser: boolean, forceSend: boolean = false) => {
    if (isUser) {
      try {
        const chatHistory = messages.map(m => ({ sender: m.isUser ? "User" : "Bot", text: m.text }));

        // 1. Analyze with Moderation API
        const response = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              text,
              history: chatHistory
          })
        });

        if (!response.ok) throw new Error("API call failed");

        const mod = await response.json();

        setModeration({
            toxicity: mod.toxicity * 100,
            flagged: mod.action !== "allow",
            action: mod.action,
            categories: []
        });

        setHistory(prev => [...prev, { toxicity: mod.toxicity * 100, time: new Date().toLocaleTimeString() }].slice(-10));

        // If blocked, open safety popup
        if (!forceSend && mod.action === "block" && enableModeration) {
            setPendingMessage(text);
            setSafetySuggestion(mod.suggestion);
            setIsSafetyOpen(true);
            return;
        }

        if (forceSend) {
            setErsScore(prev => Math.max(0, prev - (mod.toxicity * 50)));
        }

        // 2. Generate Contextual Reply
        setIsTyping(true);
        let botReply: string;
        try {
          const botResponse = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, history: chatHistory }),
          });
          if (!botResponse.ok) throw new Error("Bot reply failed");
          const botData = (await botResponse.json()) as { reply?: string };
          if (!botData.reply) throw new Error("empty reply");
          botReply = botData.reply;
        } catch {
          botReply = generateHumanLikeResponse(text);
        }

        const newBotMsg: Message = { id: Math.random().toString(), text: botReply, isUser: false, timestamp: new Date() };
        setMessages(prev => [...prev, newBotMsg]);
        setIsTyping(false);
        setSummary(mod.contextualSummary);
      } catch (error) {
        console.error("Playground Error:", error);
        toast.error("Failed to process message. Please check API keys.");
        setIsTyping(false);
      }
    }
  }, [messages, enableModeration]);

  const sendMessage = useCallback((text: string, forceSend: boolean = false) => {
    const newUserMsg: Message = { id: Math.random().toString(), text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    processMessage(text, true, forceSend);
  }, [processMessage]);

  const resetChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES);
    setModeration(null);
    setSentiment(null);
    setReplies([]);
    setSummary("Conversation reset.");
    setHistory([]);
    setErsScore(100);
    setIsSafetyOpen(false);
    setPendingMessage(null);
    toast.info("Playground reset.");
  }, []);

  return {
    messages,
    isTyping,
    strictness,
    setStrictness,
    enableModeration,
    setEnableModeration,
    moderation,
    sentiment,
    replies,
    summary,
    history,
    ersScore,
    isSafetyOpen,
    setIsSafetyOpen,
    pendingMessage,
    safetySuggestion,
    sendMessage,
    resetChat
  };
}
