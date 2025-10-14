"use client";

import { Users, Sparkles, Globe, Award } from "lucide-react";
import { Card } from "@/components/ui/card";

const stats = [
  {
    icon: Users,
    label: "Community Members",
    value: "10K+",
    color: "text-primary",
  },
  {
    icon: Award,
    label: "Events Hosted",
    value: "500+",
    color: "text-secondary",
  },
  {
    icon: Sparkles,
    label: "UnitPoints Earned",
    value: "1M+",
    color: "text-accent",
  },
  { icon: Globe, label: "Countries", value: "50+", color: "text-primary" },
];

export function AboutHeader() {
  return (
    <div className="text-center space-y-2 mb-12">
      <div className="animate-fade-in">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent mb-4 shadow-2xl shadow-primary/40 hover-lift relative">
          <Users className="h-12 w-12 text-white animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 animate-pulse" />
        </div>
      </div>

      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow">
            About
          </span>{" "}
          <span className="text-foreground">Us</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto text-balance leading-relaxed mb-8">
          Building the future of community rewards on Polkadot.
          <br className="hidden md:block" />
          <span className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Innovation • Community • Decentralization
          </span>
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            Built with passion at LATIN HACK 2025
          </span>
        </div>
      </div>

      {/* Enhanced Stats Section */}
      <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="p-6 text-center glass-surface border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group cursor-pointer"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div
                  className={`inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
