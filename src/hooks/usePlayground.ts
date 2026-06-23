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
import { buildFullAnalysis } from "@/lib/mock-api";
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

  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, AnalysisResult>>({});
  const [activeTab, setActiveTab] = useState<TabId>("moderation");
  const [isProcessing, setIsProcessing] = useState(false);
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

  const sessionRef = useRef({
    messages: [] as PlaygroundMessage[],
    analysisResults: {} as Record<string, AnalysisResult>,
    analytics: [] as AnalyticsDataPoint[],
    insights: [] as Insight[],
    settings: DEFAULT_SETTINGS,
    activeScenario: null as string | null,
  });
  const processingRef = useRef(false);

  // Persist on change
  useEffect(() => {
    sessionRef.current = {
      messages,
      analysisResults: analyses,
      analytics,
      insights,
      settings,
      activeScenario,
    };
    save(sessionRef.current);
  }, [messages, analyses, analytics, insights, settings, activeScenario, save]);

  // Load from URL on mount
  useEffect(() => {
    const scenarioId = decodeUrl();
    if (scenarioId) {
      setActiveScenario(scenarioId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeAndUpdate = useCallback(
    async (
      msgId: string,
      text: string,
      currentMessages: PlaygroundMessage[],
      currentSettings: PlaygroundSettings
    ) => {
      if (processingRef.current) return;
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
              label: fallback.sentiment.label,
            },
            smartReplies: fallback.smartReplies.map((t) => ({ text: t })),
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
        const newAnalyses = { ...analyses, [msgId]: result };
        setInsights(generateInsights(updatedMessages, newAnalyses));
        setSummary(generateSummary(updatedMessages, newAnalyses));
        setTimeline(generateTimeline(updatedMessages, newAnalyses));

        if (result.moderation.action === "block") {
          toast.error("Message blocked — high toxicity detected", {
            description: `Score: ${Math.round(result.moderation.scores.toxicity * 100)}%`,
          });
        }
      } finally {
        setIsProcessing(false);
        setProcessingStage("idle");
        processingRef.current = false;
      }
    },
    [analyses]
  );

  const sendMessage = useCallback(
    async (
      text: string,
      role: PlaygroundMessage["role"] = "user"
    ) => {
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

      setMessages((prev) => {
        const updated = [...prev, newMsg];
        setTimeout(
          () => analyzeAndUpdate(id, text, updated, settings),
          0
        );
        return updated;
      });
    },
    [analyzeAndUpdate, settings]
  );

  const loadScenario = useCallback(
    (scenario: PresetScenario) => {
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

      // Analyze each message sequentially
      newMessages.forEach((msg, i) => {
        setTimeout(() => {
          analyzeAndUpdate(
            msg.id,
            msg.text,
            newMessages.slice(0, i + 1),
            settings
          );
        }, i * 300);
      });
    },
    [clear, analyzeAndUpdate, settings]
  );

  const resetSession = useCallback(() => {
    clear();
    setMessages([]);
    setAnalyses({});
    setAnalytics([]);
    setInsights([]);
    setActiveScenario(null);
    setSummary({ executive: "", keyPoints: [], takeaways: [] });
    setTimeline([]);
    setSettings(DEFAULT_SETTINGS);
    toast.info("Session reset");
  }, [clear]);

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
    processingStage,
    analytics,
    insights,
    settings,
    setSettings,
    activeScenario,
    summary,
    timeline,
    sendMessage,
    loadScenario,
    resetSession,
    exportSessionData,
    exportReportData,
  };
}
