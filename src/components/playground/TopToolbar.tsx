"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  ChevronRight,
  Circle,
  Globe,
  Timer,
  RotateCcw,
  Download,
  Key,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShareableUrl } from "@/hooks/useShareableUrl";

interface TopToolbarProps {
  latencyMs: number;
  messageCount: number;
  isProcessing: boolean;
  onReset: () => void;
  onExport: () => void;
  onShare: () => void;
}

export function TopToolbar({
  latencyMs,
  messageCount,
  isProcessing,
  onReset,
  onExport,
  onShare,
}: TopToolbarProps) {
  const [copied, setCopied] = useState(false);
  const { encode, copyToClipboard } = useShareableUrl();

  const handleShare = async () => {
    const url = encode("current");
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    onShare();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-white/[0.06]"
    >
      <div className="w-full px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Breadcrumb */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-muted-foreground/60 hover:text-foreground transition-colors text-xs"
              >
                <Home size={12} className="mr-1 inline" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight size={10} className="text-muted-foreground/30" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-semibold text-xs">
                Playground
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Status Indicators */}
        <div className="flex items-center gap-3 md:gap-5 ml-auto sm:ml-0">
          <div className="flex items-center gap-1.5">
            <Circle
              size={6}
              className={cn(
                "fill-current",
                isProcessing
                  ? "text-amber-400 animate-pulse"
                  : "text-emerald-400"
              )}
            />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              {isProcessing ? "Processing" : "Online"}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Globe size={11} className="text-muted-foreground/40" />
            <span className="text-[10px] font-medium text-muted-foreground/50">
              Global Edge
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5">
            <Timer size={11} className="text-muted-foreground/40" />
            <span className="text-[10px] font-mono text-muted-foreground/50">
              {messageCount > 0 ? `${latencyMs}ms` : "—"}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground/40">
              {messageCount} msg{messageCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.04] gap-1"
            aria-label="Reset session"
          >
            <RotateCcw size={11} />
            <span className="hidden md:inline">Reset</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.04] gap-1"
            aria-label="Share playground"
          >
            {copied ? (
              <Check size={11} className="text-emerald-400" />
            ) : (
              <Share2 size={11} />
            )}
            <span className="hidden md:inline">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 hover:text-foreground hover:bg-white/[0.04] gap-1"
            aria-label="Export session"
          >
            <Download size={11} />
            <span className="hidden md:inline">Export</span>
          </Button>

          <Button
            size="sm"
            className="h-7 px-3 text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 gap-1 glow-gold-sm"
            aria-label="Get API access"
          >
            <Key size={11} />
            <span className="hidden sm:inline">Get API Access</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
