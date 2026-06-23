"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Activity, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlaygroundCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/[0.06] border border-primary/[0.12] mb-6"
          >
            <Sparkles size={11} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
              Interactive Experience
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            <span className="text-ivory-gradient">See it in action.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground/60 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Try the interactive playground — no API key required. Experience
            real-time moderation, sentiment analysis, and smart insights.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            {[
              { icon: <Shield size={11} />, label: "Moderation" },
              { icon: <Activity size={11} />, label: "Sentiment" },
              { icon: <Brain size={11} />, label: "Smart Insights" },
            ].map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[10px] font-semibold text-muted-foreground/50"
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-8 font-bold uppercase tracking-widest text-xs glow-gold-sm group"
            >
              <a href="/demo">
                Launch Playground
                <ArrowRight
                  size={14}
                  className="ml-2 group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
