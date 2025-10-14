import { Navbar } from "@/components/navbar";
import { AboutHeader } from "@/components/about/about-header";
import { MissionSection } from "@/components/about/mission-section";
import { TeamSection } from "@/components/about/team-section";
import { HackathonSection } from "@/components/about/hackathon-section";
import { TechStackSection } from "@/components/about/tech-stack-section";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-32 left-1/4 w-80 h-80 bg-gradient-to-br from-secondary/15 to-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/3 right-1/6 w-64 h-64 bg-gradient-to-br from-accent/12 to-primary/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/6 w-72 h-72 bg-gradient-to-br from-primary/8 to-accent/12 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3.5s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <Navbar />
      <div className="container px-4 py-24 mx-auto relative z-10 max-w-7xl">
        <div className="animate-fade-in">
          <AboutHeader />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <MissionSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <TeamSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <HackathonSection />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <TechStackSection />
        </div>
      </div>
    </main>
  );
}
