"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small communities and MVPs.",
    features: ["10k API calls / month", "Standard AI Moderation", "Basic Sentiment Analysis", "Community Support"],
    cta: "Start for free",
    popular: false
  },
  {
    name: "Growth",
    price: "$199",
    description: "Scaling fast? This plan is for you.",
    features: ["100k API calls / month", "Advanced Moderation + Smart Replies", "Contextual Memory (30 days)", "Priority Support", "Analytics Dashboard"],
    cta: "Get Started",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Built for world-scale platforms.",
    features: ["Unlimited API calls", "Custom AI Model Training", "Infinite Memory", "Dedicated Account Manager", "White-glove Integration"],
    cta: "Contact Sales",
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tighter mb-6"
          >
            Simple, <span className="text-primary-gradient">transparent</span> pricing.
          </motion.h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your platform&apos;s growth. All plans include 
            our core intelligence engine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={cn(
                "p-8 h-full flex flex-col relative overflow-hidden transition-all duration-300",
                plan.popular 
                  ? "bg-primary/5 border-primary/50 shadow-[0_0_40px_-15px_rgba(14,165,233,0.3)]" 
                  : "bg-white/5 border-white/10 hover:border-white/20"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button className={cn(
                  "w-full h-12 font-bold rounded-xl transition-all duration-300",
                  plan.popular 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-sm" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}>
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
