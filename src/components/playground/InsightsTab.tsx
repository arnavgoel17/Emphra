"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, Info, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types/playground";

interface InsightsTabProps {
  insights: Insight[];
  isProcessing: boolean;
}

const TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; color: string; border: string }
> = {
  warning: {
    icon: <AlertTriangle size={11} />,
    color: "text-amber-400",
    border: "border-amber-400/10 bg-amber-400/[0.03]",
  },
  info: {
    icon: <Info size={11} />,
    color: "text-sky-400",
    border: "border-sky-400/10 bg-sky-400/[0.03]",
  },
  danger: {
    icon: <AlertCircle size={11} />,
    color: "text-red-400",
    border: "border-red-400/10 bg-red-400/[0.03]",
  },
  success: {
    icon: <CheckCircle size={11} />,
    color: "text-emerald-400",
    border: "border-emerald-400/10 bg-emerald-400/[0.03]",
  },
};

export function InsightsTab({ insights, isProcessing }: InsightsTabProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Brain size={11} className="text-primary/50" />
        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
          Smart Observations
        </p>
      </div>

      <AnimatePresence mode="popLayout">
        {insights.length > 0 ? (
          insights.map((insight, i) => {
            const config = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.info;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "p-2.5 rounded-lg border",
                  config.border
                )}
              >
                <div className="flex items-start gap-2">
                  <span className={cn("mt-0.5 shrink-0", config.color)}>
                    {config.icon}
                  </span>
                  <div>
                    <p className="text-[11px] text-foreground/70 leading-relaxed">
                      {insight.text}
                    </p>
                    {insight.messageIndex !== undefined && (
                      <p className="text-[8px] text-muted-foreground/25 mt-1">
                        Message #{insight.messageIndex + 1}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <Brain size={20} className="text-muted-foreground/10 mb-2" />
            <p className="text-[10px] text-muted-200/30 max-w-[180px]">
              {isProcessing
                ? "Analyzing conversation patterns…"
                : "Send messages to generate smart insights"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
