"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Circle,
  Globe,
  Timer,
  RotateCcw,
  Download,
  Key,
  Share2,
  Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useShareableUrl } from "@/hooks/useShareableUrl";

interface TopToolbarProps {
  latencyMs: number;
  messageCount: number;
  isProcessing: boolean;
  activeScenario: string | null;
  onReset: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function TopToolbar({
  latencyMs,
  messageCount,
  isProcessing,
  activeScenario,
  onReset,
  onExport,
  onShare,
}: TopToolbarProps) {
  const [copied, setCopied] = useState(false);
  const { encode, copyToClipboard } = useShareableUrl();

  const handleShare = async () => {
    const scenarioId = activeScenario ?? "current";
    const url = encode(scenarioId);
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onShare();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 flex justify-center px-4 pt-3 pb-1.5"
    >
      {/* Liquid Glass pill */}
      <div
        className="relative w-full max-w-6xl rounded-[18px] overflow-hidden"
        style={{
          backdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
          WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.15)",
          // Base tint — near-white at very low opacity so content bleeds through
          background:
            "linear-gradient(135deg, " +
            "rgba(255,255,255,0.045) 0%, " +
            "rgba(255,255,255,0.025) 45%, " +
            "rgba(100,120,255,0.04) 75%, " +
            "rgba(200,170,100,0.03) 100%)",
          boxShadow: [
            // outer border glow
            "0 0 0 0.75px rgba(255,255,255,0.14)",
            // inner top specular (the "glass rim catching light")
            "inset 0 1.5px 0 rgba(255,255,255,0.22)",
            // inner bottom shadow
            "inset 0 -1px 0 rgba(0,0,0,0.18)",
            // left edge specular
            "inset 1px 0 0 rgba(255,255,255,0.06)",
            // depth shadow below the pill
            "0 8px 32px rgba(0,0,0,0.35)",
            "0 2px 8px rgba(0,0,0,0.2)",
          ].join(", "),
        }}
      >
        {/* Diagonal sheen — the "refraction sweep" */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(110deg, " +
              "rgba(255,255,255,0.05) 0%, " +
              "rgba(255,255,255,0.02) 25%, " +
              "transparent 50%, " +
              "rgba(180,160,255,0.03) 80%, " +
              "transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-11 px-4 md:px-5 flex items-center gap-2.5">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-[14px] font-bold tracking-tighter text-white/88 font-[family-name:var(--font-heading)] hover:text-white transition-colors duration-200"
          >
            EMPHRA
          </Link>

          {/* Divider + Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-white/20">
            <span className="h-3 w-px bg-white/[0.13]" />
            <ChevronRight size={10} />
            <span className="text-[10.5px] font-semibold text-white/45 tracking-wide">
              Playground
            </span>
          </div>

          <div className="flex-1" />

          {/* Status indicators */}
          <div className="hidden md:flex items-center gap-1.5">
            <LiquidPill>
              <Circle
                size={5}
                className={cn(
                  "fill-current shrink-0",
                  isProcessing
                    ? "text-amber-400 animate-pulse"
                    : "text-emerald-400"
                )}
              />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/55">
                {isProcessing ? "Processing" : "Live"}
              </span>
            </LiquidPill>

            <LiquidPill>
              <Globe size={9} className="text-white/40 shrink-0" />
              <span className="text-[9px] text-white/40">Edge</span>
            </LiquidPill>

            <LiquidPill>
              <Timer size={9} className="text-white/40 shrink-0" />
              <span className="text-[9px] font-mono text-white/40">
                {messageCount > 0 ? `${latencyMs}ms` : "—"}
              </span>
            </LiquidPill>
          </div>

          {/* Hairline divider */}
          <span
            aria-hidden
            className="hidden md:block h-3.5 w-px bg-white/[0.10]"
          />

          {/* Ghost action buttons */}
          <div className="flex items-center">
            <GhostBtn onClick={onReset} label="Reset">
              <RotateCcw size={11} />
              <span className="hidden md:inline">Reset</span>
            </GhostBtn>

            <GhostBtn onClick={handleShare} label="Share">
              {copied ? (
                <Check size={11} className="text-emerald-400" />
              ) : (
                <Share2 size={11} />
              )}
              <span className="hidden md:inline">Share</span>
            </GhostBtn>

            <GhostBtn onClick={onExport} label="Export">
              <Download size={11} />
              <span className="hidden md:inline">Export</span>
            </GhostBtn>
          </div>

          {/* CTA — gold-tinted liquid glass pill */}
          <motion.button
            whileHover={{ scale: 1.03, filter: "brightness(1.15)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 h-7 px-3 rounded-xl text-[9px] font-bold uppercase tracking-widest cursor-pointer"
            style={{
              color: "oklch(0.9 0.06 80)",
              background:
                "linear-gradient(135deg, " +
                "oklch(0.72 0.08 85 / 0.28) 0%, " +
                "oklch(0.80 0.06 88 / 0.16) 100%)",
              boxShadow: [
                "inset 0 1.5px 0 oklch(0.9 0.06 85 / 0.30)",
                "inset 0 -1px 0 rgba(0,0,0,0.15)",
                "0 0 0 0.75px oklch(0.72 0.08 85 / 0.30)",
                "0 0 16px oklch(0.72 0.08 85 / 0.18)",
              ].join(", "),
            }}
            aria-label="Get API access"
          >
            <Key size={11} />
            <span className="hidden sm:inline">Get API Access</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/** Mini glass pill for status badges */
function LiquidPill({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center gap-1 h-[18px] px-2 rounded-full"
      style={{
        background: "rgba(255,255,255,0.05)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 0.5px rgba(255,255,255,0.07)",
      }}
    >
      {children}
    </div>
  );
}

/** Ghost text+icon button that gets a faint glass fill on hover */
function GhostBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.07)",
        color: "rgba(255,255,255,0.8)",
      }}
      whileTap={{ scale: 0.93 }}
      transition={{ duration: 0.12 }}
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-1.5 h-7 px-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest text-white/40 cursor-pointer"
      style={{ background: "transparent" }}
    >
      {children}
    </motion.button>
  );
}
