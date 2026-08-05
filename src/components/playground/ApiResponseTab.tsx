"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PlaygroundMessage, AnalysisResult } from "@/types/playground";

interface ApiResponseTabProps {
  analysis: AnalysisResult | null | undefined;
  messages: PlaygroundMessage[];
  analyses: Record<string, AnalysisResult>;
  isProcessing: boolean;
}

export function ApiResponseTab({
  analysis,
  messages,
  analyses,
  isProcessing,
}: ApiResponseTabProps) {
  const [copied, setCopied] = useState(false);

  const getResponseJson = () => {
    if (isProcessing) return { status: "processing", message: "Analysis in progress…" };
    if (!analysis) return { status: "waiting", message: "Send a message to see the API response." };

    return {
      status: "success",
      code: 200,
      latency_ms: analysis.latencyMs,
      data: {
        moderation: {
          action: analysis.moderation.action,
          flagged: analysis.moderation.flagged,
          scores: {
            toxicity: Math.round(analysis.moderation.scores.toxicity * 100),
            insult: Math.round(analysis.moderation.scores.insult * 100),
            threat: Math.round(analysis.moderation.scores.threat * 100),
            profanity: Math.round(analysis.moderation.scores.profanity * 100),
            identity_attack: Math.round(analysis.moderation.scores.identityAttack * 100),
          },
          suggestion: analysis.moderation.suggestion,
        },
        sentiment: {
          score: analysis.sentiment.score,
          label: analysis.sentiment.label,
        },
        contextual_summary: analysis.contextualSummary,
        smart_replies: analysis.smartReplies.map((r) => r.text),
      },
      meta: {
        total_messages: messages.length,
        analyzed_messages: Object.keys(analyses).length,
        engine: "emphra-local-v2",
      },
    };
  };

  const json = getResponseJson();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={11} className="text-primary/50" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
            API Response
          </p>
          {analysis && (
            <span className="text-[8px] font-mono text-emerald-400/50 bg-emerald-400/5 px-1.5 py-0.5 rounded border border-emerald-400/10">
              200 OK · {analysis.latencyMs}ms
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-5 w-5 text-muted-foreground/20 hover:text-foreground/50"
          aria-label="Copy JSON"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </Button>
      </div>

      {/* Console */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
        {/* Console Header */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border-b border-white/[0.04]">
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          <span className="text-[8px] font-mono text-muted-foreground/20 ml-2">
            response.json
          </span>
        </div>

        {/* JSON Content */}
        <div className="bg-black/40 p-4 max-h-[350px] overflow-auto">
          <pre className="text-[10px] leading-relaxed font-mono">
            <JsonHighlight json={json} />
          </pre>
        </div>
      </div>
    </div>
  );
}

function JsonHighlight({ json }: { json: unknown }) {
  const text = JSON.stringify(json, null, 2);
  const lines = text.split("\n");

  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="text-muted-foreground/15 select-none w-6 text-right mr-3 shrink-0">
            {i + 1}
          </span>
          <span>
            {line.split(/(".*?":|".*?")/).map((part, j) => {
              if (part.endsWith(":")) {
                return (
                  <span key={j} className="text-sky-400/60">
                    {part}
                  </span>
                );
              }
              if (part.startsWith('"')) {
                return (
                  <span key={j} className="text-emerald-400/60">
                    {part}
                  </span>
                );
              }
              if (/^\d+\.?\d*$/.test(part)) {
                return (
                  <span key={j} className="text-amber-400/60">
                    {part}
                  </span>
                );
              }
              if (part === "true" || part === "false") {
                return (
                  <span key={j} className="text-purple-400/60">
                    {part}
                  </span>
                );
              }
              if (part === "null") {
                return (
                  <span key={j} className="text-muted-foreground/30">
                    {part}
                  </span>
                );
              }
              return (
                <span key={j} className="text-foreground/40">
                  {part}
                </span>
              );
            })}
          </span>
        </div>
      ))}
    </>
  );
}
