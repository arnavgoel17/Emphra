"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, MessageSquare, Activity, FileJson, Copy, Check } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { ModerationResult, SentimentResult, SmartReply } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ApiWorkbenchProps {
  moderation: ModerationResult | null;
  sentiment: SentimentResult | null;
  replies: SmartReply[];
  summary: string;
  history: { toxicity: number; time: string }[];
  ersScore: number;
  isAnalyzing?: boolean;
}

export function ApiWorkbench({ moderation, sentiment, replies, summary, history, ersScore, isAnalyzing = false }: ApiWorkbenchProps) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    const json = JSON.stringify({ moderation, sentiment, replies, summary }, null, 2);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-black/40 border border-white/10 rounded-2xl overflow-hidden glass-dark">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
            Emphra ERS Score: <span className={ersScore > 80 ? "text-green-500" : ersScore > 50 ? "text-yellow-500" : "text-red-500"}>{ersScore}/100</span>
        </div>
        <div className="flex items-center space-x-2">
            <div className={cn("w-2 h-2 rounded-full", isAnalyzing ? "bg-primary animate-pulse" : "bg-green-500")} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {isAnalyzing ? "Analyzing..." : "API: Online"}
            </span>
        </div>
      </div>
      <Tabs defaultValue="moderation" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <TabsList className="bg-black/40 border border-white/10 h-10">
            <TabsTrigger value="moderation" className="text-xs uppercase font-bold tracking-tight">
              <Shield className="w-3 h-3 mr-2" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="replies" className="text-xs uppercase font-bold tracking-tight">
              <MessageSquare className="w-3 h-3 mr-2" />
              Smart Replies
            </TabsTrigger>
            <TabsTrigger value="analysis" className="text-xs uppercase font-bold tracking-tight">
              <Activity className="w-3 h-3 mr-2" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="json" className="text-xs uppercase font-bold tracking-tight">
              <FileJson className="w-3 h-3 mr-2" />
              JSON
            </TabsTrigger>
          </TabsList>
          
          <button onClick={copyToClipboard} className="text-muted-foreground hover:text-white transition-colors">
            {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
          <TabsContent value="moderation" className="m-0 space-y-6">
            {isAnalyzing ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Toxicity Score</p>
                        <p className="text-3xl font-black text-white">{moderation?.toxicity ?? 0}%</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Action</p>
                        <Badge variant={moderation?.action === "block" ? "destructive" : moderation?.action === "warn" ? "secondary" : "default"} 
                            className="uppercase font-bold">
                        {moderation?.action ?? "PENDING"}
                        </Badge>
                    </div>
                </div>

                <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-3">Toxicity Trend (Last 10 Messages)</p>
                <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                        <linearGradient id="colorTox" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="toxicity" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorTox)" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip 
                        contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                        itemStyle={{ color: "#fff" }}
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
                </div>

                <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                    {moderation?.flagged ? (
                    <Badge variant="outline" className="border-red-500/30 bg-red-500/10 text-red-400">
                        Content flagged - review required
                    </Badge>
                    ) : (
                    <span className="text-sm text-muted-foreground italic">No issues detected</span>
                    )}
                </div>
                </div>
                </>
            )}
          </TabsContent>

          <TabsContent value="replies" className="m-0 space-y-4">
            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">AI-Generated Suggestions</p>
            {isAnalyzing ? (
                <div className="space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full mt-6" />
                </div>
            ) : (
                <>
                {replies.length ? (
                replies.map((reply, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                    <p className="text-sm text-white group-hover:text-primary transition-colors">{reply.text}</p>
                    </div>
                ))
                ) : (
                <p className="text-sm text-muted-foreground italic">Start chatting to see suggestions...</p>
                )}
                
                <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Conversation Summary</p>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <p className="text-sm text-white/90 leading-relaxed italic">&quot;{summary}&quot;</p>
                </div>
                </div>
                </>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="m-0 space-y-6">
            {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center p-8 space-y-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                </div>
            ) : (
                <>
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" 
                            style={{ animationDuration: "3s" }} />
                        <span className="text-2xl font-black text-white">{sentiment?.score ?? 0}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{sentiment?.label ?? "Analyzing..."}</h4>
                    <p className="text-sm text-muted-foreground">Current Emotional State</p>
                </div>
                
                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-red-400">Negative</span>
                        <span className="text-green-400">Positive</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sentiment?.score ?? 50}%` }}
                        className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" 
                        />
                    </div>
                </div>
                </>
            )}
          </TabsContent>

          <TabsContent value="json" className="m-0">
            {isAnalyzing ? (
                <Skeleton className="h-64 w-full" />
            ) : (
                <pre className="p-4 bg-black/60 rounded-xl border border-white/5 text-[11px] font-mono text-cyan-400 overflow-x-auto">
                {JSON.stringify({
                    moderation,
                    sentiment,
                    replies,
                    summary,
                    latency: "34ms",
                    status: "success"
                }, null, 2)}
                </pre>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
