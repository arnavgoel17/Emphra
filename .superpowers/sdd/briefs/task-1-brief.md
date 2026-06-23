# Task 1: Redesign globals.css — The Liquid Obsidian Design System

**Files:**
- Modify: `src/app/globals.css`

This is the foundation. Every other task depends on these CSS variables and utilities.

## Steps

### Step 1: Replace the entire color system in `:root`

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

### Step 2: Replace `@layer base` styles

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

### Step 3: Replace `@layer utilities` with premium utilities

```css
@layer utilities {
  /* Glass surfaces */
  .glass {
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

### Step 4: Add premium keyframe animations

Add to the `@theme inline` section:

```css
--animate-float-slow: float-slow 8s ease-in-out infinite;
--animate-pulse-glow: pulse-glow 6s ease-in-out infinite;
--animate-shimmer: shimmer 3s ease-in-out infinite;
--animate-fade-in-up: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
```

And add these keyframes (replace existing ones):

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

### Step 5: Commit

```bash
git add src/app/globals.css
git commit -m "feat(design-system): implement Liquid Obsidian color palette and premium utilities"
```

## Global Constraints
- Color system: Deep obsidian `#05050A`, midnight navy `#0A0F1A`, graphite `#1A1A2E`, platinum `#C0C0D0`, ivory `#F5F5F0`, champagne gold `#C9A96E`, electric sapphire `#3B82F6`
- Accent usage: Max 10% of any viewport — no rainbow gradients, no excessive saturation
- Easing: Primary `cubic-bezier(0.16, 1, 0.3, 1)`, Secondary `cubic-bezier(0.4, 0, 0.2, 1)` — zero bounce, zero spring
- No AI buzzwords, no neon cyberpunk, no floating robots, no glowing brains, no stock imagery
