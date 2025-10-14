"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Zap, Shield, Layers, Code2 } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function TechStackSection() {
  const { t } = useLanguage();

  const technologies = [
    {
      category: t("blockchain"),
      icon: Shield,
      items: ["Solidity", "ERC20", "Polkadot Asset Hub", "Ethers.js"],
      color: "from-blue-500/30 to-cyan-500/20",
      textColor: "text-blue-400",
      bgHover: "group-hover:from-blue-500/40 group-hover:to-cyan-500/30",
    },
    {
      category: t("frontend"),
      icon: Code2,
      items: ["Next.js", "React", "TypeScript", "TailwindCSS"],
      color: "from-green-500/30 to-emerald-500/20",
      textColor: "text-green-400",
      bgHover: "group-hover:from-green-500/40 group-hover:to-emerald-500/30",
    },
    {
      category: t("tools"),
      icon: Layers,
      items: ["MetaMask", "Blockscout", "Vercel", "kitdot"],
      color: "from-purple-500/30 to-violet-500/20",
      textColor: "text-purple-400",
      bgHover: "group-hover:from-purple-500/40 group-hover:to-violet-500/30",
    },
    {
      category: t("features"),
      icon: Zap,
      items: ["DAO Governance", "Token Swaps", "Gamification", "Admin Panel"],
      color: "from-orange-500/30 to-red-500/20",
      textColor: "text-orange-400",
      bgHover: "group-hover:from-orange-500/40 group-hover:to-red-500/30",
    },
  ];

  return (
    <section className="mb-16">
      <div className="text-center mb-16">
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("techStack")}
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t("builtWithModern")}
        </p>
      </div>

      {/* Technology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <Card
              key={tech.category}
              className="p-8 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 group border-primary/10 hover:border-primary/30 relative overflow-hidden"
            >
              {/* Enhanced background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${tech.color} ${
                  tech.bgHover || ""
                } transition-all duration-500`}
              />

              <div className="relative space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={`h-16 w-16 rounded-xl bg-gradient-to-br ${tech.color} border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <Icon
                      className={`h-8 w-8 ${tech.textColor} drop-shadow-sm`}
                    />
                  </div>
                  <h3 className="font-display font-bold text-2xl group-hover:text-primary transition-colors duration-300">
                    {tech.category}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {tech.items.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="bg-black/20 hover:bg-black/30 text-white border border-white/20 hover:border-white/40 transition-all duration-300 cursor-default text-xs font-medium py-2 px-4 justify-center text-center min-h-[32px] flex items-center whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
