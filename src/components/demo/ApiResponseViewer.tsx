"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "./MockApiEngine";

interface ApiResponseViewerProps {
  response: ApiResponse | null;
}

export function ApiResponseViewer({ response }: ApiResponseViewerProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!response) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-black/40 rounded-xl border border-white/10">
        <Terminal size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-mono">Waiting for API request...</p>
      </div>
    );
  }

  return (
    <div className="relative group h-full flex flex-col">
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8 bg-white/10 hover:bg-white/20 text-white"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </Button>
      </div>

      <div className="flex-1 bg-black/60 rounded-xl border border-white/10 p-6 font-mono text-[11px] leading-relaxed overflow-auto scrollbar-thin scrollbar-thumb-white/10">
        <div className="flex items-center space-x-2 mb-4 text-primary">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-bold uppercase tracking-widest">HTTP 200 OK</span>
          <span className="text-muted-foreground ml-2">[{response.latency}]</span>
        </div>
        
        <pre className="text-cyan-400">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
}
