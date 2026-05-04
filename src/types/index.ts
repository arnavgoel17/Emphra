export type Action = "allow" | "warn" | "block";

export interface ModerationResult {
  toxicity: number;
  flagged: string[];
  action: Action;
  categories: string[];
  suggestion?: string;
  contextualSummary?: string;
}

export interface SentimentResult {
  score: number;
  label: string; // Made generic to support "Positive", "Happy", etc.
}

export interface SmartReply {
  text: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  sender?: "User A" | "User B" | "Moderator Bot" | string;
  flagged?: boolean;
}

export interface ApiResponse extends ModerationResult {
  request_id: string;
  latency: string;
  sentiment: SentimentResult;
  summary: string;
  smart_replies: string[];
  ers_impact: number;
  spam_probability?: number;
  scam_probability?: number;
}
