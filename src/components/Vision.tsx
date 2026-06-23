"use client";

import React from "react";
import { motion } from "framer-motion";

export function Vision() {
  return (
    <section id="company" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 aurora" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Our Vision
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">
              We believe every online conversation deserves to be safe, intelligent, and meaningful.
            </span>
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            The internet&apos;s communication infrastructure was built for a different era. Emphra is
            rebuilding it from the ground up — one API call at a time — so platforms can focus on
            what matters: their communities.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
