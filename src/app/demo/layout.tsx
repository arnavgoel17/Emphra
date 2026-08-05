import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Emphra Playground — Interactive Conversation Intelligence",
  description:
    "Experience Emphra's conversation intelligence in real-time. Test moderation, sentiment analysis, and smart insights — no API key required.",
};

// ponytail: demo route gets its own layout so we can swap the global Navbar
// for a single merged playground header — no global nav/footer on this page
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
