"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Heart, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlaygroundMessage, AnalysisResult } from "@/types/playground";

interface MessageHoverCardProps {
  message: PlaygroundMessage;
  analysis: AnalysisResult | undefined;
  visible: boolean;
}

function getActionColor(action: string) {
  switch (action) {
    case "block":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    case "warn":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    default:
      return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  }
}

function getSentimentColor(score: number) {
  if (score > 65) return "text-emerald-400";
  if (score > 40) return "text-amber-400";
  return "text-red-400";
}

export function MessageHoverCard({
  message,
  analysis,
  visible,
}: MessageHoverCardProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 w-56 p-3 rounded-xl bg-card/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl shadow-black/40 pointer-events-none"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
              Analysis
            </span>
            <div className="flex items-center gap-1 text-[9px] text-muted-foreground/40">
              <Clock size={8} />
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {analysis ? (
            <div className="space-y-2">
              {/* Toxicity */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Shield size={9} className="text-muted-foreground/40" />
                    <span className="text-[9px] font-semibold text-muted-foreground/60">
                      Toxicity
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-foreground/80">
                    {Math.round(analysis.moderation.scores.toxicity * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      analysis.moderation.scores.toxicity > 0.6
                        ? "bg-red-400"
                        : analysis.moderation.scores.toxicity > 0.3
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                    )}
                    style={{
                      width: `${analysis.moderation.scores.toxicity * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Sentiment */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Heart size={9} className="text-muted-foreground/40" />
                  <span className="text-[9px] font-semibold text-muted-foreground/60">
                    Sentiment
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold",
                    getSentimentColor(analysis.sentiment.score)
                  )}
                >
                  {analysis.sentiment.score}
                </span>
              </div>

              {/* Action Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {analysis.moderation.action === "allow" ? (
                    <CheckCircle size={9} className="text-emerald-400/60" />
                  ) : (
                    <AlertTriangle
                      size={9}
                      className={
                        analysis.moderation.action === "block"
                          ? "text-red-400/60"
                          : "text-amber-400/60"
                      }
                    />
                  )}
                  <span className="text-[9px] font-semibold text-muted-foreground/60">
                    Decision
                  </span>
                </div>
                <span
                  className={cn(
                    "text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border",
                    getActionColor(analysis.moderation.action)
                  )}
                >
                  {analysis.moderation.action}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-[9px] text-muted-foreground/30 italic">
              Analyzing...
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
