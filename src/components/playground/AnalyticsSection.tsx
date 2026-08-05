"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import type { AnalyticsDataPoint } from "@/types/playground";

interface AnalyticsSectionProps {
  analytics: AnalyticsDataPoint[];
}

const PIE_COLORS = [
  "oklch(0.65 0.12 150)",  // Normal — green
  "oklch(0.72 0.08 85)",   // Flagged — gold
  "oklch(0.55 0.15 250)",  // Reviewed — blue
  "oklch(0.55 0.15 25)",   // Blocked — red
];

export function AnalyticsSection({ analytics }: AnalyticsSectionProps) {
  const hasData = analytics.length > 0;

  // Compute message distribution
  const normalCount = analytics.filter((d) => d.toxicity < 30).length;
  const flaggedCount = analytics.filter((d) => d.toxicity >= 30 && d.toxicity < 60).length;
  const reviewedCount = analytics.filter((d) => d.toxicity >= 60 && d.toxicity < 80).length;
  const blockedCount = analytics.filter((d) => d.toxicity >= 80).length;

  const pieData = [
    { name: "Normal", value: normalCount },
    { name: "Flagged", value: flaggedCount },
    { name: "Reviewed", value: reviewedCount },
    { name: "Blocked", value: blockedCount },
  ].filter((d) => d.value > 0);

  // Compute health
  const avgHealth =
    hasData
      ? Math.round(analytics.reduce((s, d) => s + d.health, 0) / analytics.length)
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={12} className="text-primary/40" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
          Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {/* Chart 1: Toxicity Trend */}
        <div className="p-3 rounded-xl" style={{ backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px) saturate(160%)", background:"linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)", boxShadow:"0 0 0 0.5px rgba(255,255,255,0.09),inset 0 1px 0 rgba(255,255,255,0.11),0 4px 20px rgba(0,0,0,0.22)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-2">
            Toxicity Trend
          </p>
          <div className="h-24 w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="toxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.08 85)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.72 0.08 85)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="toxicity" stroke="oklch(0.72 0.08 85)" strokeWidth={1.5} fill="url(#toxGrad)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        {/* Chart 2: Sentiment Trend */}
        <div className="p-3 rounded-xl" style={{ backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px) saturate(160%)", background:"linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)", boxShadow:"0 0 0 0.5px rgba(255,255,255,0.09),inset 0 1px 0 rgba(255,255,255,0.11),0 4px 20px rgba(0,0,0,0.22)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-2">
            Sentiment Trend
          </p>
          <div className="h-24 w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics}>
                  <defs>
                    <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.15 250)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.55 0.15 250)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="sentiment" stroke="oklch(0.55 0.15 250)" strokeWidth={1.5} fill="url(#sentGrad)" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#000", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "10px" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        {/* Chart 3: Conversation Health */}
        <div className="p-3 rounded-xl" style={{ backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px) saturate(160%)", background:"linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)", boxShadow:"0 0 0 0.5px rgba(255,255,255,0.09),inset 0 1px 0 rgba(255,255,255,0.11),0 4px 20px rgba(0,0,0,0.22)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-2">
            Conversation Health
          </p>
          <div className="h-24 flex flex-col items-center justify-center">
            {hasData ? (
              <>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                    <motion.circle
                      cx="32" cy="32" r="28" fill="none"
                      stroke={avgHealth > 70 ? "oklch(0.65 0.12 150)" : avgHealth > 40 ? "oklch(0.72 0.08 85)" : "oklch(0.55 0.15 25)"}
                      strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={`${(avgHealth / 100) * 175.9} 175.9`}
                      initial={{ strokeDasharray: "0 175.9" }}
                      animate={{ strokeDasharray: `${(avgHealth / 100) * 175.9} 175.9` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-black font-mono text-foreground/70">
                      {avgHealth}
                    </span>
                  </div>
                </div>
                <p className="text-[8px] text-muted-foreground/25 mt-1">
                  {avgHealth > 70 ? "Healthy" : avgHealth > 40 ? "Moderate" : "At Risk"}
                </p>
              </>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>

        {/* Chart 4: Message Distribution */}
        <div className="p-3 rounded-xl" style={{ backdropFilter:"blur(24px) saturate(160%)", WebkitBackdropFilter:"blur(24px) saturate(160%)", background:"linear-gradient(145deg,rgba(255,255,255,0.04) 0%,rgba(255,255,255,0.015) 100%)", boxShadow:"0 0 0 0.5px rgba(255,255,255,0.09),inset 0 1px 0 rgba(255,255,255,0.11),0 4px 20px rgba(0,0,0,0.22)" }}>
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 mb-2">
            Message Distribution
          </p>
          <div className="h-24 flex items-center justify-center">
            {pieData.length > 0 ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-16 h-16 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={18}
                        outerRadius={30}
                        paddingAngle={2}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-0.5 flex-1">
                  {pieData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-[8px] text-muted-foreground/40">
                        {d.name} ({d.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyChart />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-[8px] text-muted-foreground/15 italic">Awaiting data…</p>
    </div>
  );
}
