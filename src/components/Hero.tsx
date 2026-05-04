"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Shield, MessageSquare, Brain, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function Hero() {
  const handleDocsClick = () => {
    toast.info("Documentation is coming soon!");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-6 inline-block">
              v2.0 Now Live • Next-Gen Chat Intelligence
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight"
          >
            The Intelligence Layer for{" "}
            <span className="text-primary-gradient">Modern Conversations.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Scale your community with a single API. Automated moderation, smart 
            replies, and deep contextual memory for the world&apos;s most engaging apps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/demo">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-14 text-lg font-bold glow-sm group">
                Try Live Demo
                <Play className="ml-2 w-4 h-4 fill-current" />
              </Button>
            </Link>
            <Button 
                size="lg" 
                variant="outline" 
                onClick={handleDocsClick}
                className="border-white/10 hover:bg-white/5 rounded-full px-8 h-14 text-lg font-bold"
            >
              View Documentation
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </motion.div>
        </div>

        {/* Floating Cards */}
        <div className="hidden lg:block">
          <FloatingCard 
            icon={<Shield className="text-primary" size={20} />} 
            title="AI Moderation" 
            desc="Block toxicity in 34ms"
            className="top-[20%] left-[5%]"
            delay={0.5}
          />
          <FloatingCard 
            icon={<Brain className="text-blue-400" size={20} />} 
            title="Context Memory" 
            desc="Zero-shot recall"
            className="top-[45%] right-[2%]"
            delay={0.7}
          />
          <FloatingCard 
            icon={<MessageSquare className="text-cyan-400" size={20} />} 
            title="Smart Replies" 
            desc="Boost engagement by 40%"
            className="bottom-[15%] left-[10%]"
            delay={0.9}
          />
          <FloatingCard 
            icon={<Activity className="text-purple-400" size={20} />} 
            title="Sentiment" 
            desc="Live mood tracking"
            className="bottom-[25%] right-[8%]"
            delay={1.1}
          />
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ icon, title, desc, className, delay }: { icon: React.ReactNode, title: string, desc: string, className: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={cn("absolute glass p-4 rounded-2xl flex items-center space-x-4 w-64 shadow-2xl", className)}
      style={{
        animation: `float 6s ease-in-out infinite ${delay}s`
      }}
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-sm text-white">{title}</h4>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </motion.div>
  );
}
