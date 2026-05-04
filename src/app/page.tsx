import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { Features } from "@/components/Features";
import { PlaygroundContainer } from "@/components/playground/PlaygroundContainer";
import { ApiDocs } from "@/components/ApiDocs";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <SocialProof />
      <Features />
      <PlaygroundContainer />
      <ApiDocs />
      <Pricing />
      <Testimonials />
      <FAQ />
    </main>
  );
}
