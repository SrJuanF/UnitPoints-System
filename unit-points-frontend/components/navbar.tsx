"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ConnectWalletButton } from "@/components/wallet/ConnectWallets";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Coins,
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  BookOpen,
  Calendar,
  FlaskConical,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { userRole, authenticated } = useAuth();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Check if user is on company onboarding flow

  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar at top of page
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Hide on scroll down, show on scroll up
      else if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollYRef.current) {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array since we're using ref

  const getNavItems = () => {
    const baseItems = [
      { href: "/", label: t("home"), icon: Coins },
      { href: "/about", label: t("about"), icon: Users },
      { href: "/glossary", label: t("glossary"), icon: BookOpen },
      { href: "/test", label: "Test", icon: FlaskConical },
    ];

    // Mostrar items según estado de autenticación y rol
    if (authenticated && userRole === "user") {
      return [
        baseItems[0],
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/events", label: t("events"), icon: Calendar },
        { href: "/swap", label: t("swap"), icon: ArrowLeftRight },
        ...baseItems.slice(1),
      ];
    }

    if (authenticated) {
      return [
        baseItems[0],
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/events", label: t("events"), icon: Calendar },
        ...baseItems.slice(1),
      ];
    }


    return [
      baseItems[0],
      { href: "/events", label: "Events", icon: Calendar },
      ...baseItems.slice(1),
    ];
  };

  const navItems = getNavItems();
  // Company onboarding removed - now handled by Privy

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 glass-surface-strong shadow-lg shadow-black/5 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="flex items-center gap-3 group transition-all duration-300 cursor-pointer"
              prefetch={true}
            >
              <div className="h-12 w-12 relative">
                <Image
                  src="/logo.png"
                  alt="UnitPoints Logo"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                  priority
                  onError={(e) => {
                    // Fallback to default icon if logo doesn't exist
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="font-display font-bold text-2xl group-hover:text-primary transition-colors duration-300">
                UnitPoints
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} prefetch={true}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className={`gap-2 px-4 py-2 transition-all duration-300 hover:scale-102 cursor-pointer ${
                        isActive
                          ? "bg-primary/20 text-primary shadow-md shadow-primary/20 hover:bg-primary/25"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "" : ""}`} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-1 rounded-lg bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
