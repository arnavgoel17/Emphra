"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, MessageSquare, Lock, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Moderation Engine",
    description: "Multi-layered content analysis that understands nuance, context, and intent — not just keywords.",
  },
  {
    icon: Brain,
    title: "Conversation Intelligence",
    description: "Deep contextual awareness that tracks conversation flow across sessions and participants.",
  },
  {
    icon: MessageSquare,
    title: "Smart Responses",
    description: "Context-aware reply suggestions that help users express themselves with clarity and confidence.",
  },
  {
    icon: Lock,
    title: "Safety & Compliance",
    description: "Enterprise-grade protection against spam, scams, and abuse. GDPR, SOC2, and CCPA compliant.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards showing engagement trends, sentiment shifts, and moderation effectiveness.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Edge-optimized infrastructure processing millions of messages with sub-50ms latency worldwide.",
  },
];

export function Features() {
  return (
    <section id="product" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Product
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Everything you need.</span>
            <br />
            <span className="text-foreground/40">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground leading-relaxed"
          >
            One API. Six pillars of conversation intelligence. Built for platforms that demand reliability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="group relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-500">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:border-gold/20 transition-colors duration-500">
                  <feature.icon
                    size={20}
                    className="text-foreground/40 group-hover:text-gold transition-colors duration-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 font-[family-name:var(--font-heading)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
