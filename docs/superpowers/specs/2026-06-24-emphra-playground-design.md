# Emphra Interactive Playground — Design Spec

**Date:** 2026-06-24
**Status:** Approved
**Author:** OWL (Principal Product Designer + Frontend Architect)

---

## 1. Product Vision

The Emphra Interactive Playground is the flagship product experience — a centerpiece that makes visitors immediately understand the platform's value without reading documentation. It should feel like "Stripe Dashboard meets Linear meets Apple's Human Interface Design."

**Core principle:** This is not a demo, not a chatbot, not a toy. This is an enterprise-grade interactive product demonstration that convinces visitors Emphra is a mature, funded platform.

**Zero-cost constraint:** Every feature runs on free, local, or open-source technology. No paid external APIs.

---

## 2. Architecture

### 2.1 Page Structure

```
/app/demo/page.tsx                   → Playground page (immersive, full-width)
```

The playground replaces the existing `/demo` page entirely. It is a standalone immersive experience, not embedded in the marketing page.

### 2.2 Component Tree

```
PlaygroundShell                      → Main layout orchestrator
├── TopToolbar                       → Breadcrumb + status + actions
├── MainArea                         → Two-panel layout
│   ├── ConversationSimulator        → Left: message feed + input + presets
│   └── IntelligencePanel            → Right: tabbed insights (6 tabs)
│       ├── ModerationTab
│       ├── SentimentTab
│       ├── InsightsTab
│       ├── SummaryTab
│       ├── ApiResponseTab
│       └── TrustSafetyTab
├── AnalyticsSection                 → 4 charts below main area
├── ProcessingAnimation              → Overlay during analysis
├── PresetScenarios                  → Scenario loader panel
├── MessageHoverCard                 → Hover tooltip for messages
└── ExportModal                      → Export JSON/report dialog
```

### 2.3 State Management

```
usePlayground (core hook)
├── messages: Message[]
├── activeTab: TabId
├── isProcessing: boolean
├── processingStage: 'idle' | 'analyzing' | 'moderating' | 'generating' | 'complete'
├── analysis: AnalysisResult | null
├── analytics: AnalyticsData
├── settings: PlaygroundSettings
├── sendMessage(text, role) → void
├── loadScenario(scenario) → void
├── resetSession() → void
├── exportSession() → void
└── shareUrl: string

useSessionPersistence
├── save(session) → void
├── load() → Session | null
└── clear() → void

useShareableUrl
├── encode(state) → string
├── decode(url) → Partial<State> | null
└── getShareUrl() → string
```

### 2.4 Data Flow

```
User sends message
  → Optimistic UI update (message appears with "analyzing" state)
  → POST /api/moderate { text, history, mode: "moderate" }
  → Local mock engine processes (moderateContent, analyzeSentiment, generateSmartReplies)
  → Response: { toxicity, insult, threat, profanity, identity_attack, action, suggestion, sentiment, smart_replies, contextualSummary, flagged }
  → Insights engine generates smart observations
  → All panels update simultaneously with staggered animations
  → Analytics charts append new data point
  → Session persisted to localStorage
```

---

## 3. Visual System

### 3.1 Design Language

- **Liquid Glass** — `backdrop-blur-2xl`, `bg-white/[0.03-0.06]`, `border-white/[0.06-0.12]`
- **Frosted Crystal** — layered panels with varying blur depths
- **Dynamic Lighting** — radial gradients that shift based on conversation health
- **Premium Shadows** — `shadow-2xl shadow-black/40`, `shadow-gold-sm`
- **Soft Reflections** — subtle inner glow via `box-shadow` inset
- **Elegant Spacing** — `p-6`, `gap-6`, generous breathing room

### 3.2 Color Usage

| Token | Usage |
|---|---|
| `--background` (obsidian) | Page background |
| `--card` (graphite) | Panel backgrounds |
| `--primary` (gold) | Accents, active states, CTAs |
| `--destructive` (red) | Blocked messages, high toxicity |
| `--sapphire` | Secondary accents, info states |
| `white/[0.02-0.08]` | Glass surface fills |
| `white/[0.04-0.12]` | Glass borders |

### 3.3 Typography

| Role | Family | Weight | Size |
|---|---|---|---|
| Headings | Space Grotesk | 800 (extrabold) | `text-2xl` – `text-4xl` |
| Body | Inter | 400 – 500 | `text-sm` – `text-base` |
| Data / Mono | Geist Mono | 400 – 700 | `text-xs` – `text-sm` |
| Labels | Inter | 600 – 700 | `text-[10px]`, `text-xs` uppercase tracking-widest |

### 3.4 Animation Principles

- **Staggered reveals** — panels animate in with 50-100ms delays
- **Smooth transitions** — `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
- **Micro-interactions** — buttons scale on hover, cards lift on hover
- **Processing states** — sequential stage indicators with pulse animations
- **Chart animations** — smooth area chart transitions on new data

---

## 4. Layout Specifications

### 4.1 Desktop (≥1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│ TopToolbar (full width, sticky)                                 │
├──────────────────────────────────┬──────────────────────────────┤
│                                  │                              │
│   ConversationSimulator          │   IntelligencePanel          │
│   (55% width)                    │   (45% width)                │
│                                  │   [Tab Bar]                  │
│   [Message Feed]                 │   [Tab Content]              │
│   [Input Area]                   │                              │
│   [Preset Buttons]               │                              │
│                                  │                              │
├──────────────────────────────────┴──────────────────────────────┤
│ AnalyticsSection (full width, 4 charts in grid)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Tablet (768px–1023px)

- Conversation and Intelligence stack vertically
- Intelligence panel uses horizontal tab scrolling
- Analytics charts in 2-column grid

### 4.3 Mobile (<768px)

- Single column layout
- Intelligence panel collapses to bottom sheet or horizontal scroll
- Toolbar condenses to icon-only buttons
- Analytics charts stack vertically

---

## 5. Component Specifications

### 5.1 TopToolbar

**Elements:**
- Breadcrumb: `Home → Playground` (with chevron separator)
- Status indicators: API Status (green dot + "Online"), Region ("Global Edge"), Latency (live ms)
- Action buttons: Reset Session, Load Example, Export JSON, Get API Access
- Liquid glass styling with `backdrop-blur-xl`

**Behavior:**
- Sticky on scroll
- Latency updates after each API call
- Export opens modal, Get API Access scrolls to docs section

### 5.2 ConversationSimulator

**Message Feed:**
- User messages: right-aligned, gold-tinted background
- System messages: left-aligned, muted background with "SYSTEM" badge
- Assistant messages: left-aligned, purple-tinted background
- Moderator messages: left-aligned, blue-tinted background with shield icon
- Each message shows: role indicator, timestamp, content
- Flagged messages show a subtle red border + warning icon
- Smooth entry animations (fade + slide up)
- Auto-scroll to latest message

**Input Area:**
- Large textarea (min 48px, auto-expand to 120px)
- Send button (gold, with paper plane icon)
- Clear button (ghost, with trash icon)
- Keyboard shortcut: Enter to send, Shift+Enter for newline
- Character count indicator

**Preset Scenarios:**
- Horizontal scrollable chip list
- 8 scenarios: Friendly Discussion, Heated Argument, Community Moderation, Scam Attempt, Customer Support, Gaming Lobby, Marketplace Negotiation, Group Chat
- Clicking a scenario populates the message feed instantly
- Current scenario shown as active chip

### 5.3 IntelligencePanel

**Tab Bar:**
- 6 tabs: Moderation, Sentiment, Insights, Summary, API Response, Trust & Safety
- Icon + label for each tab
- Active tab: gold underline indicator with smooth slide animation
- Scrollable on smaller screens

**ModerationTab:**
- Overall score: large circular gauge (0–100%)
- Category bars: Toxicity, Insult, Threat, Profanity, Identity Attack
- Each bar: label, percentage, color-coded fill (green → yellow → red)
- Action badge: Allow (green), Warn (amber), Block (red) — premium pill badges
- Score history sparkline
- Risk trend indicator (improving / stable / worsening)

**SentimentTab:**
- Large sentiment gauge (dial-style, 0–100)
- Emotional tone label: Positive, Neutral, Negative, Angry, Excited, Frustrated
- Sentiment trend chart (area chart, last 20 messages)
- Mood indicator with emoji-style icon

**InsightsTab:**
- Key observations list (auto-generated from conversation patterns)
- Notable patterns with icons
- Important conversation moments with timestamps
- Example insights: "Conversation tone became increasingly hostile after message 6", "Potential harassment detected", "Escalation risk increased"
- Staggered entry animations

**SummaryTab:**
- Executive summary paragraph
- Key points (bullet list)
- Actionable takeaways
- Conversation timeline (vertical timeline with message markers)

**ApiResponseTab:**
- Stripe Dashboard-style developer console
- Syntax-highlighted JSON
- Copy button (appears on hover)
- Collapsible sections
- Line numbers
- HTTP status header (200 OK + latency)
- Monospace font, dark background

**TrustSafetyTab:**
- Risk score (large number, 0–100, color-coded)
- Safety score (circular progress)
- Moderation recommendation (text + icon)
- Compliance indicators (GDPR, SOC2, etc. — as badges)
- Historical risk trend

### 5.4 AnalyticsSection

**Chart 1 — Toxicity Trend:**
- Interactive area chart (Recharts)
- X-axis: message sequence
- Y-axis: toxicity score (0–100)
- Gradient fill (gold → transparent)
- Tooltip on hover

**Chart 2 — Sentiment Trend:**
- Interactive area chart
- X-axis: message sequence
- Y-axis: sentiment score (0–100)
- Gradient fill (purple → transparent)

**Chart 3 — Conversation Health:**
- Custom gauge/metric
- Overall quality score (0–100)
- Color: green (>70), amber (40–70), red (<40)
- Trend arrow (improving / stable / declining)

**Chart 4 — Message Distribution:**
- Pie chart (Recharts)
- Segments: Normal, Flagged, Reviewed, Blocked
- Color-coded segments
- Legend with counts and percentages

---

## 6. Backend Integration

### 6.1 `/api/moderate` Route

**Method:** POST
**Runtime:** Edge

**Request body:**
```json
{
  "text": "string",
  "history": [{ "sender": "string", "text": "string" }],
  "mode": "moderate" | "chat"
}
```

**Response:**
```json
{
  "toxicity": 0.0–1.0,
  "insult": 0.0–1.0,
  "threat": 0.0–1.0,
  "profanity": 0.0–1.0,
  "identity_attack": 0.0–1.0,
  "action": "allow" | "warn" | "block",
  "suggestion": "string",
  "contextualSummary": "string",
  "flagged": boolean,
  "sentiment": { "score": 0–100, "label": "string" },
  "smart_replies": ["string"]
}
```

**Processing:**
1. Rate limit check (in-memory, 10 req / 10s per IP)
2. If mode === "chat": return `generateHumanLikeResponse(text)`
3. Otherwise: run `moderateContent(text)`, `analyzeSentiment(text)`, `generateSmartReplies(text)`
4. Normalize toxicity to 0–1 range
5. Return combined result

### 6.2 Fallback System

If the API route fails:
- Client falls back to calling mock-api functions directly (client-side)
- UI shows subtle "Running local analysis" indicator
- Playground never breaks

---

## 7. Advanced Features

### 7.1 Live Processing Animation

When a message is sent:
1. Message appears with "Analyzing..." state (pulsing border)
2. Sequential stage indicators: "Analyzing..." → "Moderating..." → "Generating insights..." → "Complete"
3. Each stage: 200–400ms with smooth fade transitions
4. Message border transitions from pulsing gold to final state (green/amber/red)

### 7.2 Message Hover Details

Hovering over any message reveals a floating card:
- Toxicity score (mini bar)
- Sentiment score (mini gauge)
- Moderation decision badge
- Timestamp
- Appears with 150ms fade-in, follows cursor with slight offset

### 7.3 Session Persistence

- On every state change, serialize to `localStorage` under `emphra-playground-session`
- On page load, check for existing session and restore
- Clear on explicit "Reset Session" action
- TTL: 24 hours (expire old sessions)

### 7.4 Shareable URLs

- Scenario state encoded in URL query params: `/demo?scenario=heated-argument`
- On page load, check URL params and auto-load scenario
- "Share" button copies current URL to clipboard

### 7.5 Export System

- Export as JSON: full session data (messages, analysis, analytics)
- Export as text report: formatted analysis summary
- Download via `Blob` + `<a>` element

### 7.6 Keyboard Shortcuts

| Key | Action |
|---|---|
| Enter | Send message |
| Shift+Enter | New line in input |
| Ctrl/Cmd + K | Focus input |
| Ctrl/Cmd + R | Reset session |
| Ctrl/Cmd + E | Export JSON |
| Escape | Close any open modal |

---

## 8. Preset Scenarios

| Name | Description | Message Count | Expected Behavior |
|---|---|---|---|
| Friendly Discussion | Normal polite conversation | 4 | All green, low toxicity |
| Heated Argument | Escalating insults | 5 | Yellow → red, block on last message |
| Community Moderation | Policy violations | 4 | Mixed allow/warn/block |
| Scam Attempt | Suspicious requests | 3 | High spam/scam scores |
| Customer Support | Professional exchange | 4 | All green, positive sentiment |
| Gaming Lobby | Mixed messages | 6 | Mix of allow and warn |
| Marketplace Negotiation | Buying/selling | 4 | Mostly green, some caution |
| Group Chat | Multiple participants | 6 | Varied roles, mixed results |

---

## 9. Accessibility

- All interactive elements: `aria-label`, `role`, keyboard focusable
- Focus states: visible ring (`ring-2 ring-primary`)
- Color is never the only indicator — always paired with text/icon
- Screen reader announcements for processing state changes
- Reduced motion support: `prefers-reduced-motion` disables animations
- High contrast mode: borders become more visible, colors shift to higher contrast

---

## 10. Performance

- `React.memo` on all list items and chart components
- `useMemo` for computed analytics data
- `useCallback` for all event handlers
- Lazy load charts (dynamic import) — only render when tab is active
- Virtual scrolling for message feed (if >50 messages)
- Debounced localStorage writes (500ms)
- API response time: <10ms (local engine)

---

## 11. File Manifest

### New Files

```
src/app/demo/page.tsx                          → Playground page
src/types/playground.ts                        → Playground-specific types
src/lib/insights-engine.ts                     → Smart insights generator
src/hooks/usePlayground.ts                     → Core playground state
src/hooks/useSessionPersistence.ts             → localStorage persistence
src/hooks/useShareableUrl.ts                   → URL-encoded state
src/components/playground/
  ├── PlaygroundShell.tsx                      → Main layout
  ├── TopToolbar.tsx                           → Toolbar
  ├── ConversationSimulator.tsx                → Message feed + input
  ├── IntelligencePanel.tsx                    → Tab container
  ├── ModerationTab.tsx                        → Moderation tab
  ├── SentimentTab.tsx                         → Sentiment tab
  ├── InsightsTab.tsx                          → Insights tab
  ├── SummaryTab.tsx                           → Summary tab
  ├── ApiResponseTab.tsx                       → API response tab
  ├── TrustSafetyTab.tsx                       → Trust & safety tab
  ├── AnalyticsSection.tsx                     → 4 analytics charts
  ├── PresetScenarios.tsx                      → Scenario loader
  ├── ProcessingAnimation.tsx                  → Processing overlay
  ├── MessageHoverCard.tsx                     → Hover tooltip
  └── ExportModal.tsx                          → Export dialog
```

### Modified Files

```
src/lib/mock-api.ts                            → Enhanced analysis functions
src/app/api/moderate/route.ts                  → Richer response format
src/app/page.tsx                               → Add playground CTA
```

---

## 12. Zero-Cost Verification

| Component | Technology | Cost |
|---|---|---|
| Moderation engine | Local TypeScript (`mock-api.ts`) | Free |
| Rate limiting | In-memory `Map` (custom) | Free |
| Sentiment analysis | Local keyword engine | Free |
| Insights generation | Local pattern matching | Free |
| Charts | Recharts (open-source) | Free |
| Animations | Framer Motion (open-source) | Free |
| UI components | shadcn/ui (open-source) | Free |
| Session storage | localStorage API | Free |
| Backend runtime | Next.js Edge (included) | Free |
| **Total** | | **$0** |
