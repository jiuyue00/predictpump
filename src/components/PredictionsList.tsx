"use client";

import { useEffect, useState } from "react";
import { generateGhostPredictions, subscribeGhostActions } from "@/lib/ghostEngine";

interface Prediction {
  id: number;
  token: string;
  symbol: string;
  question: string;
  upPool: number;
  downPool: number;
  endTime: string;
  status: "active" | "resolved";
  winner?: "up" | "down";
}

export default function PredictionsList() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    setPredictions(generateGhostPredictions());

    const unsub = subscribeGhostActions(() => {
      setPredictions((prev) =>
        prev.map((p) => {
          if (p.status !== "active") return p;
          const isUp = Math.random() > 0.5;
          const amount = parseFloat((Math.random() * 0.3).toFixed(2));
          return {
            ...p,
            upPool: isUp ? parseFloat((p.upPool + amount).toFixed(1)) : p.upPool,
            downPool: !isUp ? parseFloat((p.downPool + amount).toFixed(1)) : p.downPool,
          };
        })
      );
    });

    return unsub;
  }, []);

  if (predictions.length === 0) return null;

  return (
    <section id="predictions" className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Active Predictions</h2>
        <span className="text-xs text-zinc-500">24h markets • Real-time</span>
      </div>

      <div className="space-y-3">
        {predictions.filter((p) => p.status === "active").map((pred) => {
          const total = pred.upPool + pred.downPool;
          const upPct = total > 0 ? (pred.upPool / total) * 100 : 50;

          return (
            <div key={pred.id} className="bg-card rounded-xl p-4 animate-slide-in">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold">{pred.symbol}</span>
                <span className="text-xs text-zinc-500">{pred.endTime}</span>
              </div>
              <p className="text-sm text-zinc-300 mb-3">{pred.question}</p>

              <div className="flex gap-2 items-center mb-2">
                <span className="text-xs text-[#39ff14] font-bold w-8 text-right">UP</span>
                <div className="flex-1 h-3 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#39ff14] rounded-full transition-all duration-1000"
                    style={{ width: `${upPct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-10">{pred.upPool.toFixed(1)} BNB</span>
              </div>
              <div className="flex gap-2 items-center mb-3">
                <span className="text-xs text-red-400 font-bold w-8 text-right">DOWN</span>
                <div className="flex-1 h-3 bg-[#0a0a0f] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full transition-all duration-1000"
                    style={{ width: `${100 - upPct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400 w-10">{pred.downPool.toFixed(1)} BNB</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs font-bold bg-[#39ff14]/10 text-[#39ff14] border border-[#39ff14]/30 hover:bg-[#39ff14]/20 transition-colors">
                  Predict UP 🚀
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors">
                  Predict DOWN 📉
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h3 className="text-sm text-zinc-500 mb-3">Recently Resolved</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {predictions.filter((p) => p.status === "resolved").map((pred) => (
            <div key={pred.id} className="bg-card rounded-lg p-3 text-center opacity-70">
              <div className="text-sm font-bold mb-1">{pred.winner === "up" ? "🚀" : "📉"} {pred.symbol}</div>
              <div className="text-xs text-zinc-500">{pred.endTime}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
