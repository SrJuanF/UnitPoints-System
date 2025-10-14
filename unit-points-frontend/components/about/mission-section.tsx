"use client";

import { Card } from "@/components/ui/card";
import { Target, Heart, Zap, Shield, Users, Rocket } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To create a fair and transparent reward system that empowers communities to recognize and incentivize positive contributions through blockchain technology.",
    color: "text-primary",
    bgColor: "from-primary/20 to-primary/10",
  },
  {
    icon: Heart,
    title: "Our Vision",
    description:
      "A world where every contribution matters, where communities thrive through gamified engagement, and where governance is truly decentralized and democratic.",
    color: "text-secondary",
    bgColor: "from-secondary/20 to-secondary/10",
  },
  {
    icon: Zap,
    title: "Our Values",
    description:
      "Transparency, fairness, innovation, and community-first thinking. We believe in building tools that put power back in the hands of the people.",
    color: "text-accent",
    bgColor: "from-accent/20 to-accent/10",
  },
];

const features = [
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Built on Polkadot Asset Hub for maximum security",
  },
  {
    icon: Users,
    title: "DAO Governance",
    description: "Decentralized decisions by the community",
  },
  {
    icon: Rocket,
    title: "Scalability",
    description: "Designed to grow with your community",
  },
];

export function MissionSection() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Purpose
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Building the future of community rewards with blockchain technology
        </p>
      </div>

      {/* Main Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <Card
              key={value.title}
              className="p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group glass-surface border-primary/10 hover:border-primary/30 relative overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${value.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative space-y-6">
                <div
                  className={`h-16 w-16 rounded-full bg-gradient-to-br ${value.bgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`h-8 w-8 ${value.color}`} />
                </div>
                <h3 className="font-display font-bold text-2xl group-hover:text-primary transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {value.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
        <h3 className="font-display font-bold text-2xl text-center mb-8">
          Why choose UnitPoints?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center space-y-3">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mx-auto">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-lg">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
