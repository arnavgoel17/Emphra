import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { Architecture } from "@/components/Architecture";
import { Metrics } from "@/components/Metrics";
import { PlaygroundCTA } from "@/components/PlaygroundCTA";
import { ApiDocs } from "@/components/ApiDocs";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Vision } from "@/components/Vision";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Hero />
      <SocialProof />
      <Features />
      <Architecture />
      <Metrics />
      <PlaygroundCTA />
      <ApiDocs />
      <Pricing />
      <Testimonials />
      <Vision />
      <FAQ />
    </main>
  );
}
