"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { GlossaryHeader } from "@/components/glossary/glossary-header";
import { GlossaryGrid } from "@/components/glossary/glossary-grid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

const categories = [
  "All",
  "Basics",
  "Technical",
  "Governance",
  "Polkadot",
  "DeFi",
  "UnitPoints",
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 relative overflow-hidden">
      {/* Enhanced Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-24 left-1/4 w-80 h-80 bg-gradient-to-br from-primary/15 to-cyan-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-24 right-1/5 w-72 h-72 bg-gradient-to-br from-secondary/15 to-green-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/6 w-60 h-60 bg-gradient-to-br from-accent/15 to-purple-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      <Navbar />
      <div className="container px-4 py-24 mx-auto max-w-7xl relative z-10">
        <div className="animate-fade-in">
          <GlossaryHeader />
        </div>

        {/* Enhanced Search and Filter Section */}
        <div
          className="animate-fade-in mb-12"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/70 z-10" />
              <Input
                placeholder="Search terms, definitions, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-4 text-lg glass-surface border-primary/20 focus:border-primary/50 transition-all duration-300 rounded-2xl"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-primary/10"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "secondary"
                  }
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 border-2 border-primary/50"
                      : "bg-background/90 hover:bg-primary/20 hover:text-primary border-2 border-primary/30 text-foreground hover:border-primary/60 shadow-md"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <GlossaryGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </main>
  );
}
