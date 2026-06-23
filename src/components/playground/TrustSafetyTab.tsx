"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnalysisResult, AnalyticsDataPoint } from "@/types/playground";

interface TrustSafetyTabProps {
  analysis: AnalysisResult | null | undefined;
  analytics: AnalyticsDataPoint[];
  isProcessing: boolean;
}

const COMPLIANCE_ITEMS = [
  { label: "GDPR", status: "pass" as const },
  { label: "SOC 2", status: "pass" as const },
  { label: "HIPAA", status: "pass" as const },
  { label: "CCPA", status: "pass" as const },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "pass":
      return <CheckCircle size={9} className="text-emerald-400" />;
    case "warn":
      return <AlertTriangle size={9} className="text-amber-400" />;
    default:
      return <XCircle size={9} className="text-red-400" />;
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pass":
      return "text-emerald-400 bg-emerald-400/5 border-emerald-400/10";
    case "warn":
      return "text-amber-400 bg-amber-400/5 border-amber-400/10";
    default:
      return "text-red-400 bg-red-400/5 border-red-400/10";
  }
}

export function TrustSafetyTab({
  analysis,
  analytics,
  isProcessing,
}: TrustSafetyTabProps) {
  const toxicity = analysis?.moderation.scores.toxicity ?? 0;
  const riskScore = Math.round(toxicity * 100);
  const safetyScore = Math.round(100 - toxicity * 100);

  let recommendation = "No action needed";
  let recIcon = <CheckCircle size={10} className="text-emerald-400" />;
  let recColor = "text-emerald-400 bg-emerald-400/5 border-emerald-400/10";

  if (riskScore > 60) {
    recommendation = "Block — high risk content";
    recIcon = <XCircle size={10} className="text-red-400" />;
    recColor = "text-red-400 bg-red-400/5 border-red-400/10";
  } else if (riskScore > 30) {
    recommendation = "Review — moderate risk";
    recIcon = <AlertTriangle size={10} className="text-amber-400" />;
    recColor = "text-amber-400 bg-amber-400/5 border-amber-400/10";
  }

  return (
    <div className="p-4 space-y-4">
      {/* Risk + Safety Scores */}
      <div className="grid grid-cols-2 gap-3">
        {/* Risk Score */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center">
          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/25 mb-2">
            Risk Score
          </p>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="24" fill="none"
                stroke={riskScore > 60 ? "oklch(0.55 0.15 25)" : riskScore > 30 ? "oklch(0.72 0.08 85)" : "oklch(0.65 0.12 150)"}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(riskScore / 100) * 150.8} 150.8`}
                initial={{ strokeDasharray: "0 150.8" }}
                animate={{ strokeDasharray: `${(riskScore / 100) * 150.8} 150.8` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black font-mono text-foreground/70">
                {isProcessing ? "…" : riskScore}
              </span>
            </div>
          </div>
        </div>

        {/* Safety Score */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col items-center">
          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/25 mb-2">
            Safety Score
          </p>
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="24" fill="none"
                stroke={safetyScore > 70 ? "oklch(0.65 0.12 150)" : safetyScore > 40 ? "oklch(0.72 0.08 85)" : "oklch(0.55 0.15 25)"}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(safetyScore / 100) * 150.8} 150.8`}
                initial={{ strokeDasharray: "0 150.8" }}
                animate={{ strokeDasharray: `${(safetyScore / 100) * 150.8} 150.8` }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-black font-mono text-foreground/70">
                {isProcessing ? "…" : safetyScore}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={cn("flex items-center gap-2 p-2.5 rounded-lg border", recColor)}>
        {recIcon}
        <span className="text-[10px] font-semibold">{recommendation}</span>
      </div>

      {/* Compliance */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Lock size={9} className="text-muted-foreground/25" />
          <p className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground/25">
            Compliance
          </p>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {COMPLIANCE_ITEMS.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-[9px] font-semibold",
                getStatusColor(item.status)
              )}
            >
              {getStatusIcon(item.status)}
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
