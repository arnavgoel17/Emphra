import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Key, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, 
  BreadcrumbPage, BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { EmphraPlayground } from "@/components/demo/EmphraPlayground";
import { Toaster } from "@/components/ui/sonner";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header / Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild className="text-muted-foreground hover:text-white transition-colors">
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight size={12} />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-primary font-bold">Interactive Demo</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
              Emphra <span className="text-primary-gradient">Live Playground</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              The world&apos;s most advanced API for chat intelligence. Test moderation, 
              sentiment, and memory in a real-time environment.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs">
              <LayoutGrid size={16} className="mr-2" />
              View API Docs
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-xs glow-sm group">
              <Key size={16} className="mr-2" />
              Get API Key
              <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Main Playground Component */}
        <EmphraPlayground />

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>API Uptime: 99.99%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Edge Node: Global</span>
            </div>
          </div>
          
          <div className="text-[10px] font-bold text-muted-foreground/50 text-center md:text-right">
            By using this playground, you agree to our Terms of Service and Privacy Policy. 
            All data simulated for demonstration purposes.
          </div>
        </div>
      </div>
      <Toaster theme="dark" position="bottom-right" closeButton />
    </div>
  );
}
