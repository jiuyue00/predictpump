"use client";

import { useEffect, useState } from "react";
import { getGhostActions } from "@/lib/ghostEngine";

interface Player {
  address: string;
  winRate: number;
  totalBets: number;
  volume: number;
  pnl: number;
}

export default function PlayerLeaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const gen = () => {
      const actions = getGhostActions();
      const playerMap = new Map<string, { bets: number; wins: number; volume: number }>();

      actions.forEach((a) => {
        const addr = a.player.address;
        const p = playerMap.get(addr) || { bets: 0, wins: 0, volume: 0 };
        p.bets += 1;
        if (a.type === "claim") p.wins += 1;
        if (a.amount) p.volume += a.amount;
        playerMap.set(addr, p);
      });

      return Array.from(playerMap.entries())
        .map(([address, data]) => ({
          address: address.substring(0, 6) + "..." + address.substring(38),
          winRate: data.bets > 0 ? data.wins / data.bets : 0,
          totalBets: data.bets,
          volume: parseFloat(data.volume.toFixed(2)),
          pnl: parseFloat((Math.random() * 10 - 2).toFixed(2)),
        }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 20);
    };

    setPlayers(gen());
    const interval = setInterval(() => {
      setPlayers(gen());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">👑 Top Players</h2>
        <span className="text-xs text-zinc-500">By volume • Live</span>
      </div>

      <div className="bg-card rounded-xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-5 gap-4 px-4 py-3 text-xs text-zinc-500 border-b border-[#1e1e2e]">
          <span className="col-span-2">Player</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Win Rate</span>
          <span className="text-right">PnL (BNB)</span>
        </div>
        {players.map((p, i) => (
          <div
            key={p.address + i}
            className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 border-b border-[#1e1e2e]/50 hover:bg-[#12121a] transition-colors animate-slide-in"
          >
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-xs text-zinc-600 w-5">#{i + 1}</span>
              <span className="text-sm font-mono text-xs">{p.address}</span>
            </div>
            <span className="text-sm text-right">{p.volume} BNB</span>
            <span className="text-sm text-right text-zinc-400">
              {(p.winRate * 100).toFixed(0)}%
            </span>
            <span
              className={`text-sm text-right font-bold ${
                p.pnl >= 0 ? "text-[#39ff14]" : "text-red-400"
              }`}
            >
              {p.pnl >= 0 ? "+" : ""}
              {p.pnl.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
