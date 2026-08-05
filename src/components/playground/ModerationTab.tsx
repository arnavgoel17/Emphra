"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalyticsDataPoint } from "@/types/playground";

interface ModerationTabProps {
  analysis: AnalysisResult | null | undefined;
  analytics: AnalyticsDataPoint[];
  isProcessing: boolean;
  ersScore: number;
}

const CATEGORIES = [
  { key: "toxicity", label: "Toxicity", color: "bg-red-400" },
  { key: "insult", label: "Insult", color: "bg-orange-400" },
  { key: "threat", label: "Threat", color: "bg-rose-400" },
  { key: "profanity", label: "Profanity", color: "bg-amber-400" },
  { key: "identityAttack", label: "Identity Attack", color: "bg-purple-400" },
] as const;

function getActionBadge(action: string) {
  switch (action) {
    case "block":
      return {
        label: "Block",
        icon: <XCircle size={10} />,
        className: "bg-red-400/10 text-red-400 border-red-400/20",
      };
    case "warn":
      return {
        label: "Warn",
        icon: <AlertTriangle size={10} />,
        className: "bg-amber-400/10 text-amber-400 border-amber-400/20",
      };
    default:
      return {
        label: "Allow",
        icon: <CheckCircle size={10} />,
        className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
      };
  }
}

function getRiskTrend(analytics: AnalyticsDataPoint[]) {
  if (analytics.length < 2) return "stable";
  const recent = analytics.slice(-3);
  const avg =
    recent.reduce((s, d) => s + d.toxicity, 0) / recent.length;
  const prev =
    analytics
      .slice(-6, -3)
      .reduce((s, d) => s + d.toxicity, 0) /
    Math.max(analytics.slice(-6, -3).length, 1);
  if (avg > prev + 10) return "worsening";
  if (avg < prev - 10) return "improving";
  return "stable";
}

export function ModerationTab({
  analysis,
  analytics,
  isProcessing,
  ersScore,
}: ModerationTabProps) {
  const scores = analysis?.moderation.scores;
  const action = analysis?.moderation.action ?? "allow";
  const badge = getActionBadge(action);
  const trend = getRiskTrend(analytics);
  // Use ersScore for the overall score display (0 = safe, 100 = high risk)
  const overallScore = ersScore;

  const sparklineData = analytics.map((d, i) => ({
    i,
    v: Math.round(d.toxicity),
  }));

  return (
    <div className="p-4 space-y-4">
      {/* Score + Action Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Circular Score */}
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="4"
              />
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={
                  overallScore > 60
                    ? "oklch(0.55 0.15 25)"
                    : overallScore > 30
                      ? "oklch(0.72 0.08 85)"
                      : "oklch(0.65 0.12 150)"
                }
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(overallScore / 100) * 150.8} 150.8`}
                initial={{ strokeDasharray: "0 150.8" }}
                animate={{
                  strokeDasharray: `${(overallScore / 100) * 150.8} 150.8`,
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black font-mono text-foreground/80">
                {isProcessing ? "…" : overallScore}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
              Overall Score
            </p>
            <p className="text-xs text-foreground/60 mt-0.5">
              {overallScore > 60
                ? "High Risk"
                : overallScore > 30
                  ? "Moderate"
                  : "Low Risk"}
            </p>
          </div>
        </div>

        {/* Action Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider",
            badge.className
          )}
        >
          {badge.icon}
          {badge.label}
        </div>
      </div>

      {/* Category Bars */}
      <div className="space-y-2.5">
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
          Category Breakdown
        </p>
        {CATEGORIES.map((cat) => {
          const value = scores
            ? Math.round(
                (scores[cat.key as keyof typeof scores] as number) * 100
              )
            : 0;
          return (
            <div key={cat.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground/50">
                  {cat.label}
                </span>
                <span className="text-[10px] font-mono font-bold text-foreground/60">
                  {value}%
                </span>
              </div>
              <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", cat.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Trend */}
      <div
        className="flex items-center justify-between p-2.5 rounded-lg"
        style={{
          background: "rgba(255,255,255,0.03)",
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-2">
          {trend === "worsening" ? (
            <TrendingUp size={11} className="text-red-400" />
          ) : trend === "improving" ? (
            <TrendingDown size={11} className="text-emerald-400" />
          ) : (
            <Minus size={11} className="text-muted-foreground/30" />
          )}
          <span className="text-[10px] font-semibold text-muted-foreground/50">
            Risk Trend
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider",
            trend === "worsening"
              ? "text-red-400"
              : trend === "improving"
                ? "text-emerald-400"
                : "text-muted-foreground/40"
          )}
        >
          {trend}
        </span>
      </div>

      {/* Sparkline */}
      {sparklineData.length > 1 && (
        <div className="h-16 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id="sparkTox" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="oklch(0.72 0.08 85)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="oklch(0.72 0.08 85)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="oklch(0.72 0.08 85)"
                strokeWidth={1.5}
                fill="url(#sparkTox)"
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
      )}

      {/* Suggestion */}
      {analysis?.moderation.suggestion && (
        <div
          className="p-2.5 rounded-lg"
          style={{
            background: "oklch(0.72 0.08 85 / 0.05)",
            boxShadow: "0 0 0 0.5px oklch(0.72 0.08 85 / 0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[9px] font-bold uppercase tracking-widest text-primary/50 mb-1">
            Suggestion
          </p>
          <p className="text-[11px] text-foreground/60 italic leading-relaxed">
            &ldquo;{analysis.moderation.suggestion}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
