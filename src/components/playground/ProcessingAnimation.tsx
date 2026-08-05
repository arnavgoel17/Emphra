"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProcessingStage } from "@/types/playground";

interface ProcessingAnimationProps {
  stage: ProcessingStage;
}

const STAGES: { key: ProcessingStage; label: string }[] = [
  { key: "analyzing", label: "Analyzing..." },
  { key: "moderating", label: "Moderating..." },
  { key: "generating", label: "Generating insights..." },
  { key: "complete", label: "Complete" },
];

const STAGE_INDEX = STAGES.findIndex((s) => s.key === "complete");

function getActiveIndex(stage: ProcessingStage): number {
  const idx = STAGES.findIndex((s) => s.key === stage);
  return idx >= 0 ? idx : -1;
}

export function ProcessingAnimation({ stage }: ProcessingAnimationProps) {
  if (stage === "idle") return null;

  const activeIdx = getActiveIndex(stage);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-3 px-3 py-2 rounded-lg"
        style={{
          background: "rgba(255,255,255,0.03)",
          boxShadow: "0 0 0 0.5px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <Loader2 size={12} className="text-primary animate-spin" />
        <div className="flex items-center gap-2">
          {STAGES.map((s, i) => {
            const isActive = i === activeIdx;
            const isDone = i < activeIdx;
            return (
              <React.Fragment key={s.key}>
                <div
                  className={cn(
                    "text-[10px] font-semibold transition-all duration-300",
                    isActive
                      ? "text-primary"
                      : isDone
                        ? "text-emerald-400/60"
                        : "text-muted-foreground/20"
                  )}
                >
                  {isDone ? "✓" : s.label}
                </div>
                {i < STAGES.length - 1 && (
                  <div
                    className={cn(
                      "w-3 h-px transition-colors duration-300",
                      i < activeIdx ? "bg-emerald-400/30" : "bg-white/[0.06]"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
