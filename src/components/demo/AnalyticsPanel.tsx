"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Shield, Activity } from "lucide-react";

interface AnalyticsPanelProps {
  history: { toxicity: number; sentiment: number; time: string }[];
}

export function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Shield size={16} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Toxicity Trend</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTox" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Area 
                  type="monotone" 
                  dataKey="toxicity" 
                  stroke="#0ea5e9" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTox)" 
                  animationDuration={1000}
                />
                <XAxis dataKey="time" hide />
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <Activity size={16} className="text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-white">Sentiment Variance</span>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSent)" 
                  animationDuration={1000}
                />
                <XAxis dataKey="time" hide />
                <YAxis domain={[-1, 1]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
                  itemStyle={{ color: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
