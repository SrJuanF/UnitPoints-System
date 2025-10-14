"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Github, Twitter, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { useLanguage } from "@/components/providers/language-provider";

export function CTASection() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-t from-background via-background/95 to-primary/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <Card className="max-w-5xl mx-auto p-10 md:p-16 glass-surface-strong gradient-border shadow-2xl shadow-primary/10 hover-lift animate-fade-in">
          <div className="text-center space-y-8">
            <h2 className="font-display font-bold text-5xl md:text-6xl text-balance leading-tight animate-fade-in">
              {t("readyToStart")}{" "}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent text-glow">
                {t("unitPoints")}?
              </span>
            </h2>
            <p
              className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {t("joinCommunity")}
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="gap-3 text-xl px-12 py-8 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/50 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/70 hover:scale-105 button-glow group"
                >
                  <Link href="/dashboard">
                    <Zap className="h-6 w-6 group-hover:animate-pulse" />
                    {t("gotoDashboard")}
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="gap-3 text-xl px-12 py-8 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/50 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/70 hover:scale-105 button-glow group"
                  >
                    <Link href="/auth/login">
                      <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                      {t("launchApp")}
                      <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="gap-3 text-xl px-11 py-7 glass-surface-strong border-2 border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 hover-lift group"
                  >
                    <Link href="/test">
                      {t("viewDemo")}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Enhanced Social Links */}
            <div
              className="flex items-center justify-center gap-6 pt-10 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full glass-surface hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110 group"
              >
                <Github className="h-6 w-6 group-hover:animate-pulse" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-14 h-14 rounded-full glass-surface hover:bg-primary/20 hover:text-primary transition-all duration-300 hover:scale-110 group"
              >
                <Twitter className="h-6 w-6 group-hover:animate-pulse" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Footer */}
        <div
          className="text-center mt-6 text-base text-muted-foreground animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <p className="font-medium">{t("builtForLatinHack")}</p>
        </div>
      </div>
    </section>
  );
}
