# Emphra Premium Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the entire Emphra website with a premium "Liquid Obsidian" design system — Apple/Stripe/Linear quality — replacing the generic AI startup aesthetic with luxury infrastructure branding.

**Architecture:** Rebuild every component in-place within the existing Next.js 15 + Tailwind CSS 4 + Framer Motion + shadcn/ui stack. The design system is defined in `globals.css` (colors, utilities, animations) and applied through rewritten components. Each section is a standalone component composed in `page.tsx`.

**Tech Stack:** Next.js 15 (App Router), TypeScript (strict), Tailwind CSS 4, Framer Motion 12, shadcn/ui (radix-nova), Lucide React icons.

## Global Constraints

- **Color system:** Deep obsidian `#05050A`, midnight navy `#0A0F1A`, graphite `#1A1A2E`, platinum `#C0C0D0`, ivory `#F5F5F0`, champagne gold `#C9A96E`, electric sapphire `#3B82F6`
- **Accent usage:** Max 10% of any viewport — no rainbow gradients, no excessive saturation
- **Typography:** Space Grotesk for headlines (editorial, tracking-tight), Inter for body (16-18px), Geist Mono for code
- **Easing:** Primary `cubic-bezier(0.16, 1, 0.3, 1)`, Secondary `cubic-bezier(0.4, 0, 0.2, 1)` — zero bounce, zero spring
- **Motion:** Smooth opacity (300-500ms), blur transitions, depth movement, subtle parallax — no flashy effects
- **Glass morphism:** `bg-white/[0.03]` to `bg-white/[0.06]`, `backdrop-blur-xl` to `backdrop-blur-2xl`, borders at `white/[0.06]` to `white/[0.1]`
- **Responsive:** Mobile-first, breakpoints at 640/768/1024/1280
- **Accessibility:** WCAG 2.2 AA, focus visible states, `prefers-reduced-motion` support, semantic HTML, contrast ≥ 4.5:1
- **No AI buzzwords, no neon cyberpunk, no floating robots, no glowing brains, no stock imagery
- All existing shadcn/ui components (button, card, accordion, tabs, etc.) are preserved — only their usage/styling changes
- The existing file structure is preserved — files are rewritten in-place

---

## Phase 1: Design System Foundation

### Task 1: Redesign globals.css — The Liquid Obsidian Design System

**Files:**
- Modify: `src/app/globals.css`

This is the foundation. Every other task depends on these CSS variables and utilities.

- [ ] **Step 1: Replace the entire color system in `:root`**

Replace the existing `:root` CSS custom properties with the Liquid Obsidian palette:

```css
:root {
  /* === Liquid Obsidian Palette === */
  --background: oklch(0.035 0.01 260);           /* Deep obsidian #05050A */
  --foreground: oklch(0.96 0.005 260);           /* Soft ivory #F5F5F0 */

  --card: oklch(0.08 0.015 260);                 /* Graphite #1A1A2E */
  --card-foreground: oklch(0.96 0.005 260);

  --popover: oklch(0.08 0.015 260);
  --popover-foreground: oklch(0.96 0.005 260);

  --primary: oklch(0.72 0.08 85);                /* Champagne gold #C9A96E */
  --primary-foreground: oklch(0.035 0.01 260);

  --secondary: oklch(0.12 0.02 260);              /* Midnight navy #0A0F1A */
  --secondary-foreground: oklch(0.88 0.01 260);   /* Platinum #C0C0D0 */

  --muted: oklch(0.12 0.02 260);
  --muted-foreground: oklch(0.55 0.015 260);

  --accent: oklch(0.15 0.025 260);
  --accent-foreground: oklch(0.96 0.005 260);

  --destructive: oklch(0.55 0.15 25);
  --destructive-foreground: oklch(0.96 0.005 260);

  --border: oklch(0.15 0.02 260);
  --input: oklch(0.15 0.02 260);
  --ring: oklch(0.72 0.08 85);

  --radius: 0.75rem;

  /* === Gold accent === */
  --gold: oklch(0.72 0.08 85);
  --gold-muted: oklch(0.72 0.04 85);

  /* === Sapphire accent === */
  --sapphire: oklch(0.55 0.15 250);
}
```

- [ ] **Step 2: Replace `@layer base` styles**

```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    @apply scroll-smooth;
  }
  ::selection {
    background: oklch(0.72 0.08 85 / 0.25);
    color: var(--foreground);
  }
}
```

- [ ] **Step 3: Replace `@layer utilities` with premium utilities**

```css
@layer utilities {
  /* Glass surfaces */
  {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/[0.06];
  }
  .glass-strong {
    @apply bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08];
  }
  .glass-subtle {
    @apply bg-white/[0.02] backdrop-blur-lg border border-white/[0.04];
  }

  /* Text treatments */
  .text-ivory {
    color: oklch(0.96 0.005 260);
  }
  .text-platinum {
    color: oklch(0.88 0.01 260);
  }
  .text-gold {
    color: oklch(0.72 0.08 85);
  }

  /* Gold gradient text */
  .text-gold-gradient {
    background: linear-gradient(135deg, oklch(0.72 0.08 85), oklch(0.82 0.06 90));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Subtle ivory gradient for headlines */
  .text-ivory-gradient {
    background: linear-gradient(180deg, oklch(0.98 0.003 260) 0%, oklch(0.75 0.01 260) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Premium glow effects */
  .glow-gold {
    box-shadow: 0 0 40px -12px oklch(0.72 0.08 85 / 0.4);
  }
  .glow-gold-sm {
    box-shadow: 0 0 20px -8px oklch(0.72 0.08 85 / 0.3);
  }

  /* Noise texture overlay */
  .noise::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 1;
  }

  /* Grid pattern (subtler) */
  .bg-grid {
    background-image:
      linear-gradient(to right, oklch(1 0 0 / 0.02) 1px, transparent 1px),
      linear-gradient(to bottom, oklch(1 0 0 / 0.02) 1px, transparent 1px);
    background-size: 64px 64px;
  }

  /* Radial aurora effect */
  .aurora {
    background: radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.55 0.15 250 / 0.06) 0%, transparent 70%);
  }
}
```

- [ ] **Step 4: Add premium keyframe animations**

Replace the existing keyframes with:

```css
@keyframes float-slow {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes draw-line {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

@keyframes count-up {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
```

Add these to the `@theme inline` section:

```css
--animate-float-slow: float-slow 8s ease-in-out infinite;
--animate-pulse-glow: pulse-glow 6s ease-in-out infinite;
--animate-shimmer: shimmer 3s ease-in-out infinite;
--animate-fade-in-up: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
```

- [ ] **Step 5: Verify the CSS compiles**

Run: `npx tailwindcss --help` (just verify tailwind is available — the actual build test comes later)

Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(design-system): implement Liquid Obsidian color palette and premium utilities"
```

---

### Task 2: Update layout.tsx — Premium Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Rewrite layout.tsx with premium metadata and font setup**

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emphra — The Infrastructure Layer for Better Conversations",
  description:
    "Conversation intelligence API for modern platforms. Moderation, safety, and analytics — engineered for scale.",
  authors: [{ name: "Emphra" }],
  openGraph: {
    title: "Emphra — The Infrastructure Layer for Better Conversations",
    description:
      "Conversation intelligence API for modern platforms. Moderation, safety, and analytics — engineered for scale.",
    siteName: "Emphra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground selection:bg-gold/25 selection:text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update the font variable references in globals.css**

Add to the `@theme inline` section of `globals.css`:

```css
--font-sans: var(--font-inter);
--font-heading: var(--font-space-grotesk);
--font-geist-mono: var(--font-mono);
```

And update `@layer base` body to use `var(--font-sans)`:

```css
body {
  font-family: var(--font-sans);
  ...
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat(layout): premium root layout with Space Grotesk + Inter font stack"
```

---

## Phase 2: Core Components (Independent — Can Run in Parallel)

### Task 3: Rebuild Navbar — Liquid Glass Navigation

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar with premium liquid glass design**

```tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Product", href: "#product" },
  { name: "Solutions", href: "#solutions" },
  { name: "Pricing", href: "#pricing" },
  { name: "Documentation", href: "#docs" },
  { name: "Company", href: "#company" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-500 rounded-2xl",
          isScrolled
            ? "glass-strong shadow-2xl shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-heading)]">
              EMPHRA
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 rounded-lg hover:bg-white/[0.04]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="#"
              className="px-5 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300"
            >
              Sign in
            </Link>
            <Link
              href="#"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-[oklch(0.72_0.08_85)] to-[oklch(0.82_0.06_90)] text-background hover:opacity-90 transition-opacity duration-300"
            >
              Get API Access
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-medium text-foreground/80 hover:text-foreground py-3 border-b border-white/[0.06] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 space-y-3">
                <Link
                  href="#"
                  className="block w-full text-center py-3 text-sm font-medium text-foreground/80 border border-white/[0.08] rounded-xl"
                >
                  Sign in
                </Link>
                <Link
                  href="#"
                  className="block w-full text-center py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-[oklch(0.72_0.08_85)] to-[oklch(0.82_0.06_90)] text-background"
                >
                  Get API Access
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(navbar): liquid glass floating navigation with gold CTA"
```

---

### Task 4: Rebuild Hero — Cinematic Hero Section

**Files:**
- Modify: `src/components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero with cinematic design**

```tsx
"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep base */}
      <div className="absolute inset-0 bg-background" />

      {/* Aurora blobs */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[20%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.55 0.15 250 / 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 20, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[10%] right-[15%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, oklch(0.72 0.08 85 / 0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Abstract data architecture SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Flowing connection lines */}
        <motion.path
          d="M100,400 C200,300 400,500 600,350 S900,250 1100,400"
          stroke="oklch(0.72 0.08 85)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M50,500 C250,200 450,600 650,300 S950,200 1150,450"
          stroke="oklch(0.55 0.15 250)"
          strokeWidth="0.5"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Node points */}
        {[
          [200, 350], [400, 420], [600, 350], [800, 280], [1000, 400],
          [150, 480], [350, 300], [550, 500], [750, 320], [950, 450],
        ].map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="oklch(0.72 0.08 85)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </svg>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AuroraBackground />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 pt-32 pb-20"
      >
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-xs font-medium tracking-wide text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.08_85)] animate-pulse" />
              Now in General Availability
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">
              The Infrastructure Layer
            </span>
            <br />
            <span className="text-foreground/60">for Better</span>{" "}
            <span className="text-gold-gradient">Conversations.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
          >
            Conversation intelligence API for modern platforms. Moderation, safety, and analytics —
            engineered for scale, designed for developers.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="#"
              className="group inline-flex items-center justify-center px-8 py-4 text-sm font-semibold rounded-2xl bg-gradient-to-r from-[oklch(0.72_0.08_85)] to-[oklch(0.82_0.06_90)] text-background hover:opacity-90 transition-all duration-300 glow-gold-sm"
            >
              Get API Access
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </Link>
            <Link
              href="#docs"
              className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm text-foreground hover:bg-white/[0.06] transition-all duration-300"
            >
              Read Documentation
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat(hero): cinematic hero with aurora background, SVG data architecture, parallax"
```

---

### Task 5: Rebuild SocialProof — Premium Brand Bar

**Files:**
- Modify: `src/components/SocialProof.tsx`

- [ ] **Step 1: Rewrite SocialProof with elegant treatment**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const brands = [
  "Discord", "Shopify", "Linear", "Vercel", "Stripe", "Notion", "Figma", "Raycast",
];

export function SocialProof() {
  return (
    <section className="py-16 border-y border-white/[0.04]">
      <div className="container mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-10"
        >
          Trusted by teams building the future of communication
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
          {brands.map((brand, i) => (
            <motion.span
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="text-lg font-semibold tracking-tight text-foreground/[0.15] hover:text-foreground/40 transition-colors duration-500 cursor-default font-[family-name:var(--font-heading)]"
            >
              {brand}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SocialProof.tsx
git commit -m "feat(social-proof): premium brand bar with platinum treatment"
```

---

### Task 6: Rebuild Features — Product Overview

**Files:**
- Modify: `src/components/Features.tsx`

- [ ] **Step 1: Rewrite Features with glass morphism cards**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, MessageSquare, Lock, BarChart3, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Shield,
    title: "Moderation Engine",
    description: "Multi-layered content analysis that understands nuance, context, and intent — not just keywords.",
  },
  {
    icon: Brain,
    title: "Conversation Intelligence",
    description: "Deep contextual awareness that tracks conversation flow across sessions and participants.",
  },
  {
    icon: MessageSquare,
    title: "Smart Responses",
    description: "Context-aware reply suggestions that help users express themselves with clarity and confidence.",
  },
  {
    icon: Lock,
    title: "Safety & Compliance",
    description: "Enterprise-grade protection against spam, scams, and abuse. GDPR, SOC2, and CCPA compliant.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live dashboards showing engagement trends, sentiment shifts, and moderation effectiveness.",
  },
  {
    icon: Globe,
    title: "Global Scale",
    description: "Edge-optimized infrastructure processing millions of messages with sub-50ms latency worldwide.",
  },
];

export function Features() {
  return (
    <section id="product" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Product
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Everything you need.</span>
            <br />
            <span className="text-foreground/40">Nothing you don&apos;t.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-muted-foreground leading-relaxed"
          >
            One API. Six pillars of conversation intelligence. Built for platforms that demand reliability.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="group relative h-full p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-500">
                <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6 group-hover:border-gold/20 transition-colors duration-500">
                  <feature.icon
                    size={20}
                    className="text-foreground/40 group-hover:text-gold transition-colors duration-500"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 font-[family-name:var(--font-heading)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Features.tsx
git commit -m "feat(features): glass morphism product cards with muted metallic icons"
```

---

### Task 7: Create Architecture Section — Flow Diagram

**Files:**
- Create: `src/components/Architecture.tsx`

- [ ] **Step 1: Create the Architecture flow component**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const steps = [
  { label: "User Message", sublabel: "Incoming conversation data" },
  { label: "Processing Layer", sublabel: "Context assembly & enrichment" },
  { label: "Moderation", sublabel: "Content analysis & safety checks" },
  { label: "Intelligence", sublabel: "Sentiment, intent & memory" },
  { label: "Insights", sublabel: "Structured response & analytics" },
  { label: "Platform Response", sublabel: "Delivered in under 50ms" },
];

export function Architecture() {
  return (
    <section id="solutions" className="py-32 relative overflow-hidden">
      {/* Subtle aurora */}
      <div className="absolute inset-0 aurora" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Architecture
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">How messages flow</span>
            <br />
            <span className="text-foreground/40">through Emphra.</span>
          </motion.h2>
        </div>

        <div className="max-w-xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <div className="relative flex items-start gap-5 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors duration-500">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-xs font-bold text-gold font-[family-name:var(--font-heading)]">
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-0.5">
                    {step.label}
                  </h4>
                  <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-start pl-9 py-2">
                  <ArrowDown size={14} className="text-white/[0.08]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Architecture.tsx
git commit -m "feat(architecture): interactive flow diagram showing message pipeline"
```

---

### Task 8: Create Metrics Section — Animated Counters

**Files:**
- Create: `src/components/Metrics.tsx`

- [ ] **Step 1: Create the Metrics component with animated counters**

```tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

const metrics = [
  { value: 99.99, suffix: "%", label: "Uptime SLA", prefix: "" },
  { value: 50, suffix: "ms", label: "Avg Response Time", prefix: "<" },
  { value: 10, suffix: "M+", label: "Messages Processed", prefix: "" },
  { value: 150, suffix: "+", label: "Countries Served", prefix: "" },
];

export function Metrics() {
  return (
    <section className="py-24 border-y border-white/[0.04]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-[family-name:var(--font-heading)] mb-2">
                <AnimatedCounter target={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Metrics.tsx
git commit -m "feat(metrics): animated counters with cubic ease-out for performance stats"
```

---

### Task 9: Rebuild ApiExperience — Premium Terminal

**Files:**
- Modify: `src/components/ApiDocs.tsx`

- [ ] **Step 1: Rewrite ApiDocs with premium terminal design**

```tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check, ArrowRight } from "lucide-react";

const codeExamples = {
  javascript: `import { Emphra } from "@emphra/sdk";

const emphra = new Emphra({ apiKey: process.env.EMPRA_API_KEY });

const result = await emphra.moderate({
  text: "Hello, this is a great platform!",
  context: { userId: "usr_123", channelId: "ch_456" }
});

console.log(result.action); // "allow"
console.log(result.confidence); // 0.98`,

  python: `from emphra import Emphra

emphra = Emphra(api_key=os.environ["EMPRA_API_KEY"])

result = emphra.moderate(
    text="Hello, this is a great platform!",
    context={"user_id": "usr_123", "channel_id": "ch_456"}
)

print(result.action)  # "allow"
print(result.confidence)  # 0.98`,

  java: `import com.emphra.Emphra;
import com.emphra.ModerateRequest;

Emphra emphra = new Emphra(System.getenv("EMPRA_API_KEY"));

ModerateRequest request = ModerateRequest.builder()
    .text("Hello, this is a great platform!")
    .context(Map.of("userId", "usr_123", "channelId", "ch_456"))
    .build();

ModerateResult result = emphra.moderate(request);
System.out.println(result.getAction()); // "allow"
System.out.println(result.getConfidence()); // 0.98`,
};

const responseExample = `{
  "id": "mod_7f8a9b2c",
  "action": "allow",
  "confidence": 0.98,
  "categories": {
    "toxicity": 0.02,
    "spam": 0.01,
    "hate_speech": 0.0
  },
  "processing_time_ms": 23
}`;

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
            >
              Documentation
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
            >
              <span className="text-ivory-gradient">Ship in minutes,</span>
              <br />
              <span className="text-foreground/40">not sprints.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              A single REST endpoint. SDKs for every major language. Comprehensive docs with examples for every use case.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                "Single POST endpoint for all features",
                "TypeScript, Python, Java, and Go SDKs",
                "99.99% uptime SLA with global edge",
                "SOC2 Type II and GDPR compliant",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gold hover:text-gold/80 transition-colors group"
              >
                View full API reference
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[oklch(0.06_0.01_260)] shadow-2xl shadow-black/40"
          >
            {/* Terminal chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                Request
              </span>
              <button
                onClick={copyCode}
                className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
                aria-label="Copy code"
              >
                {copied ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
              </button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="javascript" onValueChange={setActiveTab}>
              <div className="px-4 pt-3 border-b border-white/[0.04]">
                <TabsList className="bg-transparent h-8 gap-1 p-0">
                  {(["javascript", "python", "java"] as const).map((lang) => (
                    <TabsTrigger
                      key={lang}
                      value={lang}
                      className="text-xs text-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:bg-white/[0.06] rounded-md px-3 py-1 capitalize"
                    >
                      {lang === "javascript" ? "JavaScript" : lang === "python" ? "Python" : "Java"}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="javascript" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </TabsContent>
              <TabsContent value="python" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.python}</code>
                </pre>
              </TabsContent>
              <TabsContent value="java" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.java}</code>
                </pre>
              </TabsContent>
            </Tabs>

            {/* Response preview */}
            <div className="border-t border-white/[0.06]">
              <div className="px-5 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                  Response
                </span>
              </div>
              <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/40 overflow-x-auto">
                <code>{responseExample}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ApiDocs.tsx
git commit -m "feat(api-docs): premium terminal with glass chrome, tabbed languages, response preview"
```

---

### Task 10: Rebuild Pricing — Premium Pricing Cards

**Files:**
- Modify: `src/components/Pricing.tsx`

- [ ] **Step 1: Rewrite Pricing with premium card design**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Pricing.tsx
git commit -m "feat(pricing): premium pricing cards with gold-accented Growth plan"
```

---

### Task 11: Create Vision Section — Company Story

**Files:**
- Create: `src/components/Vision.tsx`

- [ ] **Step 1: Create the Vision component**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export function Vision() {
  return (
    <section id="company" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 aurora" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Our Vision
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8 font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">
              We believe every online conversation deserves to be safe, intelligent, and meaningful.
            </span>
          </motion.blockquote>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            The internet&apos;s communication infrastructure was built for a different era. Emphra is
            rebuilding it from the ground up — one API call at a time — so platforms can focus on
            what matters: their communities.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Vision.tsx
git commit -m "feat(vision): company vision section with editorial pull quote"
```

---

### Task 12: Rebuild Testimonials — Premium Social Proof

**Files:**
- Modify: `src/components/Testimonials.tsx`

- [ ] **Step 1: Rewrite Testimonials with elegant card design**

```tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Emphra reduced our moderation workload by 80%. What used to take a team of five now runs autonomously.",
    name: "Sarah Chen",
    role: "VP of Platform, Nexus",
    initials: "SC",
  },
  {
    quote: "The contextual memory feature is unlike anything we&apos;ve seen. It genuinely understands conversation flow.",
    name: "Marcus Thorne",
    role: "CTO, Streamline",
    initials: "MT",
  },
  {
    quote: "We evaluated every moderation API on the market. Emphra was the only one that didn&apos;t produce false positives.",
    name: "Elena Rodriguez",
    role: "Head of Trust & Safety, Commons",
    initials: "ER",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight font-[family-name:var(--font-heading)]"
          >
            <span className="text-ivory-gradient">Trusted by teams</span>
            <br />
            <span className="text-foreground/40">who demand better.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-500"
            >
              <p className="text-sm text-foreground/70 leading-relaxed mb-8">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-gold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Testimonials.tsx
```

---

### Task 13: Rebuild FAQ — Premium Accordion

**Files:**
- Modify: `src/components/FAQ.tsx`

- [ ] **Step 1: Rewrite FAQ with elegant accordion design**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/FAQ.tsx
git commit -m "feat(faq): premium accordion with glass item styling"
```

---

### Task 14: Rebuild Footer — Luxury Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer with luxury minimal design**

```tsx
"use client";

import React from "react";
import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#product" },
    { label: "Architecture", href: "#solutions" },
    { label: "Pricing", href: "#pricing" },
    { label: "Documentation", href: "#docs" },
    { label: "API Reference", href: "#" },
  ],
  Company: [
    { label: "About", href: "#company" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Security", href: "#" },
    { label: "GDPR", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="pt-20 pb-12 border-t border-white/[0.04]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-block mb-6">
              <span className="text-xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-heading)]">
                EMPHRA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The infrastructure layer for better conversations. Built for platforms that scale.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="md:col-span-2">
              <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-foreground/40 mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Emphra, Inc. All rights reserved.
          </p>
          <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.2em]">
            Engineered for the future of communication
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat(footer): luxury minimal footer with organized link columns"
```

---

## Phase 3: Assembly & Integration

### Task 15: Update page.tsx — Compose All Sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx composing all premium sections**

```tsx
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { Architecture } from "@/components/Architecture";
import { Metrics } from "@/components/Metrics";
import { ApiDocs } from "@/components/ApiDocs";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Vision } from "@/components/Vision";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialProof />
      <Features />
      <Architecture />
      <Metrics />
      <ApiDocs />
      <Pricing />
      <Testimonials />
      <Vision />
      <FAQ />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(page): compose all premium sections in main page"
```

---

### Task 16: Build Verification

**Files:** (none — verification only)

- [ ] **Step 1: Install dependencies**

Run: `npm install`
Expected: No errors

- [ ] **Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Run the build**

Run: `npm run build`
Expected: Successful build with no errors

- [ ] **Step 4: Run lint**

Run: `npm run lint`
Expected: No lint errors (or only pre-existing ones)

- [ ] **Step 5: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: resolve build issues from premium redesign"
```

---

## Execution Order

**Phase 1** (sequential — foundation):
- Task 1: globals.css design system
- Task 2: layout.tsx

**Phase 2** (can run in parallel after Phase 1):
- Task 3: Navbar
- Task 4: Hero
- Task 5: SocialProof
- Task 6: Features
- Task 7: Architecture (new)
- Task 8: Metrics (new)
- Task 9: ApiDocs
- Task 10: Pricing
- Task 11: Vision (new)
- Task 12: Testimonials
- Task 13: FAQ
- Task 14: Footer

**Phase 3** (after Phase 2):
- Task 15: page.tsx assembly
- Task 16: Build verification
