"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Lightbulb,
  Rocket,
  Code,
  Calendar,
  Users,
  Award,
  ExternalLink,
} from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Prototype Category",
    description: "Competed in the most innovative category",
    color: "text-accent",
  },
  {
    icon: Users,
    title: "48 Hours",
    description: "Intensive development of complete MVP",
    color: "text-primary",
  },
  {
    icon: Award,
    title: "Recognition",
    description: "Most innovative reward system",
    color: "text-secondary",
  },
];

export function HackathonSection() {
  return (
    <section className="mb-20">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
          <span className="bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            LATIN HACK 2025
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The hackathon that brought UnitPoints to life and our vision of
          decentralized rewards
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Main Story Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full" />

          <div className="space-y-6 relative">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl">Our Origin</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  October 2025
                </div>
              </div>
            </div>

            <p className="text-lg leading-relaxed">
              UnitPoints was born during{" "}
              <span className="font-bold text-primary">LATIN HACK 2025</span>,
              the most important blockchain hackathon in Latin America. We
              competed in the{" "}
              <span className="font-bold text-secondary">Prototype</span>{" "}
              category with the goal of demonstrating how blockchain technology
              can revolutionize community engagement and governance.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.title} className="text-center">
                    <div
                      className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-2 mx-auto`}
                    >
                      <Icon className={`h-6 w-6 ${achievement.color}`} />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Problem-Solution Grid */}
        <div className="space-y-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">The Problem</h4>
                <p className="text-muted-foreground">
                  Centralized reward systems are fragile, unfair and lack
                  transparency. Communities need tools that truly empower them.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-secondary">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Rocket className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Our Solution</h4>
                <p className="text-muted-foreground">
                  Gamified and decentralized rewards with DAO governance on
                  Polkadot. Transparent, fair and community-controlled.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Code className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">The Impact</h4>
                <p className="text-muted-foreground">
                  Empowering communities with fair, transparent and engaging
                  reward systems that truly work for everyone.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <Card className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
        <Trophy className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
        <h3 className="font-display font-bold text-3xl mb-4">
          Want to be part of the revolution?
        </h3>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join our Discord community and help us build the future of
          decentralized rewards. Connect with fellow builders and get rewarded
          for your contributions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join Discord Community
            <Users className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
