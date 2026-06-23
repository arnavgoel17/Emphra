import { Metadata } from "next";
import { PlaygroundShell } from "@/components/playground/PlaygroundShell";

export const metadata: Metadata = {
  title: "Emphra Playground — Interactive Conversation Intelligence",
  description:
    "Experience Emphra's conversation intelligence in real-time. Test moderation, sentiment analysis, and smart insights — no API key required.",
};

export default function DemoPage() {
  return <PlaygroundShell />;
}
