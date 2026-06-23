"use client";

import React, { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  Brain,
  FileText,
  Terminal,
  Lock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type {
  TabId,
  PlaygroundMessage,
  AnalysisResult,
  AnalyticsDataPoint,
  Insight,
} from "@/types/playground";

// Lazy load tab components for performance
const ModerationTab = lazy(() => import("./ModerationTab").then((m) => ({ default: m.ModerationTab })));
const SentimentTab = lazy(() => import("./SentimentTab").then((m) => ({ default: m.SentimentTab })));
const InsightsTab = lazy(() => import("./InsightsTab").then((m) => ({ default: m.InsightsTab })));
const SummaryTab = lazy(() => import("./SummaryTab").then((m) => ({ default: m.SummaryTab })));
const ApiResponseTab = lazy(() => import("./ApiResponseTab").then((m) => ({ default: m.ApiResponseTab })));
const TrustSafetyTab = lazy(() => import("./TrustSafetyTab").then((m) => ({ default: m.TrustSafetyTab })));

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "moderation", label: "Moderation", icon: <Shield size={11} /> },
  { id: "sentiment", label: "Sentiment", icon: <Activity size={11} /> },
  { id: "insights", label: "Insights", icon: <Brain size={11} /> },
  { id: "summary", label: "Summary", icon: <FileText size={11} /> },
  { id: "apiResponse", label: "API", icon: <Terminal size={11} /> },
  { id: "trustSafety", label: "Trust", icon: <Lock size={11} /> },
];

function TabSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-4 w-1/3 bg-white/[0.04] rounded animate-pulse" />
      <div className="h-24 w-full bg-white/[0.03] rounded-xl animate-pulse" />
      <div className="h-4 w-1/2 bg-white/[0.04] rounded animate-pulse" />
      <div className="h-16 w-full bg-white/[0.03] rounded-xl animate-pulse" />
    </div>
  );
}

interface IntelligencePanelProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  messages: PlaygroundMessage[];
  analyses: Record<string, AnalysisResult>;
  analytics: AnalyticsDataPoint[];
  insights: Insight[];
  summary: {
    executive: string;
    keyPoints: string[];
    takeaways: string[];
  };
  timeline: { index: number; preview: string; action: string; time: string }[];
  isProcessing: boolean;
}

export function IntelligencePanel({
  activeTab,
  onTabChange,
  messages,
  analyses,
  analytics,
  insights,
  summary,
  timeline,
  isProcessing,
}: IntelligencePanelProps) {
  const lastAnalysis =
    messages.length > 0
      ? analyses[messages[messages.length - 1]?.id]
      : null;

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-card/50">
      {/* Tab Bar */}
      <div className="border-b border-white/[0.06] bg-white/[0.02] shrink-0">
        <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabId)}>
          <div className="px-2 pt-2">
            <TabsList className="bg-transparent h-8 gap-0.5 p-0 w-full justify-start overflow-x-auto">
              {TABS.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 data-[state=active]:bg-white/[0.06] data-[state=active]:text-foreground text-muted-foreground/40 rounded-lg gap-1.5 whitespace-nowrap"
                >
                  {tab.icon}
                  <span className="hidden lg:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="min-h-[300px]">
            <Suspense fallback={<TabSkeleton />}>
              <TabsContent value="moderation" className="m-0">
                <ModerationTab
                  analysis={lastAnalysis}
                  analytics={analytics}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="sentiment" className="m-0">
                <SentimentTab
                  analysis={lastAnalysis}
                  analytics={analytics}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="insights" className="m-0">
                <InsightsTab insights={insights} isProcessing={isProcessing} />
              </TabsContent>

              <TabsContent value="summary" className="m-0">
                <SummaryTab
                  summary={summary}
                  timeline={timeline}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="apiResponse" className="m-0">
                <ApiResponseTab
                  analysis={lastAnalysis}
                  messages={messages}
                  analyses={analyses}
                  isProcessing={isProcessing}
                />
              </TabsContent>

              <TabsContent value="trustSafety" className="m-0">
                <TrustSafetyTab
                  analysis={lastAnalysis}
                  analytics={analytics}
                  isProcessing={isProcessing}
                />
              </TabsContent>
            </Suspense>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
