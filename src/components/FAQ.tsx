"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the moderation engine handle sarcasm?",
    answer: "Our engine uses advanced contextual LLMs that analyze the entire conversation history, not just individual words. This allows it to distinguish between genuine toxicity and friendly banter with 98.4% accuracy."
  },
  {
    question: "Is the API GDPR and SOC2 compliant?",
    answer: "Yes, Emphra is fully compliant with GDPR, CCPA, and SOC2 Type II standards. We offer data residency options in the US, EU, and Asia to meet your legal requirements."
  },
  {
    question: "Can I train the model on my own community data?",
    answer: "Enterprise customers can fine-tune our models on their specific community guidelines and historical data to ensure the moderation perfectly matches their brand voice."
  },
  {
    question: "What is the typical latency for an API call?",
    answer: "Our global edge network ensures that 95% of moderation requests are processed in under 40ms, ensuring zero impact on your users' chat experience."
  }
];

export function FAQ() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tighter mb-4"
          >
            Frequently Asked <span className="text-primary-gradient">Questions.</span>
          </motion.h2>
          <p className="text-muted-foreground">Everything you need to know about Emphra.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-white/5 rounded-xl px-6">
              <AccordionTrigger className="text-white hover:text-primary transition-colors py-6 text-left font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
