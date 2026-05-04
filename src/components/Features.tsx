"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, MessageSquare, Zap, Lock, Globe, BarChart3, Languages, Bot } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: <Shield className="text-primary" />,
    title: "AI Moderation Engine",
    description: "Multi-layered toxicity detection that understands nuance, sarcasm, and intent in real-time."
  },
  {
    icon: <Brain className="text-blue-400" />,
    title: "Contextual Memory",
    description: "Our API remembers the flow of conversation, allowing for deep, long-form community engagement."
  },
  {
    icon: <Bot className="text-cyan-400" />,
    title: "Auto Reply Suggestions",
    description: "Context-aware response candidates that help users express themselves faster and better."
  },
  {
    icon: <Lock className="text-purple-400" />,
    title: "Spam & Scam Protection",
    description: "Advanced pattern recognition to block crypto scams, phishing links, and bot armies."
  },
  {
    icon: <BarChart3 className="text-orange-400" />,
    title: "Real-time Analytics",
    description: "Visual dashboards showing engagement trends, sentiment shifts, and moderation efficiency."
  },
  {
    icon: <Languages className="text-emerald-400" />,
    title: "Multi-language Support",
    description: "Seamlessly moderate and analyze conversations across 50+ languages with native accuracy."
  }
];

export function Features() {
  return (
    <section id="product" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-6"
          >
            Everything you need for <span className="text-primary-gradient">smarter chat.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-muted-foreground"
          >
            One API call to solve the biggest challenges in modern communication.
            Safe, scalable, and intelligent by default.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-8 h-full bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/[0.07] transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                  {React.cloneElement(feature.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
