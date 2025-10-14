"use client";

import { BookOpen } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export function GlossaryHeader() {
  const { t } = useLanguage();
  return (
    <div className="text-center space-y-2 mb-16">
      <div className="animate-fade-in">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-2xl shadow-primary/30 hover-lift mb-4">
          <BookOpen className="h-12 w-12 text-white animate-pulse" />
        </div>
      </div>
      <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow">
            {t("glossary")}
          </span>{" "}
          <span className="text-foreground">Web3</span>
        </h1>
        <p
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance mt-6 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Your friendly guide to Web3 and Polkadot terminology.
          <br className="hidden md:block" />
          <span className="text-primary font-semibold">
            Learn • Understand • Build
          </span>
        </p>
      </div>
    </div>
  );
}
