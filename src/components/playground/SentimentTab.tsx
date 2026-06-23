"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Frown, Smile, Zap, Angry, Meh } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalyticsDataPoint } from "@/types/playground";

interface SentimentTabProps {
  analysis: AnalysisResult | null | undefined;
  analytics: AnalyticsDataPoint[];
  isProcessing: boolean;
}

const SENTIMENT_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  Positive: {
    icon: <Smile size={12} />,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/20",
  },
  Neutral: {
    icon: <Meh size={12} />,
    color: "text-muted-foreground/60",
    bg: "bg-white/[0.04] border-white/[0.08]",
  },
  Negative: {
    icon: <Frown size={12} />,
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  Angry: {
    icon: <Angry size={12} />,
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/20",
  },
  Excited: {
    icon: <Zap size={12} />,
    color: "text-sky-400",
    bg: "bg-sky-400/10 border-sky-400/20",
  },
  Frustrated: {
    icon: <Angry size={12} />,
    color: "text-orange-400",
    bg: "bg-orange-400/10 border-orange-400/20",
  },
};

export function SentimentTab({
  analysis,
  analytics,
  isProcessing,
}: SentimentTabProps) {
  const sentiment = analysis?.sentiment;
  const score = sentiment?.score ?? 50;
  const label = sentiment?.label ?? "Neutral";
  const config = SENTIMENT_CONFIG[label] ?? SENTIMENT_CONFIG.Neutral;

  const chartData = analytics.map((d, i) => ({
    i,
    v: Math.round(d.sentiment),
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Gauge */}
      <div className="flex flex-col items-center py-2">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="6"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={
                score > 65
                  ? "oklch(0.65 0.12 150)"
                  : score > 40
                    ? "oklch(0.72 0.08 85)"
                    : "oklch(0.55 0.15 25)"
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 251.3} 251.3`}
              initial={{ strokeDasharray: "0 251.3" }}
              animate={{
                strokeDasharray: `${(score / 100) * 251.3} 251.3`,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black font-mono text-foreground/80">
              {isProcessing ? "…" : score}
            </span>
          </div>
        </div>

        {/* Label */}
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border mt-3 text-[10px] font-bold uppercase tracking-wider",
            config.bg,
            config.color
          )}
        >
          {config.icon}
          {label}
        </div>
        <p className="text-[9px] text-muted-foreground/30 mt-1.5">
          Emotional Sentiment Index
        </p>
      </div>

      {/* Sentiment Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-muted-foreground/30">
          <span className="text-red-400/60">Negative</span>
          <span className="text-emerald-400/60">Positive</span>
        </div>
        <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400"
            initial={{ width: "50%" }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Trend Chart */}
      {chartData.length > 1 && (
        <div className="space-y-1.5">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
            Sentiment Trend
          </p>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="sparkSent" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="oklch(0.55 0.15 250)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="oklch(0.55 0.15 250)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="oklch(0.55 0.15 250)"
                  strokeWidth={1.5}
                  fill="url(#sparkSent)"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "10px",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Contextual Summary */}
      {analysis?.contextualSummary && (
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-1">
            Context
          </p>
          <p className="text-[11px] text-foreground/50 italic leading-relaxed">
            &ldquo;{analysis.contextualSummary}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
