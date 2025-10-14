"use client";
import { useEffect, useState, useRef } from "react";

interface ScrollIndicatorProps {
  targetId?: string;
  className?: string;
}

export function ScrollIndicator({
  targetId = "learn-more",
  className = "",
}: ScrollIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setMounted(true);

      // Initialize progress based on current scroll position
      const initialY = window.scrollY;
      const initialViewport = window.innerHeight || 1;
      const initialRatio = Math.min(1, initialY / initialViewport);
      setProgress(initialRatio);
      setInitialized(true);
    }, 50); // Small delay to prevent flash

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const viewport = window.innerHeight || 1;
        const ratio = Math.min(1, y / viewport);
        setProgress(ratio);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const opacity = initialized ? Math.max(0, 1 - progress * 1.7) : 0;
  const translateY = mounted ? progress * 6 : 0;

  return (
    <a
      href={`#${targetId}`}
      aria-label="Scroll to content"
      className={`pointer-events-auto fixed bottom-8 left-1/2 transform -translate-x-1/2 group z-50 ${className}`}
      style={{
        opacity,
        transform: `translateX(-50%) translateY(${translateY}px)`,
      }}
    >
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-primary/20 blur-lg opacity-40 group-hover:opacity-70 transition-all duration-300 motion-reduce:hidden" />
        <div className="relative w-8 h-12 border-2 border-primary/50 rounded-full flex items-start justify-center p-2 overflow-hidden backdrop-blur-md bg-background/70 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 group-hover:border-primary/70 transition-all duration-300">
          <div
            className={`w-1.5 h-3 bg-gradient-to-b from-primary via-primary to-primary/30 rounded-full ${
              mounted ? "animate-scroll-dot" : "fallback-dot"
            } motion-reduce:animate-none`}
          />
        </div>
      </div>
    </a>
  );
}
