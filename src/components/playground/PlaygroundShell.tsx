"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { usePlayground } from "@/hooks/usePlayground";
import { TopToolbar } from "./TopToolbar";
import { ConversationSimulator } from "./ConversationSimulator";
import { IntelligencePanel } from "./IntelligencePanel";
import { AnalyticsSection } from "./AnalyticsSection";
import { ExportModal } from "./ExportModal";
import { SCENARIOS } from "./PresetScenarios";
import type { ExportFormat } from "@/types/playground";

export function PlaygroundShell() {
  const {
    messages,
    analyses,
    activeTab,
    setActiveTab,
    isProcessing,
    processingStage,
    analytics,
    insights,
    summary,
    timeline,
    sendMessage,
    loadScenario,
    resetSession,
    exportSessionData,
    exportReportData,
  } = usePlayground();

  const [exportOpen, setExportOpen] = useState(false);
  const [latencyMs, setLatencyMs] = useState(0);

  // Track latency from latest analysis
  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const analysis = analyses[lastMsg?.id];
      if (analysis) {
        setLatencyMs(analysis.latencyMs);
      }
    }
  }, [messages, analyses]);

  // Load scenario from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scenarioId = params.get("scenario");
    if (scenarioId) {
      const scenario = SCENARIOS.find((s) => s.id === scenarioId);
      if (scenario) {
        loadScenario(scenario);
      }
    }
  }, [loadScenario]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExportOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setExportOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
        resetSession();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resetSession]);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      return format === "json" ? exportSessionData() : exportReportData();
    },
    [exportSessionData, exportReportData]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <TopToolbar
        latencyMs={latencyMs}
        messageCount={messages.length}
        isProcessing={isProcessing}
        onReset={resetSession}
        onExport={() => setExportOpen(true)}
        onShare={() => {}}
      />

      {/* Main Content */}
      <main className="w-full px-4 md:px-6 py-6 space-y-6">
        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Left: Conversation Simulator */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <ConversationSimulator
              messages={messages}
              analyses={analyses}
              isProcessing={isProcessing}
              processingStage={processingStage}
              activeScenario={null}
              onSendMessage={sendMessage}
              onLoadScenario={loadScenario}
              onReset={resetSession}
            />
          </motion.div>

          {/* Right: Intelligence Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <IntelligencePanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              messages={messages}
              analyses={analyses}
              analytics={analytics}
              insights={insights}
              summary={summary}
              timeline={timeline}
              isProcessing={isProcessing}
            />
          </motion.div>
        </div>

        {/* Analytics Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnalyticsSection analytics={analytics} />
        </motion.div>
      </main>

      {/* Export Modal */}
      <ExportModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        onExport={handleExport}
        messageCount={messages.length}
      />
    </div>
  );
}
