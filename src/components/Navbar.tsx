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
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="text-xl font-bold tracking-tighter text-foreground font-[family-name:var(--font-heading)]">
              EMPHRA
            </span>
          </Link>

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

          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

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
