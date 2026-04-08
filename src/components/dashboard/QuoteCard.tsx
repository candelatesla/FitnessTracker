"use client";

import { useEffect, useState } from "react";
import { athleteQuotes } from "@/lib/data/quotes";

export function QuoteCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * athleteQuotes.length));
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % athleteQuotes.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const quote = athleteQuotes[index];

  return (
    <div className="panel-raised overflow-hidden p-6">
      <p className="font-display text-3xl uppercase tracking-[0.1em] text-accent">
        Motivation Feed
      </p>
      <p className="mt-4 text-balance text-xl leading-relaxed text-foreground">
        “{quote.quote}”
      </p>
      <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        {quote.flag} {quote.athlete}
      </p>
    </div>
  );
}
