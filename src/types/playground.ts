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

export type TabId =
  | "moderation"
  | "sentiment"
  | "insights"
  | "summary"
  | "apiResponse"
  | "trustSafety";

export type ProcessingStage =
  | "idle"
  | "analyzing"
  | "moderating"
  | "generating"
  | "complete";

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
