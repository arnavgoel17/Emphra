"use client";

import React from "react";
import Link from "next/link";
import { Zap, Code2, Send, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 group mb-6">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center glow-sm">
                <Zap className="text-primary-foreground fill-current" size={18} />
              </div>
              <span className="text-xl font-bold tracking-tighter text-white">
                EMPHRA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The intelligence layer for modern conversations. Build safer, 
              smarter, and more engaging chat platforms with one API.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#product" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="#demo" className="hover:text-primary transition-colors">Live Demo</Link></li>
              <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="#docs" className="hover:text-primary transition-colors">API Reference</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors">
                <Send size={18} className="text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors">
                <Code2 size={18} className="text-white" />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors">
                <Globe size={18} className="text-white" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 Emphra AI Inc. All rights reserved.</p>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Designed & Engineered for the future of communication.
          </p>
        </div>
      </div>
    </footer>
  );
}
