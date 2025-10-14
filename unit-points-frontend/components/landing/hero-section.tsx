"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { ScrollIndicator } from "./scroll-indicator";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { useLanguage } from "@/components/providers/language-provider";

export function HeroSection() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top / rect.height);
        setScrollY(scrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-24 md:pt-20 pb-20 z-10"
    >
      {/* Enhanced Parallax Background Elements - Limited to upper portion */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Primary floating orb - positioned higher */}
        <div
          className="absolute top-10 left-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float opacity-50"
          style={{
            transform: `translateY(${Math.min(scrollY * 80, 40)}px) rotate(${
              scrollY * 360
            }deg)`,
          }}
        />
        {/* Secondary floating orb - limited movement */}
        <div
          className="absolute top-16 right-10 w-72 h-72 bg-secondary/15 rounded-full blur-3xl animate-float opacity-40"
          style={{
            transform: `translateY(${Math.min(scrollY * -60, 30)}px) rotate(${
              scrollY * -180
            }deg)`,
            animationDelay: "1s",
          }}
        />
        {/* Accent floating orb - positioned higher */}
        <div
          className="absolute top-20 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-float opacity-30"
          style={{
            transform: `translateY(${Math.min(scrollY * 50, 25)}px) rotate(${
              scrollY * 90
            }deg)`,
            animationDelay: "2s",
          }}
        />
        {/* Central scaling orb - limited size and positioned higher */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) scale(${
              1 + scrollY * 0.2
            }) rotate(${scrollY * 45}deg)`,
          }}
        />
      </div>

      {/* Content - Compressed for scroll button space */}
      <div className="container relative z-10 px-4 py-8 md:py-10">
        <div className="max-w-4xl mx-auto text-center space-y-2">
          {/* Enhanced Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 text-sm font-medium animate-fade-in backdrop-blur-sm"
            style={{
              transform: `scale(${Math.max(1 - scrollY * 0.15, 0.85)})`,
              opacity: Math.max(1 - scrollY * 0.6, 0.3),
              animationDelay: "0.2s",
            }}
          >
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-glow">Built on Polkadot Asset Hub</span>
          </div>

          {/* Logo */}
          <div
            className="py-4 animate-fade-in flex justify-center"
            style={{
              transform: `translateY(${Math.min(
                scrollY * 25,
                40
              )}px) scale(${Math.max(1 - scrollY * 0.2, 0.8)})`,
              opacity: Math.max(1 - scrollY * 0.6, 0.2),
              animationDelay: "0.3s",
            }}
          >
            <div className="h-20 w-20 md:h-24 md:w-24 relative">
              <Image
                src="/logo.png"
                alt="UnitPoints Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                onError={(e) => {
                  // Fallback: hide if logo doesn't exist
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Enhanced Main Heading - Reduced size */}
          <h1
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-balance leading-tight tracking-tight pt-2"
            style={{
              transform: `translateY(${Math.min(scrollY * 30, 50)}px)`,
              opacity: Math.max(1 - scrollY * 0.6, 0.2),
            }}
          >
            {mounted ? (
              // Client-side rendering with translations
              (() => {
                const text = t("earnGovern");
                const words = text
                  .split(".")
                  .map((word) => word.trim())
                  .filter((word) => word.length > 0);

                return words.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`block ${
                      index === words.length - 1
                        ? "bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                        : ""
                    }`}
                  >
                    {word}.
                  </span>
                ));
              })()
            ) : (
              // Server-side rendering fallback
              <>
                <span className="block">Earn.</span>
                <span className="block">Play.</span>
                <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Govern.
                </span>
              </>
            )}
          </h1>

          {/* Enhanced Tagline - Reduced size */}
          <p
            className="text-base md:text-lg text-muted-foreground text-balance max-w-2xl mx-auto animate-fade-in pt-4"
            style={{
              transform: `translateY(${Math.min(scrollY * 20, 40)}px)`,
              opacity: Math.max(1 - scrollY * 0.6, 0.2),
              animationDelay: "0.4s",
            }}
          >
            {mounted
              ? t("gamifiedReward")
              : "A gamified reward platform on Polkadot Asset Hub"}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fade-in"
            style={{
              transform: `translateY(${Math.min(scrollY * 15, 30)}px)`,
              opacity: Math.max(1 - scrollY * 0.6, 0.2),
              animationDelay: "0.5s",
            }}
          >
            {user ? (
              <Button
                asChild
                size="lg"
                className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/50 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/70 hover:scale-105 button-glow group"
              >
                <Link href="/dashboard">
                  <Zap className="h-5 w-5 group-hover:animate-pulse" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="gap-3 text-lg px-10 py-7 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 text-white shadow-2xl shadow-primary/50 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/70 hover:scale-105 button-glow group"
              >
                <Link href="/auth/login">
                  <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                  Start Earning Now
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            )}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-3 text-lg px-9 py-6 glass-surface-strong border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 hover-lift group"
            >
              <Link href="#learn-more">
                Learn More
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Enhanced Stats - Compressed */}
          <div
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 animate-fade-in"
            style={{
              opacity: 1 - scrollY * 0.8,
              animationDelay: "0.6s",
            }}
          >
            <div className="space-y-1 text-center group hover-lift">
              <div className="text-2xl md:text-3xl font-display font-bold text-primary text-glow group-hover:scale-110 transition-transform">
                1000+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Active Users
              </div>
            </div>
            <div className="space-y-1 text-center group hover-lift">
              <div className="text-2xl md:text-3xl font-display font-bold text-secondary text-glow group-hover:scale-110 transition-transform">
                50K+
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                UPT Distributed
              </div>
            </div>
            <div className="space-y-1 text-center group hover-lift">
              <div className="text-2xl md:text-3xl font-display font-bold text-accent text-glow group-hover:scale-110 transition-transform">
                24/7
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                Governance
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollIndicator targetId="learn-more" />
    </section>
  );
}
