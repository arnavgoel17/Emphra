# Emphra Playground — Detailed Flow

## Overview

The **Playground** (`/demo`) is an interactive testing ground where users type messages, watch them get analyzed for toxicity/sentiment/spam/safety in real time, and converse with an AI assistant. The flow is gated by two external AI services:

| Service | Purpose | Env Key |
|---|---|---|
| **Google Perspective API** | Real toxicity scoring | `PERSPECTIVE_API_KEY` |
| **OpenRouter** (free model) | Bot chat replies + safe-rewrite suggestions | `OPENROUTER_API_KEY` |

If either key is missing, the playground **falls back to local mocks** and keeps working — no crashes.

---

## End-to-End Message Flow

### 1. User types a message and presses Send

The `ConversationSimulator` captures the input and calls `sendMessage(text)` on the `usePlayground` hook.

### 2. Triage — score toxicity first

Before appending the message to the chat, `sendMessage` calls a **dedicated scoring endpoint** (`POST /api/moderate` with no history attachment) to determine the message's toxicity level using the Google Perspective API.

The server returns an action based on the toxicity score and the user's current **strictness** setting (Low / Medium / High, default Medium):

| Strictness | Warn threshold | Block threshold |
|---|---|---|
| Low (`< 30`) | toxicity ≥ 0.7 | toxicity ≥ 0.95 |
| Medium (`30–69`) | toxicity ≥ 0.5 | toxicity ≥ 0.8 |
| High (`≥ 70`) | toxicity ≥ 0.3 | toxicity ≥ 0.6 |

The action returned is one of:

- **`"allow"`** — toxicity is below the warn threshold
- **`"warn"`** — toxicity is between warn and block thresholds
- **`"block"`** — toxicity is at or above the block threshold

### 3a. If action is `"allow"` — send directly

The message is immediately appended to the chat as a user message, then analyzed (see step 4). **No safety dialog appears.** The user experiences zero friction for clean messages.

### 3b. If action is `"warn"` or `"block"` — safety dialog

The flow pauses at the `SafetyDialog`:

1. `pendingMessage` is set to the original text and `pendingEdit` is pre-filled with the same text for the edit field.
2. The dialog opens with two zones:
   - **Edit Your Message** — a text input pre-filled with the original text, so the user can rewrite it manually.
   - **Suggested Safe Alternative** — an LLM-generated polite rewrite of the original message (loaded asynchronously from `/api/safety-suggestion`).
3. While the suggestion loads, the card shows a skeleton shimmer.
4. Three options appear at the bottom:

| Button | Action |
|---|---|
| **Send Anyway** | Appends the *original* message as-is and proceeds to analysis. The message is then re-moderated server-side; if the final action is `"block"` it is flagged and no auto-reply is generated. |
| **Send Edited** | Uses the text the user hand-edited in the input field (`pendingEdit`). Button is disabled if the field is empty/whitespace. |
| **Apply Suggestion** | Uses the LLM rewrite (`safetySuggestion`). Button is disabled while the suggestion loads or if there is no suggestion. |

5. The user picks one. The dialog closes. All three paths now proceed to step 4.

**User can also dismiss the dialog** (click outside / press Escape) — the message is **not sent**; the user can retype.

### 4. Analysis runs on the final message

`analyzeAndUpdate` posts to `POST /api/moderate` (with conversation history and strictness) and returns:

- **Toxicity score** (0–1) — from Perspective API if key is present, otherwise from the local keyword mock.
- **Sub-scores**: insult, threat, profanity, identity_attack — these come from the local mock (Perspective's free tier only returns overall toxicity, so we supplement).
- **Action** — `"allow"` / `"warn"` / `"block"` (recomputed server-side).
- **Sentiment** — score (0–100) and label (Positive / Neutral / Negative / Angry / Excited / Frustrated).
- **Smart replies** — suggested response strings.
- **Contextual summary** — one-liner describing the message.
- **Latency** — server processing time in ms.

The `FullAnalysis` shape is defined in `src/lib/mock-api.ts:202`. The moderation route keeps the same shape whether Perspective or mock is used, so downstream consumers don't need to know which engine ran.

The user's message is now marked `"complete"` (or `"flagged"`) in the chat, and the **IntelligencePanel** and **AnalyticsSection** update with the new data.

### 5. Auto-reply (only if not blocked)

If the final action is **not** `"block"`:

1. The playground calls `POST /api/chat` with the **full conversation history** (up to 20 prior turns, user + assistant alternation).
2. OpenRouter responds using the free model (`openrouter/free` first, falls back to `gemini-2.0-flash-001` then `gpt-4o-mini`).
3. The assistant reply is appended as a new message with `role: "assistant"`, `sender: "Assistant"`. It renders with a purple Bot bubble in the `ConversationSimulator`.
4. Meanwhile `isReplying: true` lights up the `ProcessingAnimation` stage `"generating"` in the header area, so the user sees a typing indicator while the bot composes its reply.

If the action **is** `"block"`:

- The message appears in the chat flagged with a red border and a small alert icon.
- An error toast ("Message blocked — high toxicity detected") is shown.
- No auto-reply is generated.
- `isReplying` stays `false`.

### 6. Subsequent messages repeat 1–5

Each new user message restarts the cycle. The history grows and is sent to both the moderation endpoint and the chat endpoint so the assistant replies in context.

---

## Components

```
<PlaygroundShell>
  ├── <TopToolbar>                  — sticky header with latency / msg count / reset / export
  ├── <ConversationSimulator>       — message feed + input + preset scenarios
  ├── <IntelligencePanel>          — moderation / sentiment / insights / summary / apiResponse / trustSafety tabs
  ├── <AnalyticsSection>           — charts over the conversation timeline
  ├── <ExportModal>                — JSON / Markdown export
  └── <SafetyDialog>               — the 3-option interstitial (warn/block only)
```

State is centralized in **`usePlayground`** (`src/hooks/usePlayground.ts`), which owns:

- `messages`, `analyses`, `analytics`, `insights`
- `isProcessing` / `isReplying` / `processingStage` — drive spinners and the `ProcessingAnimation` stage indicator
- `safetyOpen`, `pendingMessage`, `pendingEdit`, `safetySuggestion`, `isSafetyLoading` — drive the safety dialog
- `sendMessage`, `handleSafetyConfirm`, `loadScenario`, `resetSession`

The `ConversationSimulator` is a pure presentational component — it renders messages and forwards `onSendMessage` clicks. It does **not** own safety logic. That is intentional so the same simulator can be reused without safety gating if needed.

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/moderate` | POST | Toxicity scoring + full analysis. Optional `mode: "chat"` returns an LLM reply (legacy path used by the home-page demo). |
| `/api/chat` | POST | Bot auto-reply. Uses OpenRouter free model + conversation history. |
| `/api/safety-suggestion` | POST | LLM safe-rewrite suggestion. Falls back to static mock if key missing. |

All three are **edge-runtime** and rate-limited (10 requests / 10 s per IP, via the in-memory `ratelimit` in `src/lib/redis.ts`).

---

## Strictness Settings

The `PlaygroundSettings.strictness` field (0–100, default 50) is sent on every moderation call. The server maps it to thresholds:

- `< 30` → **Low** — only very toxic messages trigger the dialog.
- `30–69` → **Medium** (default).
- `≥ 70` → **High** — even mildly colorful language triggers the dialog.

The UI exposes this as a slider with three labeled tick marks in the `IntelligencePanel`.

---

## Auto-reply Behavior Detail

The bot auto-replies **only to user-role messages**. System/moderator messages (e.g. from preset scenarios) do **not** generate auto-replies, to avoid bot-bot loops. A typing indicator (`isReplying`) is shown while the reply is in flight. Errors in the chat endpoint are silently handled — a static mock reply from `generateHumanLikeResponse()` is used instead so the conversation continues.

---

## Conversation Starter / Empty State

- On first load the conversation is empty. The chat area shows: *"Send a message or load a preset scenario to begin analysis"*.
- `PresetScenarios` (in `src/components/playground/PresetScenarios.tsx`) offers 8 curated multi-message scenarios (Friendly Discussion, Heated Argument, Community Moderation, Scam Attempt, Customer Support, Gaming Lobby, Marketplace, Group Chat). Loading one triggers the sequential message flow: messages are appended one at a time with a 300 ms gap and each is analyzed.
- The assistant auto-replies for each "user" turn in a preset scenario.
- Users can share a preset via URL (`?scenario=<id>`) — the shell reads it from the query params on mount and auto-loads.

---

## Edge Cases

| State | Handling |
|---|---|
| No `PERSPECTIVE_API_KEY` | `/api/moderate` falls back to mock engine, adds `source: "mock"` to the response. |
| No `OPENROUTER_API_KEY` | `/api/chat` and `/api/safety-suggestion` throw (server returns 502). Client-side catch blocks fall back to mock reply / static suggestion so the conversation continues. |
| User dismisses safety dialog | Message is **not sent**. No state changes. |
| User clicks "Send Edited" with empty input | Button is disabled; nothing happens. |
| Rate limit hit (429) | Client catches the error and falls back to mock fallback (no automatic retry). |
| Scenario timer in flight | `resetSession` and `loadScenario` call `clearScenarioTimers()` to avoid stale in-flight analyses. |

---

## Environment Variables

See `.env.example` in the repo root. Copy to `.env.local` (gitignored) and fill in:

```
PERSPECTIVE_API_KEY=your_google_perspective_key
OPENROUTER_API_KEY=your_openrouter_key
```

Optional:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000   # used for self-referencing API calls in /api/moderate chat proxy
```
