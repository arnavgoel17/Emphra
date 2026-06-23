"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Copy, Check, X, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ExportFormat } from "@/types/playground";

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ExportFormat) => string;
  messageCount: number;
}

export function ExportModal({
  open,
  onOpenChange,
  onExport,
  messageCount,
}: ExportModalProps) {
  const [copied, setCopied] = useState<ExportFormat | null>(null);

  const handleDownload = (format: ExportFormat) => {
    const data = onExport(format);
    const ext = format === "json" ? "json" : "txt";
    const mime = format === "json" ? "application/json" : "text/plain";
    const blob = new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emphra-playground-export.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async (format: ExportFormat) => {
    const data = onExport(format);
    await navigator.clipboard.writeText(data);
    setCopied(format);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-2xl border-white/[0.08] text-foreground max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Download size={14} className="text-primary" />
            Export Session
          </DialogTitle>
          <p className="text-[10px] text-muted-foreground/40 mt-1">
            {messageCount} message{messageCount !== 1 ? "s" : ""} in current session
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {/* JSON Export */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileJson size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground/70">JSON Data</p>
                <p className="text-[9px] text-muted-foreground/30">
                  Full session data with analyses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy("json")}
                className="h-7 w-7 text-muted-foreground/30 hover:text-foreground/60"
                aria-label="Copy JSON"
              >
                {copied === "json" ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={12} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload("json")}
                className="h-7 w-7 text-muted-foreground/30 hover:text-foreground/60"
                aria-label="Download JSON"
              >
                <Download size={12} />
              </Button>
            </div>
          </div>

          {/* Report Export */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <FileText size={14} className="text-sky-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground/70">Text Report</p>
                <p className="text-[9px] text-muted-foreground/30">
                  Formatted analysis summary
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy("report")}
                className="h-7 w-7 text-muted-foreground/30 hover:text-foreground/60"
                aria-label="Copy report"
              >
                {copied === "report" ? (
                  <Check size={12} className="text-emerald-400" />
                ) : (
                  <Copy size={12} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload("report")}
                className="h-7 w-7 text-muted-foreground/30 hover:text-foreground/60"
                aria-label="Download report"
              >
                <Download size={12} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
