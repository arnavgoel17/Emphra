"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Message } from "@/types";

interface ChatSimulatorProps {
  onMessageSent: (text: string, forceSend?: boolean) => void;
  messages: Message[];
  isTyping: boolean;
  onReset: () => void;
  onGenerateToxic: () => void;
  blockedMessage?: string | null;
}

export function ChatSimulator({ onMessageSent, messages, isTyping, onReset, onGenerateToxic, blockedMessage }: ChatSimulatorProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent, force: boolean = false) => {
    e.preventDefault();
    const textToSend = force ? blockedMessage : input;
    if (!textToSend?.trim()) return;
    onMessageSent(textToSend, force);
    setInput("");
  };

  const handleManualSend = (text: string) => {
      // In a real app, this logic would come from a callback from the container
      // but here we simplify by detecting the block and providing the feedback.
      // For this simulator, we rely on the container to signal if blocked.
  };

  return (
    <div className="flex flex-col h-[600px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden glass-dark">
      {/* ... header ... */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-bold text-white tracking-tight uppercase">Live Simulator</span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={onGenerateToxic} title="Generate Toxic Message" className="h-8 w-8 hover:bg-red-500/20 text-red-400">
            <Sparkles size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onReset} title="Reset Chat" className="h-8 w-8 hover:bg-white/10 text-muted-foreground">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full",
                msg.isUser ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] flex items-start space-x-3",
                msg.isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  msg.isUser ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/10 text-white border border-white/10"
                )}>
                  {msg.isUser ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                  msg.isUser 
                    ? "bg-primary text-primary-foreground font-medium rounded-tr-none" 
                    : "bg-white/5 text-white border border-white/10 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex space-x-1">
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10 flex space-x-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message to test Emphra..."
          className="bg-black/50 border-white/10 text-white h-12 rounded-xl focus:ring-primary/50"
        />
        <Button type="submit" size="icon" className="h-12 w-12 bg-primary text-primary-foreground rounded-xl shrink-0 transition-transform active:scale-95">
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}
