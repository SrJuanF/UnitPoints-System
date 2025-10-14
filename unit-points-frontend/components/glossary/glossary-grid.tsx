"use client";

import { useMemo } from "react";
import { GlossaryCard } from "./glossary-card";

interface GlossaryGridProps {
  searchQuery: string;
  selectedCategory: string;
}

const terms = [
  {
    term: "Blockchain",
    definition:
      "A distributed digital ledger that records transactions across many computers. Think of it as a shared notebook that everyone can read, but no one can erase or change past entries.",
    category: "Basics",
    icon: "🔗",
  },
  {
    term: "Smart Contract",
    definition:
      "Self-executing code that runs on the blockchain. Like a vending machine - you put money in, and it automatically gives you what you paid for, no middleman needed.",
    category: "Basics",
    icon: "📜",
  },
  {
    term: "Wallet",
    definition:
      "A digital tool (like MetaMask) that stores your cryptocurrency and lets you interact with blockchain apps. It's like your digital bank account and ID card combined.",
    category: "Basics",
    icon: "👛",
  },
  {
    term: "Token",
    definition:
      "A digital asset on the blockchain. UPT (UnitPoints) is a token. Tokens can represent currency, voting power, rewards, or anything else of value.",
    category: "Basics",
    icon: "🪙",
  },
  {
    term: "ERC20",
    definition:
      "A standard for creating tokens on Ethereum-compatible blockchains. It's like a recipe that ensures all tokens work the same way, making them easy to trade and use.",
    category: "Technical",
    icon: "⚙️",
  },
  {
    term: "Gas Fees",
    definition:
      "The cost to perform transactions on the blockchain. Like paying a small fee to the network for processing your transaction. On Polkadot Asset Hub, you pay in PAS tokens.",
    category: "Technical",
    icon: "⛽",
  },
  {
    term: "DAO",
    definition:
      "Decentralized Autonomous Organization. A community-run organization where members vote on decisions. No CEO, no board - just token holders making decisions together.",
    category: "Governance",
    icon: "🏛️",
  },
  {
    term: "Governance",
    definition:
      "The process of making decisions about a project. In UnitPoints, token holders vote on proposals to shape the platform's future.",
    category: "Governance",
    icon: "🗳️",
  },
  {
    term: "Proposal",
    definition:
      "A suggestion for changing or improving the platform. Anyone can create a proposal, and token holders vote on whether to implement it.",
    category: "Governance",
    icon: "💡",
  },
  {
    term: "Polkadot",
    definition:
      "A blockchain network that connects multiple blockchains together. Think of it as a highway system connecting different cities (blockchains).",
    category: "Polkadot",
    icon: "🔴",
  },
  {
    term: "Asset Hub",
    definition:
      "A specialized blockchain in the Polkadot network for creating and managing tokens. It's where UnitPoints lives!",
    category: "Polkadot",
    icon: "🏦",
  },
  {
    term: "Paseo",
    definition:
      "The testnet (practice network) for Polkadot Asset Hub. It's like a sandbox where developers can test their apps without using real money.",
    category: "Polkadot",
    icon: "🧪",
  },
  {
    term: "Liquidity Pool",
    definition:
      "A collection of tokens locked in a smart contract that enables trading. It's like a community pot that lets people swap tokens instantly.",
    category: "DeFi",
    icon: "💧",
  },
  {
    term: "Swap",
    definition:
      "Exchanging one token for another. In UnitPoints, you can swap PAS tokens for UPT tokens and vice versa.",
    category: "DeFi",
    icon: "🔄",
  },
  {
    term: "AMM",
    definition:
      "Automated Market Maker. A smart contract that automatically sets token prices based on supply and demand. No human middleman needed!",
    category: "DeFi",
    icon: "🤖",
  },
  {
    term: "UnitPoints (UPT)",
    definition:
      "The main token of our platform. You earn UPT by participating in events and contributing to the community. Use it for governance voting and rewards.",
    category: "UnitPoints",
    icon: "⭐",
  },
  {
    term: "Leaderboard",
    definition:
      "A ranking system showing the most active community members. Climb the leaderboard by earning more UnitPoints through participation!",
    category: "UnitPoints",
    icon: "🏆",
  },
  {
    term: "Events",
    definition:
      "Activities and challenges in the UnitPoints platform. Join events to earn tokens, learn new skills, and connect with the community.",
    category: "UnitPoints",
    icon: "🎯",
  },
  {
    term: "Admin Panel",
    definition:
      "Special interface for platform administrators to manage users, events, and rewards. Only accessible to authorized admins.",
    category: "UnitPoints",
    icon: "⚡",
  },
  {
    term: "Mint",
    definition:
      "Creating new tokens. In UnitPoints, admins can mint (create) UPT tokens as rewards for users who contribute to the community.",
    category: "Technical",
    icon: "✨",
  },
  {
    term: "Burn",
    definition:
      "Permanently destroying tokens. In UnitPoints, admins can burn (remove) UPT tokens as penalties for rule violations.",
    category: "Technical",
    icon: "🔥",
  },
];

export function GlossaryGrid({
  searchQuery,
  selectedCategory,
}: GlossaryGridProps) {
  // Filter terms based on search query and selected category
  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch =
        searchQuery === "" ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || term.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = Array.from(new Set(filteredTerms.map((t) => t.category)));

  if (filteredTerms.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="font-display font-bold text-2xl mb-2">No terms found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* Results count */}
      <div className="text-center">
        <p className="text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-primary">
            {filteredTerms.length}
          </span>
          {filteredTerms.length === 1 ? " term" : " terms"}
          {selectedCategory !== "All" && (
            <span>
              {" "}
              in{" "}
              <span className="font-semibold text-secondary">
                {selectedCategory}
              </span>
            </span>
          )}
        </p>
      </div>

      {categories.map((category, categoryIndex) => (
        <div
          key={category}
          className="animate-fade-in"
          style={{ animationDelay: `${categoryIndex * 0.1}s` }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-12 flex items-center gap-4 text-glow">
            <span className="h-3 w-16 bg-gradient-to-r from-primary via-secondary to-accent rounded-full shadow-lg shadow-primary/30" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {category}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              (
              {
                filteredTerms.filter((term) => term.category === category)
                  .length
              }{" "}
              terms)
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTerms
              .filter((term) => term.category === category)
              .map((term, termIndex) => (
                <div
                  key={term.term}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${
                      categoryIndex * 0.1 + termIndex * 0.05
                    }s`,
                  }}
                >
                  <GlossaryCard term={term} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
