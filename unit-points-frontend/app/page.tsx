import { HeroSection } from "@/components/landing/hero-section";
import { TimelineSection } from "@/components/landing/timeline-section";
import { CTASection } from "@/components/landing/cta-section";
import { Navbar } from "@/components/navbar";
//import { PrivyTest } from "@/components/test/privy-test";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/*<div className="container mx-auto px-4 py-8">
        <PrivyTest />
      </div>*/}
      <HeroSection />
      <TimelineSection />
      <CTASection />
    </main>
  );
}
