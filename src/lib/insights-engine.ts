import type { PlaygroundMessage, AnalysisResult, Insight } from "@/types/playground";

export function generateInsights(
  messages: PlaygroundMessage[],
  analyses: Record<string, AnalysisResult>
): Insight[] {
  const insights: Insight[] = [];

  if (messages.length === 0) return insights;

  // Detect escalation: 3+ consecutive increasing toxicity
  let escalationStart = -1;
  for (let i = 0; i < messages.length; i++) {
    const analysis = analyses[messages[i].id];
    if (!analysis) continue;
    const prev = i > 0 ? analyses[messages[i - 1].id] : null;
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
  const toxicCount = messages.filter((m) => analyses[m.id]?.moderation.flagged).length;
  if (toxicCount >= 2) {
    insights.push({
      id: "harassment-pattern",
      text: "Potential harassment detected — multiple flagged messages in sequence.",
      type: "danger",
      timestamp: new Date(),
    });
  }

  // Detect sentiment drop
  const sentiments = messages.map((m) => analyses[m.id]?.sentiment.score ?? 50);
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
  const scamMsgs = messages.filter((m) => {
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
  if (messages.length >= 3 && toxicCount === 0) {
    insights.push({
      id: "clean-conversation",
      text: "Conversation remains respectful and within community guidelines.",
      type: "success",
      timestamp: new Date(),
    });
  }

  // Escalation risk
  const highToxic = messages.filter((m) => (analyses[m.id]?.moderation.scores.toxicity ?? 0) > 0.6);
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
  const flaggedMessages = messages.filter((m) => analyses[m.id]?.moderation.flagged);
  const avgSentiment =
    messages.reduce((sum, m) => sum + (analyses[m.id]?.sentiment.score ?? 50), 0) /
    Math.max(totalMessages, 1);
  const avgToxicity =
    messages.reduce((sum, m) => sum + (analyses[m.id]?.moderation.scores.toxicity ?? 0), 0) /
    Math.max(totalMessages, 1);

  let toneDescription = "neutral";
  if (avgSentiment > 70) toneDescription = "positive and constructive";
  else if (avgSentiment < 30) toneDescription = "tense and negative";
  else if (avgToxicity > 0.4) toneDescription = "concerning with elevated toxicity";

  const executive = `This ${totalMessages}-message conversation maintains a generally ${toneDescription} tone. ${flaggedMessages.length > 0 ? `${flaggedMessages.length} message${flaggedMessages.length > 1 ? "s were" : " was"} flagged for review.` : "No messages required moderation action."} Average sentiment: ${Math.round(avgSentiment)}/100. Average toxicity: ${Math.round(avgToxicity * 100)}%.`;

  const keyPoints: string[] = [];
  if (totalMessages > 0)
    keyPoints.push(
      `${totalMessages} messages exchanged between ${new Set(messages.map((m) => m.sender)).size} participants.`
    );
  if (flaggedMessages.length > 0)
    keyPoints.push(
      `${flaggedMessages.length} message${flaggedMessages.length > 1 ? "s" : ""} flagged for moderation.`
    );
  const blockedCount = messages.filter((m) => analyses[m.id]?.moderation.action === "block").length;
  if (blockedCount > 0)
    keyPoints.push(`${blockedCount} message${blockedCount > 1 ? "s" : ""} blocked.`);
  keyPoints.push(
    `Overall sentiment: ${avgSentiment > 60 ? "positive" : avgSentiment < 40 ? "negative" : "mixed"}.`
  );
  if (messages.length >= 2) {
    const roles = new Set(messages.map((m) => m.role));
    keyPoints.push(
      `Involves ${roles.size} role${roles.size > 1 ? "s" : ""}: ${Array.from(roles).join(", ").toLowerCase()}.`
    );
  }

  const takeaways: string[] = [];
  if (avgToxicity > 0.3) takeaways.push("Consider enabling stricter moderation for this channel.");
  if (avgSentiment < 40)
    takeaways.push("User satisfaction may be impacted — consider proactive outreach.");
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
