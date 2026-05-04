"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const navLinks = [
  { name: "Product", href: "/#product" },
  { name: "Demo", href: "/demo" },
  { name: "Pricing", href: "/#pricing", comingSoon: true },
  { name: "Docs", href: "/#docs", comingSoon: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, link: typeof navLinks[0]) => {
    if (link.comingSoon) {
      e.preventDefault();
      toast.info(`${link.name} is coming soon!`);
    }
  };

  const handleApiAccess = () => {
    toast.info("API Access registration is coming soon!");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-white/10 py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center glow-sm group-hover:glow-md transition-all duration-300">
            <Zap className="text-primary-foreground fill-current" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white">
            EMPHRA
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Button 
            onClick={handleApiAccess}
            className="bg-white text-black hover:bg-white/90 rounded-full px-6 font-semibold group"
          >
            Get API Access
            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-white/10 p-6 md:hidden flex flex-col space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
                onClick={(e) => {
                    handleLinkClick(e, link);
                    if (!link.comingSoon) setIsMobileMenuOpen(false);
                }}
              >
                {link.name}
              </Link>
            ))}
            <Button 
                onClick={() => {
                    handleApiAccess();
                    setIsMobileMenuOpen(false);
                }}
                className="bg-white text-black hover:bg-white/90 rounded-full w-full py-6 text-lg font-semibold"
            >
              Get API Access
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
