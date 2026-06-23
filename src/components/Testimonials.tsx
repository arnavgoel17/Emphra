"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Emphra reduced our moderation workload by 80%. What used to take a team of five now runs autonomously.",
    name: "Sarah Chen",
    role: "VP of Platform, Nexus",
    initials: "SC",
  },
  {
    quote: "The contextual memory feature is unlike anything we&apos;ve seen. It genuinely understands conversation flow.",
    name: "Marcus Thorne",
    role: "CTO, Streamline",
    initials: "MT",
  },
  {
    quote: "We evaluated every moderation API on the market. Emphra was the only one that didn&apos;t produce false positives.",
    name: "Elena Rodriguez",
    role: "Head of Trust & Safety, Commons",
    initials: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Trusted by teams</span>
            <br />
            <span className="text-foreground/40">who demand better.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500"
            >
              <p className="text-sm text-foreground/70 leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-gold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
