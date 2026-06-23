"use client";

import React from "react";
import { motion } from "framer-motion";

const brands = [
  "Discord", "Shopify", "Linear", "Vercel", "Stripe", "Notion", "Figma", "Raycast",
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-white/[0.04]">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-10"
        >
          Trusted by teams building the future of communication
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {brands.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="text-lg font-semibold tracking-tight text-foreground/[0.15] hover:text-foreground/40 transition-colors duration-500 cursor-default font-[family-name:var(--font-heading)]"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
