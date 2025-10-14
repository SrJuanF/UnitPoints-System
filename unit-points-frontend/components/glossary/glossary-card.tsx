"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  icon: string;
}

export function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card
      className="p-6 cursor-pointer hover-lift card-interactive glass-surface border-primary/20 group transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
              {term.icon}
            </span>
            <h3 className="font-display font-bold text-xl md:text-2xl text-glow group-hover:text-primary transition-colors">
              {term.term}
            </h3>
          </div>
          <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-primary group-hover:animate-pulse" />
            ) : (
              <ChevronDown className="h-5 w-5 text-primary group-hover:animate-pulse" />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="pt-4 border-t border-primary/20 animate-fade-in">
            <p className="text-base text-muted-foreground leading-relaxed">
              {term.definition}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
