"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Trash2, Sparkles, Shield, MessageSquare, Brain, Activity, 
  FileJson, User, Bot, AlertTriangle, CheckCircle, ChevronDown, 
  Settings, Zap, Download, Database, Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Message, ApiResponse } from "@/types";
import { 
  buildApiResponse, generateHumanLikeResponse
} from "@/lib/mock-api";
import { PRESET_SCENARIOS, TOXIC_EXAMPLES, SCAM_EXAMPLES } from "./DemoPresets";
import { ApiResponseViewer } from "./ApiResponseViewer";
import { AnalyticsPanel } from "./AnalyticsPanel";

export function EmphraPlayground() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [latency, setLatency] = useState(0);
  const [currentUser, setCurrentUser] = useState<Message["sender"]>("User A");
  const lastRequestTime = useRef<number>(0);
  
  // Detailed Perspective Scores
  const [perspectiveScores, setPerspectiveScores] = useState({
    toxicity: 0,
    insult: 0,
    threat: 0
  });
  
  // Safety Interstitial State
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [safetySuggestion, setSafetySuggestion] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string>("");
  
  // Risk Score State
  const [ers, setErs] = useState(100);

  // Settings
  const [settings, setSettings] = useState({
    strictness: 50,
    spamDetection: true,
    toxicityDetection: true,
    smartReplies: true,
    autoSummary: true,
    sentiment: true,
    memory: true,
    language: "English"
  });

  const [lastResponse, setLastResponse] = useState<ApiResponse | null>(null);
  const [history, setHistory] = useState<{ toxicity: number; sentiment: number; time: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string, sender: Message["sender"] = currentUser, force: boolean = false) => {
    let isMessageFlagged = false;
    // Safety Check for User A
    if (sender === "User A" && !force) {
      const startTime = Date.now();
      try {
        const res = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            text,
            history: messages.map(m => ({
              text: m.text,
              sender: m.sender,
              flagged: m.flagged
            }))
          }),
        });

        const perspectiveData = await res.json();
        setLatency(Date.now() - startTime);

        if (perspectiveData.error) throw new Error(perspectiveData.error);

        setPerspectiveScores({
          toxicity: perspectiveData.toxicity,
          insult: perspectiveData.insult,
          threat: perspectiveData.threat,
          profanity: perspectiveData.profanity,
          identity_attack: perspectiveData.identity_attack
        });
        if (perspectiveData.action !== "allow" && settings.toxicityDetection) {
          setPendingMessage(text);
          setEditingMessage(text);
          setSafetySuggestion(perspectiveData.suggestion || "Let's keep the conversation respectful.");
          setIsSafetyOpen(true);
          return;
        }        
        isMessageFlagged = perspectiveData.flagged;
      } catch (error) {
        console.error("Moderation Error:", error);
        toast.error("Perspective API unavailable, using local moderation.");
        const fallback = buildApiResponse([...messages, { id: "temp", text, sender, timestamp: new Date() }], settings);
        if (fallback.toxicity > 30 && settings.toxicityDetection) {
          setPendingMessage(text);
          setSafetySuggestion(fallback.suggestion || "Let's keep the conversation respectful.");
          setIsSafetyOpen(true);
          return;
        }
        isMessageFlagged = fallback.action !== "allow";
      }
    }

    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      timestamp: new Date(),
      flagged: isMessageFlagged
    };
    
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // API Call Simulation for other features
    const response = buildApiResponse(updatedMessages, settings);
    setLastResponse(response);
    setHistory(prev => [...prev, { 
      toxicity: response.toxicity, 
      sentiment: response.sentiment.score, 
      time: new Date().toLocaleTimeString() 
    }].slice(-20));

    // Update ERS if forced harmful message
    if (force && response.ers_impact > 0) {
      setErs(prev => Math.max(0, prev - response.ers_impact));
    }

    if (response.action === "block" && settings.toxicityDetection && sender !== "Moderator Bot") {
      toast.error("Message blocked by Emphra AI", {
        description: `Toxicity score: ${response.toxicity}%`
      });
      return;
    }

    if (sender !== "Moderator Bot") {
      setIsTyping(true);
      
      try {
        const botRes = await fetch("/api/moderate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            mode: "chat",
            text,
            history: messages.map(m => ({
                text: m.text,
                sender: m.sender
            }))
          }),
        });
        const botData = await botRes.json();
        
        const botMsg: Message = {
          id: Math.random().toString(36).substring(7),
          text: botData.reply || "I'm here to help!",
          sender: "Moderator Bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } catch (e) {
         console.error("Bot AI generation failed:", e);
         // Last resort fallback
         const botMsg: Message = {
          id: Math.random().toString(36).substring(7),
          text: "I am having trouble connecting to my AI core right now.",
          sender: "Moderator Bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSafetyConfirm = (action: "manual" | "suggested" | "force") => {
    if (!pendingMessage) return;
    
    if (action === "force") {
      handleSendMessage(pendingMessage, currentUser, true);
      setErs(prev => Math.max(0, prev - 25));
    } else {
      const finalMsg = action === "suggested" ? safetySuggestion! : editingMessage;
      handleSendMessage(finalMsg, currentUser, action === "manual");
    }
    
    setIsSafetyOpen(false);
    setPendingMessage(null);
  };

  const handlePresetLoad = (scenario: typeof PRESET_SCENARIOS[0]) => {
    setMessages(scenario.messages);
    setErs(100);
    const response = buildApiResponse(scenario.messages, settings);
    setLastResponse(response);
    toast.success(`Loaded scenario: ${scenario.name}`);
  };

  const handleExport = () => {
    const data = JSON.stringify({ messages, settings, analytics: history }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emphra-conversation.json";
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[800px]">
      
      {/* LEFT PANEL: Chat Simulator */}
      <div className="lg:col-span-5 flex flex-col glass-dark rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <MessageSquare className="text-primary" size={20} />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-tighter">Chat Simulator</h3>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">ID: EMPHRA-SIM-01</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end mr-4">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">Risk Score (ERS)</span>
              <div className="flex items-center space-x-3">
                <Progress value={ers} className="w-24 h-1.5 bg-white/10" indicatorClassName={cn(
                  ers > 70 ? "bg-green-500" : ers > 40 ? "bg-amber-500" : "bg-red-500"
                )} />
                <span className={cn(
                  "text-xs font-black font-mono",
                  ers > 70 ? "text-green-400" : ers > 40 ? "text-amber-400" : "text-red-400"
                )}>{ers}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-bold uppercase tracking-widest border border-white/10">
                  <User size={14} className="mr-2" />
                  {currentUser}
                  <ChevronDown size={14} className="ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                <DropdownMenuItem onClick={() => setCurrentUser("User A")}>User A</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentUser("User B")}>User B</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentUser("Moderator Bot")}>Moderator Bot</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6 h-[500px]">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex flex-col",
                    msg.sender === "User A" ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{msg.sender}</span>
                    <span className="text-[9px] text-muted-foreground/50">{msg.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm max-w-[85%] leading-relaxed",
                    msg.sender === "User A" 
                      ? "bg-primary text-primary-foreground font-medium rounded-tr-none shadow-lg shadow-primary/10" 
                      : msg.sender === "Moderator Bot"
                        ? "bg-purple-500/20 text-purple-200 border border-purple-500/30 rounded-tl-none italic"
                        : "bg-white/10 text-white border border-white/10 rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              handleSendMessage(input);
              setInput("");
            }}
            className="flex space-x-3"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message as ${currentUser}...`}
              className="bg-black/50 border-white/10 text-white h-12 rounded-xl"
            />
            <Button type="submit" size="icon" className="h-12 w-12 bg-primary text-primary-foreground rounded-xl shrink-0">
              <Send size={20} />
            </Button>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest h-9">
                  <Database size={12} className="mr-2" />
                  Presets
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 border-white/10 text-white w-56">
                {PRESET_SCENARIOS.map((s) => (
                  <DropdownMenuItem key={s.name} onClick={() => handlePresetLoad(s)}>
                    {s.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="outline" size="sm" 
              className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest h-9 text-red-400 hover:text-red-300"
              onClick={() => handleSendMessage(TOXIC_EXAMPLES[Math.floor(Math.random() * TOXIC_EXAMPLES.length)])}
            >
              <Sparkles size={12} className="mr-2" />
              Toxic
            </Button>

            <Button 
              variant="outline" size="sm" 
              className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest h-9 text-amber-400 hover:text-amber-300"
              onClick={() => handleSendMessage(SCAM_EXAMPLES[Math.floor(Math.random() * SCAM_EXAMPLES.length)])}
            >
              <AlertTriangle size={12} className="mr-2" />
              Scam
            </Button>

            <Button 
              variant="outline" size="sm" 
              className="bg-white/5 border-white/10 text-[10px] uppercase font-bold tracking-widest h-9"
              onClick={() => setMessages([])}
            >
              <Trash2 size={12} className="mr-2" />
              Reset
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full h-8 text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-black hover:text-white transition-colors"
            onClick={handleExport}
          >
            <Download size={12} className="mr-2" />
            Export Conversation JSON
          </Button>
        </div>
      </div>

      {/* RIGHT PANEL: API OUTPUT + CONTROLS */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* Controls Section */}
        <div className="glass-dark p-6 rounded-3xl border border-white/10">
          <div className="flex items-center space-x-2 mb-6">
            <Settings size={18} className="text-primary" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">API Configuration</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Moderation Strictness</span>
                <Badge className="bg-primary/20 text-primary border-primary/30">{settings.strictness}%</Badge>
              </div>
              <Slider 
                value={[settings.strictness]} 
                onValueChange={(val) => setSettings({...settings, strictness: val[0]})}
                max={100} step={1}
              />
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-2">
                  <Languages size={14} className="text-muted-foreground" />
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Context Language</span>
                </div>
                <Select value={settings.language} onValueChange={(val) => setSettings({...settings, language: val})}>
                  <SelectTrigger className="w-32 h-8 text-[10px] bg-white/5 border-white/10 uppercase font-bold tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Hindi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ControlToggle label="Spam Detection" checked={settings.spamDetection} onChange={(v) => setSettings({...settings, spamDetection: v})} />
              <ControlToggle label="Toxicity" checked={settings.toxicityDetection} onChange={(v) => setSettings({...settings, toxicityDetection: v})} />
              <ControlToggle label="Smart Replies" checked={settings.smartReplies} onChange={(v) => setSettings({...settings, smartReplies: v})} />
              <ControlToggle label="Sentiment" checked={settings.sentiment} onChange={(v) => setSettings({...settings, sentiment: v})} />
              <ControlToggle label="Memory" checked={settings.memory} onChange={(v) => setSettings({...settings, memory: v})} />
              <ControlToggle label="Auto Summary" checked={settings.autoSummary} onChange={(v) => setSettings({...settings, autoSummary: v})} />
            </div>
          </div>
        </div>

        {/* Output Tabs */}
        <div className="flex-1 glass-dark rounded-3xl border border-white/10 overflow-hidden flex flex-col min-h-[500px]">
          <Tabs defaultValue="moderation" className="flex-1 flex flex-col">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <TabsList className="bg-black/40 border border-white/10 h-10">
                <TabsTrigger value="moderation" className="text-[10px] uppercase font-black tracking-widest px-4">
                  <Shield size={12} className="mr-2" />
                  Moderation
                </TabsTrigger>
                <TabsTrigger value="replies" className="text-[10px] uppercase font-black tracking-widest px-4">
                  <MessageSquare size={12} className="mr-2" />
                  Replies
                </TabsTrigger>
                <TabsTrigger value="analysis" className="text-[10px] uppercase font-black tracking-widest px-4">
                  <Activity size={12} className="mr-2" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="json" className="text-[10px] uppercase font-black tracking-widest px-4">
                  <FileJson size={12} className="mr-2" />
                  JSON
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-3 px-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">API: Online</span>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <TabsContent value="moderation" className="m-0 space-y-6">
                {/* ERS Status Card */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Activity className={cn("w-5 h-5", ers > 70 ? "text-green-400" : "text-red-400")} />
                    <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Dynamic Chat Overview</p>
                      <p className="text-xs text-white font-bold">{ers > 70 ? "Low Risk Environment" : "Elevated Risk Detected"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge variant="outline" className="bg-white/5 text-[8px] font-black uppercase mb-1 border-white/10">
                      Powered by Google Perspective AI
                    </Badge>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Contextual ERS</p>
                      <p className={cn("text-lg font-black font-mono leading-none", ers > 70 ? "text-green-400" : "text-red-400")}>{ers}</p>
                    </div>
                  </div>
                </div>

                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-3xl animate-pulse">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest text-primary">Analyzing with Perspective AI...</p>
                    <p className="text-[10px] text-muted-foreground mt-2">REQUEST_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <OutputCard label="Toxicity Score" value={`${Math.round(perspectiveScores.toxicity * 100)}%`} subLabel="Primary Metric" />
                      <OutputCard 
                        label="Decision" 
                        value={lastResponse?.action.toUpperCase() ?? "PENDING"} 
                        subLabel="Safety Action"
                        highlight={lastResponse?.action === "block" ? "red" : lastResponse?.action === "warn" ? "yellow" : "green"}
                      />
                      <OutputCard label="Fetch Latency" value={`${latency}ms`} subLabel="API Response Time" />
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                      <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">High-Fidelity Attribute Scoring</h4>
                      
                      <ScoreBar label="Toxicity" value={perspectiveScores.toxicity} color="bg-red-500" />
                      <ScoreBar label="Insult" value={perspectiveScores.insult} color="bg-orange-500" />
                      <ScoreBar label="Threat" value={perspectiveScores.threat} color="bg-rose-500" />
                      <ScoreBar label="Profanity" value={perspectiveScores.profanity} color="bg-amber-500" />
                      <ScoreBar label="Identity Attack" value={perspectiveScores.identity_attack} color="bg-purple-500" />
                    </div>

                    {/* Analysis Section */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">AI Contextual Analysis</h4>
                      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <p className="text-xs text-white/80 italic">&quot;{lastResponse?.contextualSummary ?? "Awaiting analysis..."}&quot;</p>
                      </div>
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="replies" className="m-0 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Contextual Smart Replies</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {lastResponse?.smart_replies.map((reply, i) => (
                      <div 
                        key={i} 
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-all cursor-pointer group flex items-center justify-between"
                        onClick={() => handleSendMessage(reply, "Moderator Bot")}
                      >
                        <span className="text-sm text-white group-hover:text-primary transition-colors">{reply}</span>
                        <Zap size={14} className="text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    ))}
                    {!lastResponse?.smart_replies.length && <p className="text-xs text-muted-foreground italic">Waiting for conversation context...</p>}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">AI Conversation Summary</h4>
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Brain size={48} className="text-primary" />
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed italic relative z-10">&quot;{lastResponse?.summary ?? "Analyze a message to generate a summary."}&quot;</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="m-0 space-y-8">
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10">
                  <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-4 relative">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent" 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-3xl font-black text-white">{lastResponse?.sentiment.score.toFixed(2) ?? "0.00"}</span>
                  </div>
                  <h4 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{lastResponse?.sentiment.label ?? "WAITING"}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Emotional Sentiment Index</p>
                </div>

                <AnalyticsPanel history={history} />
              </TabsContent>

              <TabsContent value="json" className="m-0 h-full min-h-[400px]">
                <ApiResponseViewer response={lastResponse} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
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
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-white">{label}</span>
        <span className="text-muted-foreground">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value * 100}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

function ControlToggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function OutputCard({ label, value, subLabel, highlight }: { label: string, value: string, subLabel: string, highlight?: "red" | "green" | "yellow" }) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
      <span className={cn(
        "text-2xl font-black leading-none my-2",
        highlight === "red" ? "text-red-400" : highlight === "green" ? "text-green-400" : highlight === "yellow" ? "text-amber-400" : "text-white"
      )}>
        {value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{subLabel}</span>
    </div>
  );
}
