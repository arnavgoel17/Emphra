"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Trash2,
  User,
  Bot,
  Shield,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type {
  PlaygroundMessage,
  AnalysisResult,
  ConversationRole,
} from "@/types/playground";
import { ProcessingAnimation } from "./ProcessingAnimation";
import { MessageHoverCard } from "./MessageHoverCard";
import { PresetScenarios, SCENARIOS } from "./PresetScenarios";

interface ConversationSimulatorProps {
  messages: PlaygroundMessage[];
  analyses: Record<string, AnalysisResult>;
  isProcessing: boolean;
  processingStage: "idle" | "analyzing" | "moderating" | "generating" | "complete";
  activeScenario: string | null;
  onSendMessage: (text: string, role?: ConversationRole) => void;
  onLoadScenario: (scenario: typeof SCENARIOS[0]) => void;
  onReset: () => void;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
  user: <User size={12} />,
  system: <Sparkles size={12} />,
  assistant: <Bot size={12} />,
  moderator: <Shield size={12} />,
};

const ROLE_COLORS: Record<string, string> = {
  user: "bg-primary/15 text-primary border-primary/20",
  system: "bg-white/[0.04] text-muted-foreground/60 border-white/[0.06]",
  assistant: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  moderator: "bg-sky-500/10 text-sky-300 border-sky-500/20",
};

const MESSAGE_ALIGN: Record<string, string> = {
  user: "items-end",
  system: "items-start",
  assistant: "items-start",
  moderator: "items-start",
};

const MESSAGE_BUBBLE: Record<string, string> = {
  user: "bg-primary/20 text-foreground rounded-tr-sm border border-primary/10",
  system: "bg-white/[0.03] text-muted-foreground/70 rounded-tl-sm border border-white/[0.04] italic",
  assistant: "bg-purple-500/[0.07] text-foreground/90 rounded-tl-sm border border-purple-500/10",
  moderator: "bg-sky-500/[0.07] text-foreground/90 rounded-tl-sm border border-sky-500/10",
};

export function ConversationSimulator({
  messages,
  analyses,
  isProcessing,
  processingStage,
  activeScenario,
  onSendMessage,
  onLoadScenario,
  onReset,
}: ConversationSimulatorProps) {
  const [input, setInput] = useState("");
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit(e);
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{
        backdropFilter: "blur(32px) saturate(180%) brightness(1.06)",
        WebkitBackdropFilter: "blur(32px) saturate(180%) brightness(1.06)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.018) 50%, rgba(100,120,255,0.025) 100%)",
        boxShadow:
          "0 0 0 0.5px rgba(255,255,255,0.10), " +
          "inset 0 1px 0 rgba(255,255,255,0.14), " +
          "inset 0 -1px 0 rgba(0,0,0,0.12), " +
          "0 8px 40px rgba(0,0,0,0.30)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Conversation Simulator
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-6 w-6 text-muted-foreground/30 hover:text-foreground/60 hover:bg-white/[0.04]"
          aria-label="Clear messages"
        >
          <Trash2 size={12} />
        </Button>
      </div>

      {/* Processing Animation */}
      <div className="px-3 pt-2 shrink-0">
        <ProcessingAnimation stage={processingStage} />
      </div>

      {/* Message Feed */}
      <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
        <div className="space-y-3 min-h-[200px]">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const analysis = analyses[msg.id];
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={cn("relative flex flex-col", MESSAGE_ALIGN[msg.role])}
                  onMouseEnter={() => setHoveredMessageId(msg.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {/* Role + Timestamp */}
                  <div className="flex items-center gap-1.5 mb-0.5 px-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                        ROLE_COLORS[msg.role]
                      )}
                    >
                      {ROLE_ICONS[msg.role]}
                      {msg.sender}
                    </span>
                    <span className="text-[8px] text-muted-foreground/25">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {msg.status === "analyzing" && (
                      <span className="text-[8px] text-primary/60 animate-pulse">
                        analyzing...
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "relative max-w-[85%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed",
                      MESSAGE_BUBBLE[msg.role],
                      msg.flagged && "border-red-400/30 bg-red-400/[0.05]",
                      msg.status === "analyzing" &&
                        "border-primary/20 animate-pulse"
                    )}
                  >
                    {msg.text}

                    {/* Flagged indicator */}
                    {msg.flagged && (
                      <AlertTriangle
                        size={10}
                        className="absolute -top-1 -right-1 text-red-400"
                      />
                    )}

                    {/* Hover Card */}
                    <MessageHoverCard
                      message={msg}
                      analysis={analysis}
                      visible={hoveredMessageId === msg.id}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageCircleIcon />
              <p className="text-xs text-muted-foreground/30 mt-3 max-w-[200px]">
                Send a message or load a preset scenario to begin analysis
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div
        className="px-4 py-3 space-y-2.5 shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message to analyze…"
            className="border-0 text-foreground h-10 rounded-xl text-sm placeholder:text-muted-foreground/25 focus:ring-primary/20"
            style={{
              background: "rgba(0,0,0,0.25)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 0.5px rgba(255,255,255,0.07)",
            }}
            disabled={isProcessing}
          />
          <Button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (input.trim()) {
                onSendMessage(input.trim());
                setInput("");
              }
            }}
            size="icon"
            disabled={!input.trim() || isProcessing}
            className="h-10 w-10 bg-primary text-primary-foreground rounded-xl shrink-0 hover:bg-primary/90 disabled:opacity-30 transition-all"
            aria-label="Send message"
          >
            <Send size={14} />
          </Button>
        </form>

        {/* Preset Scenarios */}
        <PresetScenarios
          activeScenario={activeScenario}
          onSelect={onLoadScenario}
        />
      </div>
    </div>
  );
}

function MessageCircleIcon() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
      <Sparkles size={16} className="text-muted-foreground/20" />
    </div>
  );
}
