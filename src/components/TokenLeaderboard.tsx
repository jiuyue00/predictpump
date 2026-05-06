"use client";

import { useEffect, useState } from "react";
import { subscribeGhostActions, getGhostActions } from "@/lib/ghostEngine";

interface TokenStat {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  holders: number;
  volume24h: number;
  change24h: number;
}

export default function TokenLeaderboard() {
  const [tokens, setTokens] = useState<TokenStat[]>([]);

  useEffect(() => {
    const symbols = ["PEPE2", "MOON", "DOGE2", "AGENT", "ELON", "TURBO", "GROK", "CATWIF", "BONK2", "SHIBA2"];
    const names = ["Pepe 2.0", "Moon Cat", "Doge 2.0", "AI Agent", "Elon Musk", "Turbo", "Grok", "CatWif", "Bonk2", "Shiba 2.0"];

    const gen = () =>
      symbols.map((s, i) => ({
        symbol: s,
        name: names[i],
        price: parseFloat((Math.random() * 0.01 + 0.0000001).toFixed(8)),
        marketCap: parseFloat((Math.random() * 50 + 0.1).toFixed(2)),
        holders: Math.floor(Math.random() * 5000 + 10),
        volume24h: parseFloat((Math.random() * 100 + 0.5).toFixed(1)),
        change24h: parseFloat((Math.random() * 200 - 50).toFixed(1)),
      }))
      .sort((a, b) => b.volume24h - a.volume24h);

    setTokens(gen());
    const interval = setInterval(() => {
      setTokens((prev) =>
        prev
          .map((t) => ({
            ...t,
            price: t.price * (1 + (Math.random() - 0.5) * 0.1),
            volume24h: t.volume24h + Math.random() * 5,
            change24h: parseFloat(
              (t.change24h + (Math.random() - 0.5) * 5).toFixed(1)
            ),
          }))
          .sort((a, b) => b.volume24h - a.volume24h)
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">🏆 Token Leaderboard</h2>
        <span className="text-xs text-zinc-500">24h volume • Live</span>
      </div>

      <div className="bg-card rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-6 gap-4 px-4 py-3 text-xs text-zinc-500 border-b border-[#1e1e2e]">
          <span className="col-span-2">Token</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h Volume</span>
          <span className="text-right">Holders</span>
          <span className="text-right">24h Chg</span>
        </div>
        {tokens.map((t, i) => (
          <div
            key={t.symbol}
            className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-4 px-4 py-3 border-b border-[#1e1e2e]/50 hover:bg-[#12121a] transition-colors"
          >
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-xs text-zinc-600 w-5">#{i + 1}</span>
              <span className="text-sm font-bold">{t.symbol}</span>
              <span className="text-xs text-zinc-500 hidden sm:inline">{t.name}</span>
            </div>
            <span className="text-sm text-right font-mono">
              ${t.price.toFixed(8)}
            </span>
            <span className="text-sm text-right text-zinc-300">
              ${t.volume24h.toFixed(1)}K
            </span>
            <span className="text-sm text-right text-zinc-400">
              {t.holders > 999 ? `${(t.holders / 1000).toFixed(1)}K` : t.holders}
            </span>
            <span
              className={`text-sm text-right font-bold ${
                t.change24h >= 0 ? "text-[#39ff14]" : "text-red-400"
              }`}
            >
              {t.change24h >= 0 ? "+" : ""}
              {t.change24h}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
