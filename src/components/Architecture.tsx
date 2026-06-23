"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const steps = [
  { label: "User Message", sublabel: "Incoming conversation data" },
  { label: "Processing Layer", sublabel: "Context assembly & enrichment" },
  { label: "Moderation", sublabel: "Content analysis & safety checks" },
  { label: "Intelligence", sublabel: "Sentiment, intent & memory" },
  { label: "Insights", sublabel: "Structured response & analytics" },
  { label: "Platform Response", sublabel: "Delivered in under 50ms" },
];

export function Architecture() {
  return (
    <section id="solutions" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 aurora" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Architecture
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">How messages flow</span>
            <br />
            <span className="text-foreground/40">through Emphra.</span>
          </motion.h2>
        </div>

        <div className="max-w-xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="relative flex items-start gap-5 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors duration-500">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-gold font-[family-name:var(--font-heading)]">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-start pl-9 py-2">
                  <ArrowDown size={14} className="text-white/[0.08]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
