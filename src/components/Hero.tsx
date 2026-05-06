"use client";

import { useEffect, useState } from "react";
import { getGhostStats } from "@/lib/ghostEngine";

export default function Hero() {
  const [stats, setStats] = useState({ playersToday: 238, totalVolume: 12.4, tokensCreated: 47 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getGhostStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative text-center px-4 pt-16 pb-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#bf5af2] opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#39ff14] opacity-5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#12121a] border border-[#1e1e2e] rounded-full px-4 py-1.5 mb-6">
          <span className="w-2 h-2 bg-[#39ff14] rounded-full animate-pulse" />
          <span className="text-xs text-zinc-400">Live on BSC — {stats.playersToday} active players</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-4">
          Create & Predict in{" "}
          <span className="neon-text-green">1 Click</span>
        </h1>

        <p className="text-zinc-500 text-lg max-w-xl mx-auto mb-8">
          Create your own token with AI auto-packaging + built-in prediction markets.
          No code. No team. Just deploy.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#create" className="btn-primary px-8 py-3 rounded-xl text-base">
            Create Token 🚀
          </a>
          <a href="#predictions" className="btn-secondary px-8 py-3 rounded-xl text-base">
            View Predictions 📊
          </a>
        </div>

        <div className="flex gap-6 sm:gap-12 justify-center mt-10">
          <div>
            <div className="text-2xl font-bold text-zinc-200">{stats.playersToday}</div>
            <div className="text-xs text-zinc-500">Players Today</div>
          </div>
          <div className="w-px bg-[#1e1e2e]" />
          <div>
            <div className="text-2xl font-bold text-[#39ff14]">${stats.totalVolume}K</div>
            <div className="text-xs text-zinc-500">Total Volume</div>
          </div>
          <div className="w-px bg-[#1e1e2e]" />
          <div>
            <div className="text-2xl font-bold text-[#bf5af2]">{stats.tokensCreated}</div>
            <div className="text-xs text-zinc-500">Tokens Created</div>
          </div>
        </div>
      </div>
    </section>
  );
}
