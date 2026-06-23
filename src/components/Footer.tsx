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
