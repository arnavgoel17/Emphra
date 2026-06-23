# Emphra Interactive Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Emphra Interactive Playground — a premium, enterprise-grade conversation analysis experience at `/demo` with zero external costs.

**Architecture:** Client-side React state management via `usePlayground` hook, backed by a local TypeScript moderation engine served through `/api/moderate`. 15 new components, 3 hooks, 2 lib files, 1 type file. All payment-free.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion 12, shadcn/ui, Recharts 3, Lucide React, Sonner

## Global Constraints

- **Zero-cost:** No paid external APIs. Everything uses local TypeScript or open-source libraries.
- **Design system:** Liquid Obsidian palette (`oklch` colors), glass surfaces (`backdrop-blur-xl`, `bg-white/[0.03-0.06]`), gold primary (`oklch(0.72 0.08 85)`)
- **Fonts:** Space Grotesk (headings), Inter (body), Geist Mono (data)
- **Component style:** `"use client"` on all interactive components. Use `cn()` from `@/lib/utils` for class merging.
- **Animation:** Framer Motion with `cubic-bezier(0.16, 1, 0.3, 1)` easing. Support `prefers-reduced-motion`.
- **Accessibility:** All interactive elements have `aria-label`, visible focus rings, keyboard navigable.
- **File convention:** New components go in `src/components/playground/`. Hooks in `src/hooks/`. Types in `src/types/`.
- **Naming:** PascalCase for components, camelCase for hooks/utils, `kebab-case` for file names when needed.
- **Each task ends with a commit.** Tests where applicable.

---

## Phase 1: Foundation — Types, Lib, Backend

### Task 1: Playground Types

**Files:**
- Create: `src/types/playground.ts`

**Interfaces:**
- Produces: `PlaygroundMessage`, `AnalysisResult`, `AnalyticsDataPoint`, `PlaygroundSettings`, `TabId`, `ProcessingStage`, `PresetScenario`, `ConversationRole`, `ExportFormat` — all consumed by every subsequent task.

- [ ] **Step 1: Create `src/types/playground.ts` with all playground types**

```typescript
export type ConversationRole = "user" | "system" | "assistant" | "moderator";

export type MessageStatus = "sending" | "analyzing" | "complete" | "flagged" | "blocked";

export interface PlaygroundMessage {
  id: string;
  text: string;
  role: ConversationRole;
  sender: string;
  timestamp: Date;
  status: MessageStatus;
  toxicity?: number;
  sentiment?: number;
  flagged?: boolean;
  isUser: boolean;
}

export type TabId = "moderation" | "sentiment" | "insights" | "summary" | "apiResponse" | "trustSafety";

export type ProcessingStage = "idle" | "analyzing" | "moderating" | "generating" | "complete";

export interface ModerationScores {
  toxicity: number;
  insult: number;
  threat: number;
  profanity: number;
  identityAttack: number;
}

export interface ModerationResult {
  scores: ModerationScores;
  action: "allow" | "warn" | "block";
  suggestion: string;
  flagged: boolean;
}

export interface SentimentResult {
  score: number;
  label: "Positive" | "Neutral" | "Negative" | "Angry" | "Excited" | "Frustrated";
}

export interface SmartReply {
  text: string;
}

export interface AnalysisResult {
  messageId: string;
  moderation: ModerationResult;
  sentiment: SentimentResult;
  smartReplies: SmartReply[];
  contextualSummary: string;
  latencyMs: number;
  timestamp: Date;
}

export interface AnalyticsDataPoint {
  messageIndex: number;
  toxicity: number;
  sentiment: number;
  health: number;
  label: string;
}

export interface Insight {
  id: string;
  text: string;
  type: "warning" | "info" | "danger" | "success";
  timestamp: Date;
  messageIndex?: number;
}

export interface TrustSafetyData {
  riskScore: number;
  safetyScore: number;
  recommendation: string;
  complianceItems: { label: string; status: "pass" | "warn" | "fail" }[];
}

export interface PlaygroundSettings {
  strictness: number;
  spamDetection: boolean;
  toxicityDetection: boolean;
  smartReplies: boolean;
  autoSummary: boolean;
  sentiment: boolean;
  memory: boolean;
  language: string;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  messages: Omit<PlaygroundMessage, "id" | "timestamp" | "status">[];
}

export interface SessionData {
  messages: PlaygroundMessage[];
  analysisResults: Record<string, AnalysisResult>;
  analytics: AnalyticsDataPoint[];
  insights: Insight[];
  settings: PlaygroundSettings;
  activeScenario: string | null;
}

export type ExportFormat = "json" | "report";
```

- [ ] **Step 2: Commit**

```bash
git add src/types/playground.ts
git commit -m "feat(playground): add playground type definitions"
```

---

### Task 2: Enhanced Mock API Engine

**Files:**
- Modify: `src/lib/mock-api.ts`

**Interfaces:**
- Consumes: Existing `Message` type from `@/types` (keep for `/api/moderate` backward compat)
- Produces: `analyzeConversationHealth()`, `detectSpam()`, `detectScam()`, `generateSmartReplies()`, `moderateContent()`, `analyzeSentiment()`, `generateHumanLikeResponse()`, `buildFullAnalysis()` — used by `/api/moderate` route.

- [ ] **Step 1: Run existing tests to ensure baseline passes**

Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Enhance `src/lib/mock-api.ts` with richer analysis functions**

Replace the existing file with an enhanced version that exports:
- `moderateContent(text, strictness)` — existing, keep as-is
- `analyzeSentiment(text)` — existing, return `{ score: 0-100, label }` with labels: "Positive", "Neutral", "Negative", "Angry", "Excited", "Frustrated"
- `generateSmartReplies(text)` — existing, keep as-is
- `generateHumanLikeResponse(text)` — existing, keep as-is
- `analyzeConversationHealth(messages)` — NEW: returns 0-100 health score based on toxicity, sentiment, and message patterns
- `detectSpam(text)` — existing from current file
- `detectScam(text)` — existing from current file
- `buildFullAnalysis(text, history, strictness)` — NEW: combines all analyses into a single result object matching the API response shape

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/mock-api.ts
git commit -m "feat(lib): enhance mock-api with conversation health analysis"
```

---

### Task 3: Insights Engine

**Files:**
- Create: `src/lib/insights-engine.ts`

**Interfaces:**
- Consumes: `PlaygroundMessage`, `AnalysisResult`, `Insight` from `@/types/playground`
- Produces: `generateInsights()`, `generateSummary()`, `generateTimeline()` — used by `usePlayground` hook.

- [ ] **Step 1: Create `src/lib/insights-engine.ts`**

The insights engine analyzes conversation patterns and generates human-readable observations.

```typescript
import { PlaygroundMessage, AnalysisResult, Insight } from "@/types/playground";

export function generateInsights(
  messages: PlaygroundMessage[],
  analyses: Record<string, AnalysisResult>
): Insight[] {
  const insights: Insight[] = [];
  const msgs = [...messages];
  
  // Detect escalation: 3+ consecutive increasing toxicity
  let escalationStart = -1;
  for (let i = 0; i < msgs.length; i++) {
    const analysis = analyses[msgs[i].id];
    if (!analysis) continue;
    const prev = i > 0 ? analyses[msgs[i - 1].id] : null;
    if (prev && analysis.moderation.scores.toxicity > prev.moderation.scores.toxicity + 0.2) {
      if (escalationStart < 0) escalationStart = i - 1;
    } else if (escalationStart >= 0 && i - escalationStart >= 2) {
      insights.push({
        id: `escalation-${escalationStart}`,
        text: `Conversation tone became increasingly hostile after message ${escalationStart + 1}.`,
        type: "warning",
        timestamp: new Date(),
        messageIndex: escalationStart,
      });
      escalationStart = -1;
    } else {
      escalationStart = -1;
    }
  }

  // Detect harassment pattern
  const toxicCount = msgs.filter(m => analyses[m.id]?.moderation.flagged).length;
  if (toxicCount >= 2) {
    insights.push({
      id: "harassment-pattern",
      text: "Potential harassment detected — multiple flagged messages in sequence.",
      type: "danger",
      timestamp: new Date(),
    });
  }

  // Detect sentiment drop
  const sentiments = msgs.map(m => analyses[m.id]?.sentiment.score ?? 50);
  if (sentiments.length >= 3) {
    const firstHalf = sentiments.slice(0, Math.floor(sentiments.length / 2));
    const secondHalf = sentiments.slice(Math.floor(sentiments.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    if (avgFirst - avgSecond > 20) {
      insights.push({
        id: "sentiment-drop",
        text: `Conversation mood declined significantly — sentiment dropped from ${Math.round(avgFirst)} to ${Math.round(avgSecond)}.`,
        type: "warning",
        timestamp: new Date(),
      });
    }
  }

  // Detect scams
  const scamMsgs = msgs.filter(m => {
    const t = m.text.toLowerCase();
    return t.includes("bank") || t.includes("password") || t.includes("otp") || t.includes("seed phrase");
  });
  if (scamMsgs.length > 0) {
    insights.push({
      id: "scam-detected",
      text: "Potential scam attempt — sensitive information requested.",
      type: "danger",
      timestamp: new Date(),
    });
  }

  // Positive note for clean conversations
  if (msgs.length >= 3 && toxicCount === 0) {
    insights.push({
      id: "clean-conversation",
      text: "Conversation remains respectful and within community guidelines.",
      type: "success",
      timestamp: new Date(),
    });
  }

  // Escalation risk
  const highToxic = msgs.filter(m => (analyses[m.id]?.moderation.scores.toxicity ?? 0) > 0.6);
  if (highToxic.length > 0) {
    insights.push({
      id: "escalation-risk",
      text: "Escalation risk increased — consider moderator intervention.",
      type: "warning",
      timestamp: new Date(),
    });
  }

  return insights;
}

export function generateSummary(
  messages: PlaygroundMessage[],
  analyses: Record<string, AnalysisResult>
): { executive: string; keyPoints: string[]; takeaways: string[] } {
  const totalMessages = messages.length;
  const flaggedMessages = messages.filter(m => analyses[m.id]?.moderation.flagged);
  const avgSentiment = messages.reduce((sum, m) => sum + (analyses[m.id]?.sentiment.score ?? 50), 0) / Math.max(totalMessages, 1);
  const avgToxicity = messages.reduce((sum, m) => sum + (analyses[m.id]?.moderation.scores.toxicity ?? 0), 0) / Math.max(totalMessages, 1);

  let toneDescription = "neutral";
  if (avgSentiment > 70) toneDescription = "positive and constructive";
  else if (avgSentiment < 30) toneDescription = "tense and negative";
  else if (avgToxicity > 0.4) toneDescription = "concerning with elevated toxicity";

  const executive = `This ${totalMessageMessage}-message conversation maintains a generally ${toneDescription} tone. ${flaggedMessages.length > 0 ? `${flaggedMessages.length} message${flaggedMessages.length > 1 ? 's were' : ' was'} flagged for review.` : 'No messages required moderation action.'} Average sentiment: ${Math.round(avgSentiment)}/100. Average toxicity: ${Math.round(avgToxicity * 100)}%.`;

  const keyPoints: string[] = [];
  if (totalMessages > 0) keyPoints.push(`${totalMessages} messages exchanged between ${new Set(messages.map(m => m.sender)).size} participants.`);
  if (flaggedMessages.length > 0) keyPoints.push(`${flaggedMessages.length} message${flaggedMessages.length > 1 ? 's' : ''} flagged for moderation.`);
  const blockedCount = messages.filter(m => analyses[m.id]?.moderation.action === "block").length;
  if (blockedCount > 0) keyPoints.push(`${blockedCount} message${blockedCount > 1 ? 's' : ''} blocked.`);
  keyPoints.push(`Overall sentiment: ${avgSentiment > 60 ? "positive" : avgSentiment < 40 ? "negative" : "mixed"}.`);
  if (messages.length >= 2) {
    const roles = new Set(messages.map(m => m.role));
    keyPoints.push(`Involves ${roles.size} role${roles.size > 1 ? 's' : ''}: ${Array.from(roles).join(", ").toLowerCase()}.`);
  }

  const takeaways: string[] = [];
  if (avgToxicity > 0.3) takeaways.push("Consider enabling stricter moderation for this channel.");
  if (avgSentiment < 40) takeaways.push("User satisfaction may be impacted — consider proactive outreach.");
  if (flaggedMessages.length === 0) takeaways.push("Conversation is healthy — no intervention needed.");
  else takeaways.push("Review flagged messages for policy compliance.");

  return { executive, keyPoints, takeaways };
}

export function generateTimeline(
  messages: PlaygroundMessage[],
  analyses: Record<string, AnalysisResult>
): { index: number; preview: string; action: string; time: string }[] {
  return messages.map((m, i) => ({
    index: i + 1,
    preview: m.text.length > 40 ? m.text.substring(0, 40) + "…" : m.text,
    action: analyses[m.id]?.moderation.action ?? "allow",
    time: m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }));
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/insights-engine.ts
git commit -m "feat(lib): add insights engine for smart observations"
```

---

### Task 4: Enhanced API Route

**Files:**
- Modify: `src/app/api/moderate/route.ts`

**Interfaces:**
- Consumes: `buildFullAnalysis()` from `@/lib/mock-api`
- Produces: Enhanced API response with moderation scores, sentiment, smart_replies, contextualSummary

- [ ] **Step 1: Rewrite `/api/moderate` route to use `buildFullAnalysis`**

The route should:
1. Rate limit (existing in-memory limiter)
2. Parse `{ text, history, mode }` from body
3. If `mode === "chat"`, return `{ reply: generateHumanLikeResponse(text) }`
4. Otherwise, call `buildFullAnalysis(text, history, strictness)` and return the combined result
5. Measure actual processing time and include as `latencyMs` in response

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Test the API route**

Run: `npm run dev` then in another terminal:
```bash
curl -s -X POST http://localhost:3000/api/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, how are you?"}' | head -c 500
```
Expected: JSON response with moderation scores and action "allow"

- [ ] **Step 4: Commit**

```bash
git add src/app/api/moderate/route.ts
git commit -m "feat(api): enhance moderation route with full analysis response"
```

---

## Phase 2: Hooks — State Management

### Task 5: Session Persistence Hook

**Files:**
- Create: `src/hooks/useSessionPersistence.ts`

**Interfaces:**
- Consumes: `SessionData` from `@/types/playground`
- Produces: `useSessionPersistence` hook — used by `usePlayground`

- [ ] **Step 1: Create `src/hooks/useSessionPersistence.ts`**

```typescript
import { useCallback, useRef } from "react";
import { SessionData, PlaygroundMessage } from "@/types/playground";

const STORAGE_KEY = "emphra-playground-session";
const SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface StoredSession {
  data: SessionData;
  savedAt: number;
}

function serializeMessages(messages: PlaygroundMessage[]): PlaygroundMessage[] {
  return messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })) as any;
}

function deserializeMessages(messages: any[]): PlaygroundMessage[] {
  return messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
}

export function useSessionPersistence() {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const save = useCallback((session: SessionData) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const storable: StoredSession = {
          data: { ...session, messages: serializeMessages(session.messages) as any },
          savedAt: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storable));
      } catch {
        // Storage full or unavailable — silent fail
      }
    }, 500);
  }, []);

  const load = useCallback((): SessionData | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const stored: StoredSession = JSON.parse(raw);
      if (Date.now() - stored.savedAt > SESSION_TTL) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return { ...stored.data, messages: deserializeMessages(stored.data.messages) };
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { save, load, clear };
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSessionPersistence.ts
git commit -m "feat(hooks): add session persistence with localStorage"
```

---

### Task 6: Shareable URL Hook

**Files:**
- Create: `src/hooks/useShareableUrl.ts`

**Interfaces:**
- Consumes: `PresetScenario` id from `@/types/playground`
- Produces: `useShareableUrl` hook — used by `usePlayground` and `PlaygroundShell`

- [ ] **Step 1: Create `src/hooks/useShareableUrl.ts`**

```typescript
import { useCallback } from "react";

export function useShareableUrl() {
  const encode = useCallback((scenarioId: string): string => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("scenario", scenarioId);
    return url.toString();
  }, []);

  const decode = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    return params.get("scenario");
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { encode, decode, copyToClipboard };
}
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useShareableUrl.ts
git commit -m "feat(hooks): add shareable URL support for scenarios"
```

---

### Task 7: Core Playground Hook

**Files:**
- Create: `src/hooks/usePlayground.ts`

**Interfaces:**
- Consumes: All types from `@/types/playground`, `useSessionPersistence`, `useShareableUrl`, `buildFullAnalysis` from `@/lib/mock-api`, `generateInsights`, `generateSummary`, `generateTimeline` from `@/lib/insights-engine`
- Produces: `usePlayground` hook — the central state manager used by all UI components

- [ ] **Step 1: Create `src/hooks/usePlayground.ts`**

This is the core hook. It manages all playground state: messages, analysis results, active tab, processing state, analytics, insights, settings, and provides actions (sendMessage, loadScenario, resetSession, exportSession).

The hook should:
1. Initialize from `useSessionPersistence.load()` or default state
2. On every state change, call `useSessionPersistence.save()` (debounced)
3. `sendMessage(text, role)`:
   - Create message with "analyzing" status
   - POST to `/api/moderate` with `{ text, history, mode: "moderate" }`
   - Update processing stages: "analyzing" → "moderating" → "generating" → "complete"
   - On response, update message status and store analysis
   - Regenerate insights, summary, timeline
   - Append analytics data point
   - If API fails, fall back to client-side `buildFullAnalysis`
4. `loadScenario(scenario)`: Clear messages, add all preset messages, analyze each
5. `resetSession()`: Clear everything, remove from localStorage
6. `exportSession()`: Return JSON string of session data
7. Handle URL scenario loading via `useShareableUrl`

```typescript
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
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
import { generateInsights, generateSummary, generateTimeline } from "@/lib/insights-engine";
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
  const [summary, setSummary] = useState({ executive: "", keyPoints: [] as string[], takeaways: [] as string[] });
  const [timeline, setTimeline] = useState<{ index: number; preview: string; action: string; time: string }[]>([]);

  const sessionRef = useRef({ messages: [] as PlaygroundMessage[], analysisResults: {} as Record<string, AnalysisResult>, analytics: [] as AnalyticsDataPoint[], insights: [] as Insight[], settings: DEFAULT_SETTINGS, activeScenario: null as string | null });
  const processingRef = useRef(false);

  // Persist on change
  useEffect(() => {
    sessionRef.current = { messages, analysisResults: analyses, analytics, insights, settings, activeScenario };
    save(sessionRef.current);
  }, [messages, analyses, analytics, insights, settings, activeScenario, save]);

  // Load from URL on mount
  useEffect(() => {
    const scenarioId = decodeUrl();
    if (scenarioId && typeof window !== "undefined") {
      // Will be loaded by PresetScenarios component
      setActiveScenario(scenarioId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const analyzeAndUpdate = useCallback(async (msgId: string, text: string, currentMessages: PlaygroundMessage[], currentSettings: PlaygroundSettings) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    try {
      setProcessingStage("analyzing");
      const history = currentMessages
        .filter(m => m.id !== msgId)
        .map(m => ({ sender: m.sender, text: m.text }));

      let result: AnalysisResult;
      try {
        setProcessingStage("moderating");
        const res = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, history, mode: "moderate" }),
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
          smartReplies: (data.smart_replies ?? []).map((t: string) => ({ text: t })),
          contextualSummary: data.contextualSummary ?? "",
          latencyMs: data.latencyMs ?? 0,
          timestamp: new Date(),
        };
      } catch {
        // Fallback to client-side
        setProcessingStage("generating");
        const fallback = buildFullAnalysis(text, history, currentSettings.strictness);
        result = {
          messageId: msgId,
          moderation: {
            scores: {
              toxicity: fallback.toxicity / 100,
              insult: 0,
              threat: 0,
              profanity: 0,
              identityAttack: 0,
            },
            action: fallback.action,
            suggestion: fallback.suggestion,
            flagged: fallback.action !== "allow",
          },
          sentiment: { score: fallback.sentiment.score, label: fallback.sentiment.label },
          smartReplies: fallback.smartReplies,
          contextualSummary: fallback.contextualSummary,
          latencyMs: 0,
          timestamp: new Date(),
        };
      }

      setProcessingStage("complete");

      setAnalyses(prev => ({ ...prev, [msgId]: result }));

      // Update message status
      setMessages(prev => prev.map(m =>
        m.id === msgId
          ? { ...m, status: result.moderation.flagged ? "flagged" as const : "complete" as const, toxicity: result.moderation.scores.toxicity, sentiment: result.sentiment.score, flagged: result.moderation.flagged }
          : m
      ));

      // Update analytics
      const idx = currentMessages.findIndex(m => m.id === msgId);
      if (idx >= 0) {
        setAnalytics(prev => [...prev, {
          messageIndex: idx + 1,
          toxicity: result.moderation.scores.toxicity * 100,
          sentiment: result.sentiment.score,
          health: Math.max(0, 100 - result.moderation.scores.toxicity * 100 + result.sentiment.score / 2),
          label: currentMessages.find(m => m.id === msgId)?.sender ?? "",
        }]);
      }

      // Regenerate insights
      const updatedMessages = currentMessages.map(m =>
        m.id === msgId ? { ...m, status: result.moderation.flagged ? "flagged" as const : "complete" as const } : m
      );
      const newAnalyses = { ...analyses, [msgId]: result };
      setInsights(generateInsights(updatedMessages, newAnalyses));
      setSummary(generateSummary(updatedMessages, newAnalyses));
      setTimeline(generateTimeline(updatedMessages, newAnalyses));

      if (result.moderation.action === "block") {
        toast.error("Message blocked — high toxicity detected", { description: `Score: ${Math.round(result.moderation.scores.toxicity * 100)}%` });
      }
    } finally {
      setIsProcessing(false);
      setProcessingStage("idle");
      processingRef.current = false;
    }
  }, [analyses]);

  const sendMessage = useCallback(async (text: string, role: PlaygroundMessage["role"] = "user") => {
    const id = generateId();
    const senderMap: Record<string, string> = { user: "User A", system: "System", assistant: "Assistant", moderator: "Moderator Bot" };
    const newMsg: PlaygroundMessage = {
      id,
      text,
      role,
      sender: senderMap[role] ?? "User",
      timestamp: new Date(),
      status: "analyzing",
      isUser: role === "user",
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      // Trigger analysis after state update
      setTimeout(() => analyzeAndUpdate(id, text, updated, settings), 0);
      return updated;
    });
  }, [analyzeAndUpdate, settings]);

  const loadScenario = useCallback((scenario: PresetScenario) => {
    clear();
    setMessages([]);
    setAnalyses({});
    setAnalytics([]);
    setInsights([]);
    setActiveScenario(scenario.id);

    const newMessages: PlaygroundMessage[] = scenario.messages.map(m => ({
      ...m,
      id: generateId(),
      timestamp: new Date(),
      status: "analyzing" as const,
    }));

    setMessages(newMessages);
    setActiveScenario(scenario.id);
    toast.success(`Loaded: ${scenario.name}`);

    // Analyze each message sequentially
    newMessages.forEach((msg, i) => {
      setTimeout(() => {
        analyzeAndUpdate(msg.id, msg.text, newMessages.slice(0, i + 1), settings);
      }, i * 300);
    });
  }, [clear, analyzeAndUpdate, settings]);

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
      messages: sessionRef.current.messages.map(m => ({ ...m, timestamp: m.timestamp.toISOString() })),
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
      ...keyPoints.map(p => `- ${p}`),
      "",
      "## Actionable Takeaways",
      ...takeaways.map(t => `- ${t}`),
      "",
      "## Conversation",
      ...sessionRef.current.messages.map(m => `[${m.sender}] ${m.text}`),
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
```

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/hooks/usePlayground.ts
git commit -m "feat(hooks): add core usePlayground state management hook"
```

---

## Phase 3: UI Components — Foundation

### Task 8: TopToolbar Component

**Files:**
- Create: `src/components/playground/TopToolbar.tsx`

**Interfaces:**
- Consumes: `SessionData` from `@/types/playground`, `useShareableUrl` hook
- Produces: `TopToolbar` component — used by `PlaygroundShell`

- [ ] **Step 1: Create `src/components/playground/TopToolbar.tsx`**

Premium toolbar with:
- Breadcrumb: `Home → Playground` (using shadcn Breadcrumb)
- Status indicators: green dot + "Online", "Global Edge", live latency
- Buttons: Reset Session, Load Example, Export JSON, Get API Access
- Liquid glass styling: `bg-white/[0.03] backdrop-blur-xl border-b border-white/[0.06]`
- Responsive: buttons collapse to icon-only on mobile

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/TopToolbar.tsx
git commit -m "feat(playground): add TopToolbar component"
```

---

### Task 9: Preset Scenarios Component

**Files:**
- Create: `src/components/playground/PresetScenarios.tsx`

**Interfaces:**
- Consumes: `PresetScenario` from `@/types/playground`
- Produces: `PresetScenarios` component — used by `ConversationSimulator`

- [ ] **Step 1: Create `src/components/playground/PresetScenarios.tsx`**

8 preset scenarios as defined in the spec. Each scenario is a chip/button. Active scenario highlighted with gold. Clicking loads the scenario via `onLoad(scenario)`.

Scenarios data defined inline in the component:
1. `friendly-discussion` — 4 polite messages
2. `heated-argument` — 5 escalating messages
3. `community-moderation` — 4 policy-violating messages
4. `scam-attempt` — 3 suspicious messages
5. `customer-support` — 4 professional messages
6. `gaming-lobby` — 6 mixed messages
7. `marketplace-negotiation` — 4 buying/selling messages
8. `group-chat` — 6 multi-participant messages

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/PresetScenarios.tsx
git commit -m "feat(playground): add PresetScenarios component with 8 scenarios"
```

---

### Task 10: Conversation Simulator Component

**Files:**
- Create: `src/components/playground/ConversationSimulator.tsx`

**Interfaces:**
- Consumes: `PlaygroundMessage`, `AnalysisResult`, `Insight` from `@/types/playground`
- Produces: `ConversationSimulator` component — used by `PlaygroundShell`

- [ ] **Step 1: Create `src/components/playground/ConversationSimulator.tsx`**

Left panel with:
- Message feed (ScrollArea): messages with role-based styling
  - User: right-aligned, gold-tinted
  - System: left-aligned, muted + "SYSTEM" badge
  - Assistant: left-aligned, purple-tinted
  - Moderator: left-aligned, blue-tinted + shield icon
  - Each message: role indicator, timestamp, content, status indicator
  - Flagged messages: red border + warning icon
  - Analyzing messages: pulsing gold border
  - Smooth entry animations (fade + slide up via Framer Motion)
  - Auto-scroll to latest
- Input area: textarea (auto-expand), send button, clear button
- Keyboard: Enter to send, Shift+Enter for newline
- Preset scenario chips below input

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/ConversationSimulator.tsx
git commit -m "feat(playground): add ConversationSimulator component"
```

---

### Task 11: Processing Animation Component

**Files:**
- Create: `src/components/playground/ProcessingAnimation.tsx`

**Interfaces:**
- Consumes: `ProcessingStage` from `@/types/playground`
- Produces: `ProcessingAnimation` component — used by `ConversationSimulator`

- [ ] **Step 1: Create `src/components/playground/ProcessingAnimation.tsx`**

Sequential stage indicator:
- "Analyzing..." → "Moderating..." → "Generating insights..." → "Complete"
- Each stage: 200-400ms with fade transitions
- Pulsing dot + label
- Only visible when `stage !== "idle"`

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/ProcessingAnimation.tsx
git commit -m "feat(playground): add ProcessingAnimation component"
```

---

### Task 12: Message Hover Card Component

**Files:**
- Create: `src/components/playground/MessageHoverCard.tsx`

**Interfaces:**
- Consumes: `PlaygroundMessage`, `AnalysisResult` from `@/types/playground`
- Produces: `MessageHoverCard` component — used by `ConversationSimulator`

- [ ] **Step 1: Create `src/components/playground/MessageHoverCard.tsx`**

Floating card on message hover:
- Toxicity score (mini progress bar)
- Sentiment score (mini gauge)
- Moderation decision badge
- Timestamp
- 150ms fade-in, follows cursor with offset
- Uses Framer Motion `AnimatePresence`

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/MessageHoverCard.tsx
git commit -m "feat(playground): add MessageHoverCard component"
```

---

## Phase 4: UI Components — Intelligence Panel

### Task 13: Intelligence Panel Container

**Files:**
- Create: `src/components/playground/IntelligencePanel.tsx`

**Interfaces:**
- Consumes: `TabId`, `AnalysisResult`, `AnalyticsDataPoint`, `Insight`, `PlaygroundMessage` from `@/types/playground`
- Produces: `IntelligencePanel` component — used by `PlaygroundShell`

- [ ] **Step 1: Create `src/components/playground/IntelligencePanel.tsx`**

Tab container with 6 tabs:
- Moderation (Shield icon)
- Sentiment (Activity icon)
- Insights (Brain icon)
- Summary (FileText icon)
- API Response (Terminal icon)
- Trust & Safety (Lock icon)

Active tab: gold underline with smooth slide animation. Tab content switches with fade transition. Each tab lazy-loaded.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/IntelligencePanel.tsx
git commit -m "feat(playground): add IntelligencePanel tab container"
```

---

### Task 14: Moderation Tab

**Files:**
- Create: `src/components/playground/ModerationTab.tsx`

**Interfaces:**
- Consumes: `AnalysisResult`, `AnalyticsDataPoint` from `@/types/playground`
- Produces: `ModerationTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/ModerationTab.tsx`**

- Circular gauge for overall score (SVG, animated)
- Category bars: Toxicity, Insult, Threat, Profanity, Identity Attack
  - Each: label, percentage, color-coded fill (green < 0.3, amber < 0.7, red ≥ 0.7)
- Action badge: Allow (green pill), Warn (amber pill), Block (red pill)
- Score history sparkline (mini area chart)
- Risk trend indicator (improving / stable / worsening with arrow icon)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/ModerationTab.tsx
git commit -m "feat(playground): add ModerationTab component"
```

---

### Task 15: Sentiment Tab

**Files:**
- Create: `src/components/playground/SentimentTab.tsx`

**Interfaces:**
- Consumes: `AnalysisResult`, `AnalyticsDataPoint` from `@/types/playground`
- Produces: `SentimentTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/SentimentTab.tsx`**

- Large sentiment gauge (SVG dial, 0-100)
- Emotional tone label with icon
- Sentiment trend chart (Recharts AreaChart, last 20 messages)
- Mood indicator with descriptive text

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/SentimentTab.tsx
git commit -m "feat(playground): add SentimentTab component"
```

---

### Task 16: Insights Tab

**Files:**
- Create: `src/components/playground/InsightsTab.tsx`

**Interfaces:**
- Consumes: `Insight` from `@/types/playground`
- Produces: `InsightsTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/InsightsTab.tsx`**

- Key observations list with icons per type (warning/info/danger/success)
- Notable patterns with timestamps
- Staggered entry animations
- Empty state: "Send messages to generate insights."

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/InsightsTab.tsx
git commit -m "feat(playground): add InsightsTab component"
```

---

### Task 17: Summary Tab

**Files:**
- Create: `src/components/playground/SummaryTab.tsx`

**Interfaces:**
- Consumes: Summary data from `usePlayground`
- Produces: `SummaryTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/SummaryTab.tsx`**

- Executive summary paragraph
- Key points (bullet list with gold dots)
- Actionable takeaways (numbered list)
- Conversation timeline (vertical timeline with message markers, color-coded by action)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/SummaryTab.tsx
git commit -m "feat(playground): add SummaryTab component"
```

---

### Task 18: API Response Tab

**Files:**
- Create: `src/components/playground/ApiResponseTab.tsx`

**Interfaces:**
- Consumes: `AnalysisResult` from `@/types/playground`
- Produces: `ApiResponseTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/ApiResponseTab.tsx`**

- Stripe Dashboard-style developer console
- Dark background (`bg-black/60`), monospace font
- HTTP status header: "200 OK" + latency
- Syntax-highlighted JSON (simple keyword coloring)
- Copy button (appears on hover)
- Line numbers
- Collapsible JSON sections

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/ApiResponseTab.tsx
git commit -m "feat(playground): add ApiResponseTab component"
```

---

### Task 19: Trust & Safety Tab

**Files:**
- Create: `src/components/playground/TrustSafetyTab.tsx`

**Interfaces:**
- Consumes: `AnalysisResult`, `AnalyticsDataPoint` from `@/types/playground`
- Produces: `TrustSafetyTab` component — used by `IntelligencePanel`

- [ ] **Step 1: Create `src/components/playground/TrustSafetyTab.tsx`**

- Risk score (large number, 0-100, color-coded)
- Safety score (circular progress ring)
- Moderation recommendation (text + icon)
- Compliance indicators: GDPR, SOC2, HIPAA (as badges with pass/warn/fail)
- Historical risk trend (mini area chart)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/TrustSafetyTab.tsx
git commit -m "feat(playground): add TrustSafetyTab component"
```

---

## Phase 5: Analytics + Export

### Task 20: Analytics Section

**Files:**
- Create: `src/components/playground/AnalyticsSection.tsx`

**Interfaces:**
- Consumes: `AnalyticsDataPoint` from `@/types/playground`
- Produces: `AnalyticsSection` component — used by `PlaygroundShell`

- [ ] **Step 1: Create `src/components/playground/AnalyticsSection.tsx`**

4 charts in a responsive grid:
1. **Toxicity Trend** — AreaChart, gold gradient, last 20 points
2. **Sentiment Trend** — AreaChart, purple gradient, last 20 points
3. **Conversation Health** — Custom gauge (circular progress), green/amber/red
4. **Message Distribution** — PieChart: Normal, Flagged, Reviewed, Blocked

Each chart in a glass panel with title and subtitle. Interactive tooltips. Empty state when no data.

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/AnalyticsSection.tsx
git commit -m "feat(playground): add AnalyticsSection with 4 charts"
```

---

### Task 21: Export Modal

**Files:**
- Create: `src/components/playground/ExportModal.tsx`

**Interfaces:**
- Consumes: `ExportFormat` from `@/types/playground`
- Produces: `ExportModal` component — used by `PlaygroundShell`

- [ ] **Step 1: Create `src/components/playground/ExportModal.tsx`**

Dialog with:
- Export as JSON button (downloads `.json` file)
- Export as Report button (downloads `.txt` file)
- Preview of what will be exported
- Copy to clipboard option
- Uses shadcn Dialog component

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/ExportModal.tsx
git commit -m "feat(playground): add ExportModal component"
```

---

## Phase 6: Shell + Page Integration

### Task 22: Playground Shell

**Files:**
- Create: `src/components/playground/PlaygroundShell.tsx`

**Interfaces:**
- Consumes: All components from Tasks 8-21, `usePlayground` hook
- Produces: `PlaygroundShell` component — used by the demo page

- [ ] **Step 1: Create `src/components/playground/PlaygroundShell.tsx`**

Main layout orchestrator:
- Uses `usePlayground()` hook
- Renders `TopToolbar` at top
- Two-panel layout: `ConversationSimulator` (left, 55%) + `IntelligencePanel` (right, 45%)
- `AnalyticsSection` below
- `ExportModal` (conditionally rendered)
- Responsive breakpoints for tablet/mobile
- Keyboard shortcuts: Ctrl+K (focus input), Ctrl+R (reset), Ctrl+E (export), Escape (close modal)

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/playground/PlaygroundShell.tsx
git commit -m "feat(playground): add PlaygroundShell layout orchestrator"
```

---

### Task 23: Demo Page

**Files:**
- Modify: `src/app/demo/page.tsx`

**Interfaces:**
- Consumes: `PlaygroundShell`
- Produces: Demo page at `/demo`

- [ ] **Step 1: Rewrite `src/app/demo/page.tsx`**

Replace existing page with:
- Full-width playground (no container max-width constraint)
- `<PlaygroundShell />` as the only child
- Minimal wrapper — let the playground breathe
- Page metadata: title "Emphra Playground — Interactive Conversation Intelligence"

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/demo/page.tsx
git commit -m "feat(demo): rewrite demo page with new PlaygroundShell"
```

---

### Task 24: Add Playground CTA to Home Page

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: None
- Produces: Updated home page with playground CTA

- [ ] **Step 1: Add a playground CTA section to `src/app/page.tsx`**

Between `Metrics` and `ApiDocs`, add a section that links to `/demo`:
- Headline: "See it in action"
- Subheadline: "Try the interactive playground — no API key required"
- CTA button: "Launch Playground →" (links to `/demo`)
- Styled with the existing design system

- [ ] **Step 2: Build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): add playground CTA section"
```

---

## Phase 7: Polish + Verification

### Task 25: Final Build + Lint + Verification

**Files:**
- All files from previous tasks

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: PASS — all routes generated, no TypeScript errors

- [ ] **Step 2: Lint check**

Run: `npm run lint`
Expected: No new errors in playground files

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`
Expected:
- Navigate to `/demo` — playground loads
- Type a message — appears in feed, analysis runs, panels update
- Load a preset scenario — messages populate, analysis runs
- Switch tabs — all 6 tabs render correctly
- Analytics charts update after messages
- Export modal opens and downloads JSON
- Reset session clears everything
- Responsive: resize to mobile — layout adapts

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(playground): complete interactive playground implementation

- 15 new components, 3 hooks, 2 lib files, 1 type file
- 6 intelligence tabs: Moderation, Sentiment, Insights, Summary, API Response, Trust & Safety
- 4 analytics charts: Toxicity, Sentiment, Health, Distribution
- 8 preset scenarios with instant loading
- Session persistence via localStorage
- Shareable URLs with scenario encoding
- Export system (JSON + text report)
- Keyboard shortcuts
- Responsive layout (desktop/tablet/mobile)
- Zero external API costs — 100% free"
```
