"use client";

export function SwapHeader() {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="animate-fade-in">
        <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-balance tracking-tight leading-tight">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Swap Tokens
          </span>
        </h1>
        <p
          className="text-muted-foreground text-lg md:text-xl font-medium max-w-3xl mx-auto mt-6 leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Exchange PAS and UPT instantly with low fees on Polkadot Asset Hub.
          <br className="hidden md:block" />
          <span className="text-primary font-semibold">
            Fast, Secure, Decentralized.
          </span>
        </p>
      </div>
    </div>
  );
}
