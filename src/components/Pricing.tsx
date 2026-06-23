"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "49",
    period: "/mo",
    description: "For early-stage projects and experimentation.",
    features: [
      "10,000 API calls / month",
      "Standard moderation",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "199",
    period: "/mo",
    description: "For scaling platforms with real users.",
    features: [
      "100,000 API calls / month",
      "Advanced moderation + smart replies",
      "Contextual memory (30 days)",
      "Real-time analytics dashboard",
      "Priority support",
    ],
    cta: "Get started",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For platforms operating at global scale.",
    features: [
      "Unlimited API calls",
      "Custom model training",
      "Infinite memory retention",
      "Dedicated account manager",
      "White-glove integration",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Simple pricing.</span>
            <br />
            <span className="text-foreground/40">No surprises.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className={cn(
                "relative rounded-2xl p-8 transition-all duration-500",
                plan.highlighted
                  ? "bg-white/[0.05] border border-gold/20 shadow-[0_0_60px_-20px_oklch(0.72_0.08_85_/_0.15)] md:-mt-4 md:mb-[-16px]"
                  : "bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1]"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] rounded-full bg-gradient-to-r from-[oklch(0.72_0.08_85)] to-[oklch(0.82_0.06_90)] text-background">
                    Recommended
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  {plan.price !== "Custom" && (
                    <span className="text-2xl text-foreground/40">$</span>
                  )}
                  <span className="text-5xl font-bold tracking-tight text-foreground font-[family-name:var(--font-heading)]">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-10">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-foreground/60">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold/60 mt-1.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={cn(
                  "flex items-center justify-center w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 group",
                  plan.highlighted
                    ? "bg-gradient-to-r from-[oklch(0.72_0.08_85)] to-[oklch(0.82_0.06_90)] text-background hover:opacity-90"
                    : "border border-white/[0.08] text-foreground hover:bg-white/[0.04]"
                )}
              >
                {plan.cta}
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
