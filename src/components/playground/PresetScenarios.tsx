"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Flame,
  ShieldAlert,
  CreditCard,
  Headphones,
  Gamepad2,
  Store,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PresetScenario } from "@/types/playground";

const SCENARIOS: PresetScenario[] = [
  {
    id: "friendly-discussion",
    name: "Friendly Discussion",
    description: "Normal polite conversation",
    messages: [
      { text: "Hey! Can you help me with the documentation?", role: "user", sender: "User A", isUser: true },
      { text: "Sure! What specifically do you need?", role: "assistant", sender: "Assistant", isUser: false },
      { text: "I'm looking for the API authentication section.", role: "user", sender: "User A", isUser: true },
      { text: "Great question! You'll find it under the Security docs. Would you like me to walk you through it?", role: "assistant", sender: "Assistant", isUser: false },
    ],
  },
  {
    id: "heated-argument",
    name: "Heated Argument",
    description: "Escalating toxic language",
    messages: [
      { text: "I don't think your idea will work.", role: "user", sender: "User A", isUser: true },
      { text: "Well, your ideas are always trash anyway.", role: "user", sender: "User B", isUser: true },
      { text: "You are such an idiot, stop talking!", role: "user", sender: "User A", isUser: true },
      { text: "Shut up you moron, nobody cares about your opinion!", role: "user", sender: "User B", isUser: true },
      { text: "I hate everything about this pathetic platform.", role: "user", sender: "User A", isUser: true },
    ],
  },
  {
    id: "community-moderation",
    name: "Community Moderation",
    description: "Policy violation messages",
    messages: [
      { text: "Welcome to the community! Please read the guidelines.", role: "system", sender: "System", isUser: false },
      { text: "Hey everyone! Excited to be here.", role: "user", sender: "User A", isUser: true },
      { text: "This is the worst community ever. You're all stupid.", role: "user", sender: "User B", isUser: true },
      { text: "Please keep the conversation respectful.", role: "moderator", sender: "Moderator Bot", isUser: false },
    ],
  },
  {
    id: "scam-attempt",
    name: "Scam Attempt",
    description: "Suspicious information requests",
    messages: [
      { text: "Hello, I am from the security team.", role: "user", sender: "User B", isUser: true },
      { text: "We noticed a suspicious login on your account.", role: "user", sender: "User B", isUser: true },
      { text: "Please send your bank password and security code to verify your identity.", role: "user", sender: "User B", isUser: true },
    ],
  },
  {
    id: "customer-support",
    name: "Customer Support",
    description: "Professional conversation",
    messages: [
      { text: "Hi, I'm having trouble with my integration.", role: "user", sender: "User A", isUser: true },
      { text: "I'd be happy to help! Can you share the error you're seeing?", role: "assistant", sender: "Support Agent", isUser: false },
      { text: "Getting a 401 unauthorized error on the moderate endpoint.", role: "user", sender: "User A", isUser: true },
      { text: "That usually means your API key is missing or invalid. Can you double-check your Authorization header?", role: "assistant", sender: "Support Agent", isUser: false },
    ],
  },
  {
    id: "gaming-lobby",
    name: "Gaming Lobby",
    description: "Mixed messages",
    messages: [
      { text: "GG everyone, that was a great match!", role: "user", sender: "Player1", isUser: true },
      { text: "You're so trash at this game lol", role: "user", sender: "Player2", isUser: true },
      { text: "Let's queue up for another round!", role: "user", sender: "Player3", isUser: true },
      { text: "Shut up idiot, you're the worst player here", role: "user", sender: "Player2", isUser: true },
      { text: "Anyone want to team up for ranked?", role: "user", sender: "Player1", isUser: true },
      { text: "Good game all, see you next time!", role: "user", sender: "Player3", isUser: true },
    ],
  },
  {
    id: "marketplace-negotiation",
    name: "Marketplace",
    description: "Buying and selling",
    messages: [
      { text: "Is this item still available?", role: "user", sender: "Buyer", isUser: true },
      { text: "Yes! It's $200, firm price.", role: "user", sender: "Seller", isUser: true },
      { text: "Would you accept $150?", role: "user", sender: "Buyer", isUser: true },
      { text: "Meet me at $175 and we have a deal.", role: "user", sender: "Seller", isUser: true },
    ],
  },
  {
    id: "group-chat",
    name: "Group Chat",
    description: "Multiple participants",
    messages: [
      { text: "Hey team, let's discuss the new feature rollout.", role: "user", sender: "Alice", isUser: true },
      { text: "I think we should start with the moderation API first.", role: "user", sender: "Bob", isUser: true },
      { text: "Agreed. The sentiment analysis is also looking great.", role: "user", sender: "Charlie", isUser: true },
      { text: "When can we have the demo ready?", role: "user", sender: "Alice", isUser: true },
      { text: "End of this week if testing goes well.", role: "user", sender: "Bob", isUser: true },
      { text: "Perfect, let's sync up Thursday.", role: "user", sender: "Charlie", isUser: true },
    ],
  },
];

const ICONS = [
  MessageCircle,
  Flame,
  ShieldAlert,
  CreditCard,
  Headphones,
  Gamepad2,
  Store,
  Users,
];

interface PresetScenariosProps {
  activeScenario: string | null;
  onSelect: (scenario: PresetScenario) => void;
}

export function PresetScenarios({ activeScenario, onSelect }: PresetScenariosProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
        Preset Scenarios
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SCENARIOS.map((scenario, i) => {
          const Icon = ICONS[i];
          const isActive = activeScenario === scenario.id;
          return (
            <motion.button
              key={scenario.id}
              onClick={() => onSelect(scenario)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-foreground/80"
              )}
              style={isActive ? {
                background: "oklch(0.72 0.08 85 / 0.12)",
                boxShadow: "0 0 0 0.5px oklch(0.72 0.08 85 / 0.30), inset 0 1px 0 rgba(255,255,255,0.08)",
              } : {
                background: "rgba(255,255,255,0.025)",
                boxShadow: "0 0 0 0.5px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
              aria-label={`Load scenario: ${scenario.name}`}
            >
              <Icon size={10} />
              <span className="hidden sm:inline">{scenario.name}</span>
              <span className="sm:hidden">{scenario.name.split(" ")[0]}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { SCENARIOS };
