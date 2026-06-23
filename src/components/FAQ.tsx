"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the moderation engine handle sarcasm and nuance?",
    answer:
      "Our engine uses multi-layered contextual analysis that examines conversation history, participant relationships, and linguistic patterns — not just individual words. This allows it to distinguish between genuine toxicity and friendly banter with high accuracy.",
  },
  {
    question: "What are the latency guarantees?",
    answer:
      "95% of moderation requests are processed in under 50ms. Our global edge network ensures that requests are handled at the nearest point of presence, minimizing round-trip time regardless of your users&apos; locations.",
  },
  {
    question: "Is Emphra compliant with GDPR and SOC2?",
    answer:
      "Yes. Emphra is fully compliant with GDPR, CCPA, and SOC2 Type II standards. We offer data residency options in the US, EU, and Asia-Pacific to meet your specific legal requirements.",
  },
  {
    question: "Can I customize the moderation rules for my community?",
    answer:
      "Absolutely. All plans allow you to configure strictness levels, custom word lists, and category-specific thresholds. Enterprise customers can fine-tune models on their specific community guidelines and historical data.",
  },
  {
    question: "What happens if the API goes down?",
    answer:
      "Our infrastructure is designed for 99.99% uptime with automatic failover across multiple regions. In the unlikely event of an outage, our SDKs support configurable fallback behaviors including allow-listing and queue-based retry.",
  },
];

export function FAQ() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            FAQ
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Common questions.</span>
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-6 hover:border-white/[0.1] transition-colors duration-500"
              >
                <AccordionTrigger className="text-sm font-medium text-foreground hover:text-foreground py-5 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
