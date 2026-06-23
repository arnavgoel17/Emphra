# Emphra Premium Website Design Spec

**Date:** 2026-06-24
**Status:** Approved

## Design Identity: "Liquid Obsidian"

A dark-first, luxury infrastructure brand. Every surface is either deep obsidian glass or frosted crystal. Motion is slow, deliberate, and purposeful.

## Color System

### Primary Palette
- **Deep Obsidian Black:** `#05050A` — Main background
- **Midnight Navy:** `#0A0F1A` — Secondary background / depth layers
- **Graphite:** `#1A1A2E` — Card surfaces, elevated elements
- **Platinum Silver:** `#C0C0D0` — Body text, secondary content
- **Soft Ivory:** `#F5F5F0` — Headlines, primary text

### Accent Palette
- **Champagne Gold:** `#C9A96E` — Premium accents, CTAs, highlights (sparse)
- **Electric Sapphire:** `#3B82F6` — Interactive elements, links (sparse)
- **Aurora Highlight:** Soft blue-white gradients for hero lighting

### Rules
- Accents used sparingly — max 10% of any viewport
- No rainbow gradients
- No excessive saturation
- All colors use OKLCH for perceptual uniformity

## Typography

- **Headlines:** Space Grotesk — Editorial, 7xl-8xl for hero, tracking-tight
- **Body:** Inter — 16-18px, relaxed leading
- **Code:** Geist Mono / SF Mono — For terminal examples
- **Hierarchy:** Large headlines, comfortable spacing, excellent readability

## Component Specifications

### 1. Navigation
- Floating liquid glass bar with `backdrop-blur-2xl`
- Border: `white/[0.06]` — barely visible
- Logo: "EMPHRA" in Space Grotesk, tracking-tighter
- Links: muted → ivory on hover, 300ms ease
- CTA: Champagne gold pill button with subtle glow
- Mobile: Full-screen overlay with blur

### 2. Hero Section
- Full viewport height, centered content
- Multi-layer parallax background:
  - Layer 1: Deep obsidian base
  - Layer 2: Subtle aurora light blobs (2-3, very slow animation)
  - Layer 3: Abstract flowing data architecture (SVG paths with animated strokes)
  - Layer 4: Noise texture overlay (0.03 opacity)
- Headline: "The Infrastructure Layer for Better Conversations."
- Subheadline: Concise, editorial
- CTAs: Primary (gold gradient) + Secondary (glass outline)
- No mock chat windows, no AI illustrations

### 3. Product Overview
- 6 feature cards in a grid
- Glass morphism surfaces with `bg-white/[0.03]` and `backdrop-blur-xl`
- Subtle border glow on hover
- Icons in muted metallic tones (no bright colors)

### 4. Why Emphra (Comparison)
- Premium comparison section
- Elegant list with gold checkmarks
- Glass card with inner glow

### 5. API Experience
- Premium terminal design with glass chrome
- Syntax highlighting (custom, not generic)
- Tabbed language selector (JS, Python, Java)
- Copy button with confirmation
- Response example panel

### 6. Architecture Flow
- Interactive vertical flow diagram
- Each node is a glass card
- Animated connecting lines
- Steps: User Message → Processing → Moderation → Intelligence → Insights → Response

### 7. Performance Metrics
- Animated counters with custom easing
- 99.99% uptime, <50ms response, millions processed, global infrastructure
- Large numerals with platinum treatment

### 8. Pricing
- Three tiers: Starter, Growth (dominant), Enterprise
- Growth plan: Elevated card with gold border accent
- Glass morphism surfaces
- Elegant feature lists

### 9. Company Vision
- Concise editorial section
- Focus on future of communication, safer communities
- Large pull quote typography

### 10. Footer
- Minimal, luxury aesthetic
- Beautiful typography
- Links: Docs, API Reference, Privacy, Terms, Contact
- Gold accent on hover

## Motion Design

### Principles
- Smooth opacity transitions (300-500ms)
- Blur transitions (backdrop-blur animations)
- Depth movement (subtle Z-axis transforms)
- Subtle parallax (0.5-2% movement)
- Glass reflections on hover

### Forbidden
- Bounce animations
- Flashy effects
- Distracting movement
- Spring physics (use cubic-bezier easing instead)

### Easing
- Primary: `cubic-bezier(0.16, 1, 0.3, 1)` — Apple-style smooth
- Secondary: `cubic-bezier(0.4, 0, 0.2, 1)` — Material smooth

## Technical Implementation

### Stack
- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- Framer Motion
- shadcn/ui (customized)

### File Structure
```
src/
  app/
    layout.tsx      — Root layout with fonts, theme
    page.tsx        — Main page composing all sections
    globals.css     — Design system (colors, utilities, animations)
  components/
    Navbar.tsx      — Floating liquid glass nav
    Hero.tsx        — Cinematic hero with parallax
    ProductOverview.tsx — Feature cards
    WhyEmphra.tsx   — Comparison section
    ApiExperience.tsx — Terminal code examples
    Architecture.tsx — Flow diagram
    Metrics.tsx     — Animated counters
    Pricing.tsx     — Three-tier pricing
    Vision.tsx      — Company vision
    Footer.tsx      — Luxury footer
    ui/             — shadcn/ui components (existing)
  lib/
    utils.ts        — cn() utility
```

### Responsive
- Mobile-first approach
- Breakpoints: sm (640), md (768), lg (1024), xl (1280)
- All sections fully responsive
- Touch-friendly interactions

### Accessibility
- WCAG 2.2 AA compliance
- Focus visible states
- Reduced motion support
- Semantic HTML
- ARIA labels where needed
- Color contrast ratios ≥ 4.5:1

### Performance
- Next.js Image optimization
- Font optimization with `next/font`
- Minimal JavaScript bundle
- CSS containment for heavy sections
- Lazy loading for below-fold sections
