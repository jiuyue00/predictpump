"use client";

import { useEffect, useState } from "react";
import { subscribeGhostActions, type GhostAction } from "@/lib/ghostEngine";

function actionToMessage(a: GhostAction): string {
  const addr = a.player.address.substring(0, 6) + "..." + a.player.address.substring(38);
  switch (a.type) {
    case "create": return `${addr} just created $${a.symbol} 🐸`;
    case "predict_up": return `${addr} predicted UP on $${a.symbol} 🚀`;
    case "predict_down": return `${addr} predicted DOWN on $${a.symbol} 📉`;
    case "buy": return `${addr} bought $${a.amount} $${a.symbol}`;
    case "sell": return `${addr} sold $${a.symbol} for +${(Math.random() * 300 + 10).toFixed(0)}% 💰`;
    case "claim": return `${addr} claimed ${(Math.random() * 5).toFixed(1)} BNB on $${a.symbol} 🎯`;
  }
}

export default function LiveTicker() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const unsub = subscribeGhostActions((actions) => {
      setItems(actions.slice(0, 30).map(actionToMessage));
    });
    return unsub;
  }, []);

  // Don't render until we have items
  if (items.length === 0) return null;

  return (
    <div className="w-full overflow-hidden border-y border-[#1e1e2e] bg-[#0d0d15] py-2">
      <div className="flex whitespace-nowrap animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="mx-6 text-sm text-zinc-400 font-mono">
            {i < items.length ? "⚡" : " "} {item}
          </span>
        ))}
      </div>
    </div>
  );
}
