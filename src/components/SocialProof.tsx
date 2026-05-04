"use client";

import React from "react";
import { motion } from "framer-motion";

const brands = [
  "Meta", "Snapchat", "Discord", "Reddit", "Shopify", "Telegram", "Slack", "Twitch"
];

export function SocialProof() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">
          Powering conversations for the world&apos;s most innovative platforms
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          {brands.map((brand, index) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-black tracking-tighter text-white/40 hover:text-white transition-colors cursor-default"
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
