"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-background" />

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

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
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

      <div className="absolute inset-0 bg-grid opacity-30" />
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
          >
            Conversation intelligence API for modern platforms. Moderation, safety, and analytics —
            engineered for scale, designed for developers.
          </motion.p>

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
