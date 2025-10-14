"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Coins, Vote, ArrowLeftRight, Trophy, Shield, Zap } from "lucide-react";

const timelineSteps = [
  {
    id: "what",
    icon: Coins,
    title: "What is UnitPoints?",
    description:
      "UnitPoints (UPT) is a gamified ERC20 token on Polkadot Asset Hub. Earn rewards for contributions, participate in governance, and swap with PAS tokens.",
    features: ["ERC20 Token", "Polkadot Integration", "Gamified Rewards"],
  },
  {
    id: "earn",
    icon: Trophy,
    title: "How to Earn UPT",
    description:
      "Contribute to the community and earn UnitPoints! Complete tasks, participate in discussions, and help others to level up your profile.",
    features: [
      "Community Contributions",
      "Task Completion",
      "Referral Rewards",
    ],
  },
  {
    id: "penalties",
    icon: Shield,
    title: "Rewards & Penalties",
    description:
      "Our fair system rewards positive contributions and penalizes harmful behavior. Admins can mint tokens for rewards or burn them as penalties.",
    features: [
      "Merit-Based System",
      "Transparent Rules",
      "Community Moderation",
    ],
  },
  {
    id: "dao",
    icon: Vote,
    title: "DAO Voting with UPT",
    description:
      "Use your UnitPoints to vote on proposals and shape the future of the platform. One UPT equals one vote in our decentralized governance.",
    features: ["Proposal Creation", "Democratic Voting", "On-Chain Governance"],
  },
  {
    id: "swap",
    icon: ArrowLeftRight,
    title: "Swap PAS ↔ UPT",
    description:
      "Exchange your PAS tokens for UPT and vice versa. Our liquidity pool ensures fair pricing and instant swaps with minimal fees.",
    features: ["Instant Swaps", "Fair Pricing", "Low Fees"],
  },
];

export function TimelineSection() {
  const [visibleSteps, setVisibleSteps] = useState<Set<string>>(new Set());
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stepRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      // Calculate overall progress - adjusted to be more synchronized with card visibility
      const progress = Math.max(
        0,
        Math.min(1, (viewportHeight * 0.3 - sectionTop) / (sectionHeight * 0.8))
      );
      setScrollProgress(progress);

      // Check visibility of each step - made more generous for earlier card appearance
      const newVisibleSteps = new Set<string>();
      stepRefs.current.forEach((element, id) => {
        const stepRect = element.getBoundingClientRect();
        if (
          stepRect.top < viewportHeight * 0.9 &&
          stepRect.bottom > viewportHeight * 0.1
        ) {
          newVisibleSteps.add(id);
        }
      });
      setVisibleSteps(newVisibleSteps);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="learn-more"
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-background via-background/95 to-primary/5 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="font-display font-bold text-5xl md:text-6xl mb-4 leading-tight">
            Your Journey with{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow">
              UnitPoints
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground text-balance leading-relaxed">
            Discover how UnitPoints transforms community participation into
            tangible rewards and governance power.
          </p>
        </div>

        {/* Enhanced Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Enhanced Progress Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-border via-border to-transparent rounded-full -translate-x-1/2">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-secondary to-accent rounded-full transition-all duration-500 ease-out shadow-lg shadow-primary/30"
              style={{
                height: `${scrollProgress * 100}%`,
              }}
            />
          </div>

          {/* Enhanced Timeline Steps */}
          <div className="space-y-32">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSteps.has(step.id);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    if (el) stepRefs.current.set(step.id, el);
                  }}
                  className={`relative flex items-center ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Enhanced Timeline Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-20">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-700 ease-out ${
                        isVisible
                          ? "bg-gradient-to-br from-primary via-secondary to-accent scale-100 animate-pulse-glow shadow-2xl shadow-primary/50"
                          : "bg-muted/50 scale-75 opacity-50"
                      }`}
                    >
                      <Icon
                        className={`h-10 w-10 transition-all duration-500 ${
                          isVisible
                            ? "text-white animate-pulse"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    {/* Node glow effect */}
                    {isVisible && (
                      <div className="absolute inset-0 w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-xl animate-pulse" />
                    )}
                  </div>

                  {/* Enhanced Content Card */}
                  <div
                    className={`w-full md:w-[calc(50%-5rem)] ${
                      isEven ? "md:pr-20" : "md:pl-20"
                    } pl-28 md:pl-0`}
                  >
                    <Card
                      className={`p-8 transition-all duration-700 ease-out glass-surface-strong hover-lift card-interactive border-primary/20 ${
                        isVisible
                          ? "opacity-100 translate-y-0 scale-100"
                          : `opacity-0 scale-95 ${
                              isEven ? "translate-x-12" : "-translate-x-12"
                            }`
                      }`}
                    >
                      <div className="space-y-6">
                        <h3 className="font-display font-bold text-3xl text-glow">
                          {step.title}
                        </h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {step.features.map((feature, featureIndex) => (
                            <span
                              key={feature}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 text-primary text-sm font-semibold glass-surface hover-lift animate-fade-in"
                              style={{
                                animationDelay: `${
                                  index * 0.1 + featureIndex * 0.05
                                }s`,
                              }}
                            >
                              <Zap className="h-4 w-4 animate-pulse" />
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
