"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChatSimulator } from "./ChatSimulator";
import { ApiWorkbench } from "./ApiWorkbench";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { useChatPlayground } from "@/hooks/useChatPlayground";

const TOXIC_EXAMPLES = [
  "You are such an idiot, I hate you!",
  "Buy this crypto scam now for free money!",
  "I'm going to kill your account if you don't stop.",
  "This service is absolute trash, worst experience ever.",
  "I am so excited to use this new API, it looks great!"
];

export function PlaygroundContainer() {
  const {
    messages,
    isTyping,
    strictness,
    setStrictness,
    enableModeration,
    setEnableModeration,
    moderation,
    sentiment,
    replies,
    summary,
    history,
    ersScore,
    isSafetyOpen,
    setIsSafetyOpen,
    pendingMessage,
    safetySuggestion,
    sendMessage,
    resetChat
  } = useChatPlayground();

  const [editingMessage, setEditingMessage] = useState("");

  const handleGenerateToxic = () => {
    const randomMsg = TOXIC_EXAMPLES[Math.floor(Math.random() * TOXIC_EXAMPLES.length)];
    sendMessage(randomMsg);
  };

  const handleSafetyConfirm = (action: "manual" | "suggested" | "force") => {
    if (!pendingMessage) return;
    
    if (action === "force") {
      sendMessage(pendingMessage, true);
    } else {
      const finalMsg = action === "suggested" ? safetySuggestion! : editingMessage;
      sendMessage(finalMsg, action === "manual");
    }
    
    setIsSafetyOpen(false);
  };

  // Sync editing message when dialog opens
  React.useEffect(() => {
    if (isSafetyOpen && pendingMessage) {
        setEditingMessage(pendingMessage);
    }
  }, [isSafetyOpen, pendingMessage]);

  return (
    <section id="demo" className="py-24 bg-black relative">
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-12">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tighter mb-6"
            >
              Interactive Playground: <span className="text-primary-gradient">Test Emphra Live.</span>
            </motion.h2>
            <p className="text-lg text-muted-foreground">
              Experience the power of our API in real-time. Type messages, adjust moderation strictness, 
              and see how Emphra analyzes every interaction with millisecond latency.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl w-full lg:w-auto min-w-[300px] space-y-6">
            <div className="flex items-center justify-between space-x-8">
              <div>
                <p className="text-sm font-bold text-white uppercase tracking-wider">Moderation</p>
                <p className="text-xs text-muted-foreground">Enable AI safety layer</p>
              </div>
              <Switch 
                checked={enableModeration} 
                onCheckedChange={setEnableModeration} 
                aria-label="Toggle AI Moderation"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-sm font-bold text-white uppercase tracking-wider">Strictness</p>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{strictness}</Badge>
              </div>
              <Slider 
                defaultValue={[50]} 
                max={100} 
                step={50} 
                aria-label="Moderation Strictness"
                onValueChange={(val) => {
                  if (val[0] === 0) setStrictness("Low");
                  else if (val[0] === 50) setStrictness("Medium");
                  else setStrictness("High");
                }}
              />
            </div>
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-white uppercase tracking-tighter">System Status: Online</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">API Node: us-east-1 | Latency: 34ms</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <ChatSimulator 
              messages={messages} 
              onMessageSent={sendMessage} 
              isTyping={isTyping}
              onReset={resetChat}
              onGenerateToxic={handleGenerateToxic}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <ApiWorkbench 
              moderation={moderation}
              sentiment={sentiment}
              replies={replies}
              summary={summary}
              history={history}
              ersScore={ersScore}
              isAnalyzing={isTyping}
            />
          </motion.div>
        </div>
      </div>

      {/* Safety Interstitial Dialog */}
      <Dialog open={isSafetyOpen} onOpenChange={setIsSafetyOpen}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-md rounded-3xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
              <AlertTriangle className="text-amber-500" size={24} />
            </div>
            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Potentially Harmful Content</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Our AI detected that your message may violate community guidelines. Sending this will impact your 
              <span className="text-white font-bold mx-1">Emotional Risk Score (ERS)</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-2">Edit your message</p>
              <Input 
                value={editingMessage}
                onChange={(e) => setEditingMessage(e.target.value)}
                className="bg-black/50 border-white/10 text-white"
              />
            </div>
            
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl cursor-pointer hover:bg-primary/20 transition-colors" onClick={() => handleSafetyConfirm("suggested")}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black uppercase text-primary">Suggested Safe Alternative</p>
                <Badge className="bg-primary text-primary-foreground text-[8px] font-black">AI OPTIMIZED</Badge>
              </div>
              <p className="text-sm font-medium text-white">&quot;{safetySuggestion}&quot;</p>
            </div>
          </div>

          <DialogFooter className="grid grid-cols-1 gap-3 sm:space-x-0">
            <Button 
              variant="outline" 
              className="border-red-500/50 text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase tracking-widest h-12 rounded-xl"
              onClick={() => handleSafetyConfirm("force")}
            >
              Send Anyway (Penalizes ERS)
            </Button>
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-primary/20"
              onClick={() => handleSafetyConfirm("suggested")}
            >
              Apply Suggestion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
