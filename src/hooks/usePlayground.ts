"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import type {
  PlaygroundMessage,
  AnalysisResult,
  AnalyticsDataPoint,
  Insight,
  PlaygroundSettings,
  PresetScenario,
  TabId,
  ProcessingStage,
} from "@/types/playground";
import { buildFullAnalysis, generateHumanLikeResponse } from "@/lib/mock-api";
import {
  generateInsights,
  generateSummary,
  generateTimeline,
} from "@/lib/insights-engine";
import { useSessionPersistence } from "./useSessionPersistence";
import { useShareableUrl } from "./useShareableUrl";

const DEFAULT_SETTINGS: PlaygroundSettings = {
  strictness: 50,
  spamDetection: true,
  toxicityDetection: true,
  smartReplies: true,
  autoSummary: true,
  sentiment: true,
  memory: true,
  language: "English",
};

type SafetyAction = "manual" | "suggested" | "force";

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

const SENDER_MAP: Record<string, string> = {
  user: "User A",
  system: "System",
  assistant: "Assistant",
  moderator: "Moderator Bot",
};

export function usePlayground() {
  const { save, load, clear } = useSessionPersistence();
  const { decode: decodeUrl } = useShareableUrl();
  // Track if this is the first mount (not HMR reload)
  const isFirstMount = useRef(true);

  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [activeTab, setActiveTab] = useState<TabId>("moderation");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>("idle");
  const [analytics, setAnalytics] = useState<AnalyticsDataPoint[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [settings, setSettings] = useState<PlaygroundSettings>(DEFAULT_SETTINGS);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [summary, setSummary] = useState({
    executive: "",
    keyPoints: [] as string[],
    takeaways: [] as string[],
  });
  const [timeline, setTimeline] = useState<
    { index: number; preview: string; action: string; time: string }[]
  >([]);

  // Safety dialog state
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingEdit, setPendingEdit] = useState<string>("");
  const [safetySuggestion, setSafetySuggestion] = useState<string | null>(null);
  const [isSafetyLoading, setIsSafetyLoading] = useState(false);
  // Tracks ERS (Emotional Risk Score) - starts at 0, increases when sending toxic messages "anyway"
  const [ersScore, setErsScore] = useState(0);
  // Tracks whether the user sent a toxic message "anyway" (Send Anyway)
  // vs. applied the polite suggestion. Used to pick the bot's reply tone.
  // When "Send Edited" is used, ERS score is NOT increased.
  const sentToxicAnywayRef = useRef(false);

  // Stores pre-generated bot reply while waiting for moderation
  const pendingBotReplyRef = useRef<string | null>(null);
  // Tracks currently processing message to prevent duplicates
  const sendMessageProcessingRef = useRef<string | null>(null);

  const sessionRef = useRef({
    messages: [] as PlaygroundMessage[],
    analysisResults: {} as Record<string, AnalysisResult>,
    analytics: [] as AnalyticsDataPoint[],
    insights: [] as Insight[],
    settings: DEFAULT_SETTINGS,
    activeScenario: null as string | null,
    ersScore: 100,
  });
  const processingRef = useRef(false);
  const scenarioTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Track which message IDs have already had analysis scheduled (guards against
  // React StrictMode double-invoking the setTimeout inside setMessages).
  const analyzedIdsRef = useRef<Set<string>>(new Set());
  // Track which message IDs we've already triggered analysis for (double-guard against StrictMode)
  const triggeredAnalysisIdsRef = useRef<Set<string>>(new Set());

  // Cancel any pending scenario timeouts
  const clearScenarioTimers = useCallback(() => {
    scenarioTimersRef.current.forEach((t) => clearTimeout(t));
    scenarioTimersRef.current = [];
  }, []);

  // Persist on change
  useEffect(() => {
    sessionRef.current = {
      messages,
      analysisResults: analyses,
      analytics,
      insights,
      settings,
      activeScenario,
      ersScore,
    };
    save(sessionRef.current);
  }, [messages, analyses, analytics, insights, settings, activeScenario, ersScore, save]);

  // Load persisted session on mount only (not HMR reloads)
  // Using sessionStorage means it automatically clears on page refresh or tab close
  useEffect(() => {
    if (isFirstMount.current) {
      const savedSession = load();
      if (savedSession) {
        setMessages(savedSession.messages);
        setAnalyses(savedSession.analysisResults);
        setAnalytics(savedSession.analytics);
        setInsights(savedSession.insights);
        setSettings(savedSession.settings);
        setActiveScenario(savedSession.activeScenario);
        if (savedSession.ersScore !== undefined) {
          setErsScore(savedSession.ersScore);
        }
      }
      isFirstMount.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load from URL on mount
  useEffect(() => {
    const scenarioId = decodeUrl();
    if (scenarioId) {
      setActiveScenario(scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateBotReply = useCallback(
    async (userText: string, currentMessages: PlaygroundMessage[], wasToxic = false, preGeneratedReply?: string) => {
      // If we already have a pre-generated reply, use it directly
      if (preGeneratedReply) {
        const botMsg: PlaygroundMessage = {
          id: generateId(),
          text: preGeneratedReply,
          role: "assistant",
          sender: "Assistant",
          timestamp: new Date(),
          status: "complete",
          isUser: false,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsReplying(false);
        setProcessingStage("idle");
        return;
      }

      setIsReplying(true);
      setProcessingStage("generating");
      try {
        const history = currentMessages
          .filter((m) => m.role !== "system")
          .map((m) => ({ sender: m.sender, text: m.text }));

        let reply: string;
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: userText, history, wasToxic }),
          });
          if (!res.ok) throw new Error("chat API error");
          const data = (await res.json()) as { reply?: string };
          if (!data.reply) throw new Error("empty reply");
          reply = data.reply;
        } catch {
          // Fallback: if toxic, use a human-like receiver reply; otherwise mock
          reply = wasToxic
            ? "I get your point, but let's keep it civil — no need for that kind of language."
            : generateHumanLikeResponse(userText);
        }

        const botMsg: PlaygroundMessage = {
          id: generateId(),
          text: reply,
          role: "assistant",
          sender: "Assistant",
          timestamp: new Date(),
          status: "complete",
          isUser: false,
        };
        setMessages((prev) => [...prev, botMsg]);
      } finally {
        setIsReplying(false);
        setProcessingStage("idle");
      }
    },
    []
  );

  const analyzeAndUpdate = useCallback(
    async (
      msgId: string,
      text: string,
      currentMessages: PlaygroundMessage[],
      currentSettings: PlaygroundSettings,
      preGeneratedBotReply?: string
    ) => {
      // Wait for any in-flight analysis to finish (max 10s timeout)
      const startWait = Date.now();
      while (processingRef.current && Date.now() - startWait < 10_000) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (processingRef.current) return; // timeout — give up
      processingRef.current = true;
      setIsProcessing(true);

      try {
        setProcessingStage("analyzing");
        const history = currentMessages
          .filter((m) => m.id !== msgId)
          .map((m) => ({ sender: m.sender, text: m.text }));

        let result: AnalysisResult;
        try {
          setProcessingStage("moderating");
          const res = await fetch("/api/moderate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              history,
              mode: "moderate",
              strictness: currentSettings.strictness,
            }),
          });
          if (!res.ok) throw new Error("API error");
          const data = await res.json();
          result = {
            messageId: msgId,
            moderation: {
              scores: {
                toxicity: data.toxicity ?? 0,
                insult: data.insult ?? 0,
                threat: data.threat ?? 0,
                profanity: data.profanity ?? 0,
                identityAttack: data.identity_attack ?? 0,
              },
              action: data.action ?? "allow",
              suggestion: data.suggestion ?? "",
              flagged: data.flagged ?? false,
            },
            sentiment: data.sentiment ?? { score: 50, label: "Neutral" },
            smartReplies: (data.smart_replies ?? []).map((t: string) => ({
              text: t,
            })),
            contextualSummary: data.contextualSummary ?? "",
            latencyMs: data.latencyMs ?? 0,
            timestamp: new Date(),
          };
        } catch {
          // Fallback to client-side
          setProcessingStage("generating");
          const fallback = buildFullAnalysis(
            text,
            history,
            currentSettings.strictness
          );
          result = {
            messageId: msgId,
            moderation: {
              scores: {
                toxicity: fallback.toxicity,
                insult: fallback.insult,
                threat: fallback.threat,
                profanity: fallback.profanity,
                identityAttack: fallback.identity_attack,
              },
              action: fallback.action,
              suggestion: fallback.suggestion,
              flagged: fallback.flagged,
            },
            sentiment: {
              score: fallback.sentiment.score,
              label: fallback.sentiment.label as "Positive" | "Neutral" | "Negative" | "Angry" | "Excited" | "Frustrated",
            },
            smartReplies: fallback.smart_replies.map((t) => ({ text: t })),
            contextualSummary: fallback.contextualSummary,
            latencyMs: fallback.latencyMs,
            timestamp: new Date(),
          };
        }

        setProcessingStage("complete");

        setAnalyses((prev) => ({ ...prev, [msgId]: result }));

        // Update message status
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId
              ? {
                  ...m,
                  status: result.moderation.flagged
                    ? ("flagged" as const)
                    : ("complete" as const),
                  toxicity: result.moderation.scores.toxicity,
                  sentiment: result.sentiment.score,
                  flagged: result.moderation.flagged,
                }
              : m
          )
        );

        // Update analytics
        const idx = currentMessages.findIndex((m) => m.id === msgId);
        if (idx >= 0) {
          setAnalytics((prev) => [
            ...prev,
            {
              messageIndex: idx + 1,
              toxicity: result.moderation.scores.toxicity * 100,
              sentiment: result.sentiment.score,
              health: Math.max(
                0,
                100 -
                  result.moderation.scores.toxicity * 100 +
                  result.sentiment.score / 2
              ),
              label: currentMessages.find((m) => m.id === msgId)?.sender ?? "",
            },
          ]);
        }

        // Regenerate insights
        const updatedMessages = currentMessages.map((m) =>
          m.id === msgId
            ? {
                ...m,
                status: result.moderation.flagged
                  ? ("flagged" as const)
                  : ("complete" as const),
              }
            : m
        );
        setAnalyses((prev) => {
          const newAnalyses = { ...prev, [msgId]: result };
          setInsights(generateInsights(updatedMessages, newAnalyses));
          setSummary(generateSummary(updatedMessages, newAnalyses));
          setTimeline(generateTimeline(updatedMessages, newAnalyses));
          return newAnalyses;
        });

        // Auto-reply for user messages
        // If the user sent a toxic message "anyway" (Send Anyway),
        // the bot replies from a human receiver's POV — acknowledging but asking for civility.
        // If they applied the suggestion or sent edited version, reply normally.
        const wasToxic = sentToxicAnywayRef.current;
        sentToxicAnywayRef.current = false; // reset for next message

        // Use pre-generated bot reply if available (from parallel pipeline)
        // Only for non-blocked messages to avoid generating duplicate replies
        console.log("analyzeAndUpdate: preGeneratedBotReply =", !!preGeneratedBotReply, "action =", result.moderation.action);
        if (result.moderation.action !== "block" && preGeneratedBotReply) {
          // Display the pre-generated bot reply immediately
          console.log("Using pre-generated bot reply:", preGeneratedBotReply.substring(0, 50));
          const botMsg: PlaygroundMessage = {
            id: generateId(),
            text: preGeneratedBotReply,
            role: "assistant",
            sender: "Assistant",
            timestamp: new Date(),
            status: "complete",
            isUser: false,
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsReplying(false);
          setProcessingStage("idle");
        } else if (result.moderation.action !== "block") {
          generateBotReply(text, currentMessages, wasToxic);
        } else {
          toast.error("Message blocked — high toxicity detected", {
            description: `Score: ${Math.round(result.moderation.scores.toxicity * 100)}%`,
          });
          // Message appeared in chat but was blocked — reply from receiver's POV
          generateBotReply(text, currentMessages, true);
        }
      } finally {
        setIsProcessing(false);
        setProcessingStage("idle");
        processingRef.current = false;
      }
    },
    [generateBotReply]
  );

  /**
   * Score a message's toxicity via the server and decide whether to let it
   * through or gate it behind the safety dialog.
   */
  const scoreAndDecide = useCallback(
    async (text: string): Promise<{ action: "allow" | "warn" | "block"; toxicity: number }> => {
      try {
        const res = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            mode: "moderate",
            strictness: settings.strictness,
          }),
        });
        if (!res.ok) throw new Error("API error");
        const data = (await res.json()) as { action?: string; toxicity?: number };
        return {
          action: (data.action as "allow" | "warn" | "block") ?? "allow",
          toxicity: data.toxicity ?? 0,
        };
      } catch {
        // Fallback to client-side mock
        const fallback = buildFullAnalysis(text, [], settings.strictness);
        return {
          action: fallback.action,
          toxicity: fallback.toxicity,
        };
      }
    },
    [settings.strictness]
  );

  /**
   * Fetch the LLM safe-rewrite suggestion for the pending message.
   */
  const loadSafetySuggestion = useCallback(async (text: string) => {
    setIsSafetyLoading(true);
    try {
      const res = await fetch("/api/safety-suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("suggestion API error");
      const data = (await res.json()) as { suggestion?: string };
      if (!data.suggestion) throw new Error("empty suggestion");
      setSafetySuggestion(data.suggestion);
    } catch {
      // Fallback to static mock suggestion
      const mock = buildFullAnalysis(text, [], 50);
      setSafetySuggestion(mock.suggestion);
    } finally {
      setIsSafetyLoading(false);
    }
  }, []);

  /**
   * Send a message with parallel toxicity check and LLM response generation.
   *
   * Flow:
   * 1. Start Perspective API call (toxicity check)
   * 2. Start OpenRouter API call (generate bot reply) - but DON'T display yet
   * 3. Wait for toxicity check result
   * 4a. If NOT toxic: show user message + bot reply
   * 4b. If TOXIC: show SafetyDialog with pre-generated reply options
   */
  const sendMessage = useCallback(
    async (text: string, role: PlaygroundMessage["role"] = "user") => {
      console.log("sendMessage called:", text.substring(0, 40));

      // Guard against duplicate message sending
      if (sendMessageProcessingRef.current === text) {
        console.log("sendMessage blocked - already processing:", text.substring(0, 40));
        return;
      }
      sendMessageProcessingRef.current = text;

      try {
        // Generate conversation history for both API calls
        const chatHistory = messages
          .filter((m) => m.role !== "system")
          .map((m) => ({ sender: m.sender, text: m.text }));

        // Start both pipelines in parallel
        const toxicityPromise = scoreAndDecide(text);
        const botReplyPromise = (async () => {
          try {
            const res = await fetch("/api/chat", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text, history: chatHistory }),
            });
            if (!res.ok) throw new Error("chat API error");
            const data = (await res.json()) as { reply?: string };
            if (!data.reply) throw new Error("empty reply");
            return data.reply;
          } catch {
            // Fallback to mock
            return generateHumanLikeResponse(text);
          }
        })();

        // Wait for toxicity check first
        const { action, toxicity } = await toxicityPromise;

        if (action === "allow") {
          // Safe message: show user message + bot reply immediately
          const id = generateId();
          const newMsg: PlaygroundMessage = {
            id,
            text,
            role,
            sender: SENDER_MAP[role] ?? "User",
            timestamp: new Date(),
            status: "analyzing",
            isUser: role === "user",
          };
          // Guard: skip if already scheduled for analysis (handles StrictMode double-invoke)
          // Check BEFORE setMessages to catch duplicate calls
          if (analyzedIdsRef.current.has(id)) return;
          analyzedIdsRef.current.add(id);

          // Store and display the pre-generated bot reply
          const botReply = await botReplyPromise;
          pendingBotReplyRef.current = botReply;

          setMessages((prev) => {
            const updated = [...prev, newMsg];
            // Use a different approach: set a flag that we'll check in useEffect
            // This avoids duplicate setTimeout calls from StrictMode double-invocation
            return updated;
          });
          // After setMessages, run the analysis in a way that avoids duplicates
          // Note: analyzeAndUpdate has its own guard, but we need to ensure it only runs once
          // Use a ref to track which IDs we've already triggered
          if (!triggeredAnalysisIdsRef.current.has(id)) {
            triggeredAnalysisIdsRef.current.add(id);
            setTimeout(
              () => analyzeAndUpdate(id, text, [...messages, newMsg], settings, botReply),
              0
            );
          }
          return;
        }

        // Toxic message: open safety dialog
        // Store the pre-generated bot reply for later use
        const botReply = await botReplyPromise;
        pendingBotReplyRef.current = botReply;

        setPendingMessage(text);
        setPendingEdit(text);
        setSafetySuggestion(null);
        setSafetyOpen(true);
        loadSafetySuggestion(text);
      } finally {
        sendMessageProcessingRef.current = null;
      }
    },
    [scoreAndDecide, analyzeAndUpdate, settings, loadSafetySuggestion, messages]
  );

  /**
   * User picked one of the safety options — append the chosen text,
   * close the dialog, and run analysis + auto-reply.
   *
   * ERS score behavior:
   * - "force" (Send Anyway): ERS penalty applied (wasToxic = true)
   * - "manual" (Send Edited): No ERS penalty (wasToxic = false)
   * - "suggested" (Apply Suggestion): No ERS penalty (wasToxic = false)
   */
  const handleSafetyConfirm = useCallback(
    (action: SafetyAction) => {
      if (!pendingMessage) return;

      const finalText =
        action === "force"
          ? pendingMessage
          : action === "suggested"
            ? safetySuggestion ?? pendingMessage
            : pendingEdit;

      if (!finalText.trim()) return;

      // Determine if this should trigger a toxic reply tone from the bot
      // Only "force" (Send Anyway) triggers the receiver's toxic response
      const wasToxicAnyway = action === "force";
      sentToxicAnywayRef.current = wasToxicAnyway;

      // Apply ERS penalty if "Send Anyway" was selected
      if (action === "force") {
        // ERS starts at 0 and increases with toxic messages "anyway"
        // Maximum ERS is 100 (high risk)
        setErsScore((prev) => Math.min(100, prev + 20));
      }

      setSafetyOpen(false);
      setPendingMessage(null);
      setSafetySuggestion(null);
      setPendingEdit("");

      const id = generateId();
      const newMsg: PlaygroundMessage = {
        id,
        text: finalText,
        role: "user",
        sender: "User A",
        timestamp: new Date(),
        status: "analyzing",
        isUser: true,
      };
      // Guard: skip if analysis already scheduled for this id (StrictMode double-invoke)
      if (analyzedIdsRef.current.has(id)) return;
      analyzedIdsRef.current.add(id);

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        return updated;
      });
      // After setMessages, run the analysis in a way that avoids duplicates
      const preGeneratedBotReply = pendingBotReplyRef.current;
      pendingBotReplyRef.current = null; // clear for next message
      // Guard against StrictMode double-invocation
      if (!triggeredAnalysisIdsRef.current.has(id)) {
        triggeredAnalysisIdsRef.current.add(id);
        setTimeout(
          () => analyzeAndUpdate(id, finalText, [...messages, newMsg], settings, preGeneratedBotReply ?? undefined),
          0
        );
      }
    },
    [pendingMessage, safetySuggestion, pendingEdit, analyzeAndUpdate, settings]
  );

  const loadScenario = useCallback(
    (scenario: PresetScenario) => {
      clearScenarioTimers();
      clear();
      setMessages([]);
      setAnalyses({});
      setAnalytics([]);
      setInsights([]);
      setActiveScenario(scenario.id);

      const newMessages: PlaygroundMessage[] = scenario.messages.map((m) => ({
        ...m,
        id: generateId(),
        timestamp: new Date(),
        status: "analyzing" as const,
      }));

      setMessages(newMessages);
      toast.success(`Loaded: ${scenario.name}`);

      // Analyze messages sequentially, but wait for the previous analysis to
      // finish before starting the next. The processingRef lock inside
      // analyzeAndUpdate would otherwise cause concurrent calls to silently
      // no-op, leaving later messages stuck in "analyzing..." forever.
      let chain = Promise.resolve();
      newMessages.forEach((msg, i) => {
        chain = chain.then(
          () =>
            new Promise<void>((resolve) => {
              const timer = setTimeout(async () => {
                // Guard: skip if analysis already scheduled (StrictMode double-invoke)
                if (analyzedIdsRef.current.has(msg.id)) {
                  resolve();
                  return;
                }
                analyzedIdsRef.current.add(msg.id);
                // Wait for any in-flight analysis to finish before starting.
                while (processingRef.current) {
                  await new Promise((r) => setTimeout(r, 50));
                }
                await analyzeAndUpdate(
                  msg.id,
                  msg.text,
                  newMessages.slice(0, i + 1),
                  settings
                );
                resolve();
              }, i === 0 ? 0 : 300);
              scenarioTimersRef.current.push(timer);
            })
        );
      });
    },
    [clear, analyzeAndUpdate, settings, clearScenarioTimers]
  );

  const resetSession = useCallback(() => {
    clearScenarioTimers();
    clear();
    setMessages([]);
    setAnalyses({});
    setAnalytics([]);
    setInsights([]);
    setActiveScenario(null);
    setSummary({ executive: "", keyPoints: [], takeaways: [] });
    setTimeline([]);
    setSettings(DEFAULT_SETTINGS);
    setIsReplying(false);
    setSafetyOpen(false);
    setPendingMessage(null);
    setSafetySuggestion(null);
    setPendingEdit("");
    setIsSafetyLoading(false);
    setErsScore(100);
    sentToxicAnywayRef.current = false;
    pendingBotReplyRef.current = null;
    sendMessageProcessingRef.current = null;
    toast.info("Session reset");
  }, [clear, clearScenarioTimers]);

  const exportSessionData = useCallback((): string => {
    const data = {
      messages: sessionRef.current.messages.map((m) => ({
        ...m,
        timestamp: m.timestamp.toISOString(),
      })),
      analyses: sessionRef.current.analysisResults,
      analytics: sessionRef.current.analytics,
      insights: sessionRef.current.insights,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }, []);

  const exportReportData = useCallback((): string => {
    const { executive, keyPoints, takeaways } = summary;
    const lines = [
      "# Emphra Playground Analysis Report",
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "## Executive Summary",
      executive,
      "",
      "## Key Points",
      ...keyPoints.map((p) => `- ${p}`),
      "",
      "## Actionable Takeaways",
      ...takeaways.map((t) => `- ${t}`),
      "",
      "## Conversation",
      ...sessionRef.current.messages.map((m) => `[${m.sender}] ${m.text}`),
    ];
    return lines.join("\n");
  }, [summary]);

  return {
    messages,
    analyses,
    activeTab,
    setActiveTab,
    isProcessing,
    isReplying,
    processingStage,
    analytics,
    insights,
    settings,
    setSettings,
    activeScenario,
    summary,
    timeline,
    sendMessage,
    handleSafetyConfirm,
    loadScenario,
    resetSession,
    clearSession: clear,
    exportSessionData,
    exportReportData,
    // Safety dialog
    safetyOpen,
    setSafetyOpen,
    pendingMessage,
    pendingEdit,
    setPendingEdit,
    safetySuggestion,
    isSafetyLoading,
    ersScore,
  };
}
