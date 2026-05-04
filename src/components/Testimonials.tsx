"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Head of Product, SnapCommunity",
    text: "Integrating Emphra was the single best decision we made this year. Our toxicity reports dropped by 60% within the first week of implementation.",
    avatar: "SC"
  },
  {
    name: "Marcus Thorne",
    role: "CTO at Nexus Chat",
    text: "The contextual memory feature is pure magic. It's the only API that actually understands when a user is referring back to a conversation from three days ago.",
    avatar: "MT"
  },
  {
    name: "Elena Rodriguez",
    role: "Founder of SafeSpace",
    text: "As a platform focused on safety, we needed something more than simple keyword filtering. Emphra's nuance detection is industry-leading.",
    avatar: "ER"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter"
          >
            Trusted by the <span className="text-primary-gradient">best in the business.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg text-white/90 italic mb-8 leading-relaxed">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
