"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, List, Target, Clock, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryTabProps {
  summary: {
    executive: string;
    keyPoints: string[];
    takeaways: string[];
  };
  timeline: { index: number; preview: string; action: string; time: string }[];
  isProcessing: boolean;
}

function getActionIcon(action: string) {
  switch (action) {
    case "block":
      return <XCircle size={8} className="text-red-400" />;
    case "warn":
      return <AlertTriangle size={8} className="text-amber-400" />;
    default:
      return <CheckCircle size={8} className="text-emerald-400" />;
  }
}

function getActionColor(action: string) {
  switch (action) {
    case "block":
      return "bg-red-400/10 border-red-400/20";
    case "warn":
      return "bg-amber-400/10 border-amber-400/20";
    default:
      return "bg-emerald-400/10 border-emerald-400/20";
  }
}

export function SummaryTab({ summary, timeline, isProcessing }: SummaryTabProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Executive Summary */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <FileText size={10} className="text-primary/40" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
            Executive Summary
          </p>
        </div>
        <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <p className="text-[11px] text-foreground/60 leading-relaxed italic">
            {isProcessing
              ? "Generating summary…"
              : summary.executive || "Send messages to generate a summary."}
          </p>
        </div>
      </div>

      {/* Key Points */}
      {summary.keyPoints.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <List size={10} className="text-muted-foreground/30" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
              Key Points
            </p>
          </div>
          <div className="space-y-1">
            {summary.keyPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 px-2 py-1"
              >
                <div className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                <span className="text-[10px] text-foreground/50 leading-relaxed">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Takeaways */}
      {summary.takeaways.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Target size={10} className="text-muted-foreground/30" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
              Takeaways
            </p>
          </div>
          <div className="space-y-1">
            {summary.takeaways.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 px-2 py-1"
              >
                <span className="text-[9px] font-bold text-primary/40 mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                <span className="text-[10px] text-foreground/50 leading-relaxed">
                  {item}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Clock size={10} className="text-muted-foreground/30" />
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">
              Timeline
            </p>
          </div>
          <div className="relative pl-3">
            {/* Vertical line */}
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-white/[0.06]" />

            <div className="space-y-1.5">
              {timeline.map((item) => (
                <div key={item.index} className="flex items-start gap-2 relative">
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full mt-1 shrink-0 z-10 border",
                      getActionColor(item.action)
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {getActionIcon(item.action)}
                      <span className="text-[9px] font-mono text-muted-foreground/30">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[10px] text-foreground/40 truncate mt-0.5">
                      {item.preview}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
