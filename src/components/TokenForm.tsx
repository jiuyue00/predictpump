"use client";

import { useState } from "react";

interface TokenFormProps {
  onTokenCreated?: (token: { name: string; symbol: string; supply: string }) => void;
}

export default function TokenForm({ onTokenCreated }: TokenFormProps) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000000");
  const [step, setStep] = useState<"form" | "preview" | "deploying" | "done">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol) return;
    setStep("preview");
  };

  const handleDeploy = async () => {
    setStep("deploying");
    // Simulate deployment delay
    await new Promise((r) => setTimeout(r, 3000));
    setStep("done");
    onTokenCreated?.({ name, symbol, supply });
  };

  const handleReset = () => {
    setName("");
    setSymbol("");
    setSupply("1000000000");
    setStep("form");
  };

  const generateSymbol = () => {
    if (!name) return;
    const sym = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .substring(0, 6)
      .toUpperCase();
    setSymbol(sym);
  };

  if (step === "done") {
    return (
      <div className="bg-card rounded-xl p-6 animate-fade-in text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-bold text-[#39ff14] mb-2">Token Created!</h3>
        <p className="text-zinc-400 mb-4">
          ${symbol || "TOKEN"} is now live on BSC
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={handleReset} className="btn-primary px-6 py-2 rounded-lg text-sm">
            Create Another
          </button>
          <button className="btn-secondary px-6 py-2 rounded-lg text-sm">
            View on BSCScan ↗
          </button>
        </div>
      </div>
    );
  }

  if (step === "deploying") {
    return (
      <div className="bg-card rounded-xl p-6 animate-fade-in">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#bf5af2] border-t-transparent rounded-full animate-spin mb-3" />
          <h3 className="text-lg font-bold text-[#bf5af2] mb-2">Deploying Token...</h3>
          <p className="text-zinc-500 text-sm">Sign the transaction in your wallet</p>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-zinc-400">
              <span>Step 1/3: Creating contract</span>
              <span className="text-[#39ff14]">✓</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-400 animate-pulse">
              <span>Step 2/3: Deploying to BSC</span>
              <span className="text-yellow-400">◌</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Step 3/3: Adding liquidity</span>
              <span className="text-zinc-600">○</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="bg-card rounded-xl p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-[#bf5af2] mb-4">Confirm Token Details</h3>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Name</span>
            <span className="font-bold">{name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Symbol</span>
            <span className="font-bold text-[#39ff14]">${symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Total Supply</span>
            <span className="font-bold">{supply.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Chain</span>
            <span className="font-bold">BSC (BNB)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Gas Cost</span>
            <span className="font-bold text-yellow-400">~0.005 BNB ($1.50)</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep("form")} className="btn-secondary flex-1 py-2 rounded-lg text-sm">
            Edit
          </button>
          <button onClick={handleDeploy} className="btn-primary flex-1 py-2 rounded-lg text-sm">
            Deploy Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">
        Create Your <span className="neon-text-purple">Token</span>
      </h3>
      <p className="text-sm text-zinc-500 mb-6">
        AI auto-packaging included — logo, website, and prediction market
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Token Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pepe 2.0"
            className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
            maxLength={32}
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Symbol</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g. PEPE2"
              className="input-dark flex-1 rounded-lg px-4 py-2.5 text-sm uppercase"
              maxLength={10}
            />
            <button type="button" onClick={generateSymbol} className="btn-secondary px-3 rounded-lg text-xs">
              Auto
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Total Supply</label>
          <input
            type="text"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            placeholder="1000000000"
            className="input-dark w-full rounded-lg px-4 py-2.5 text-sm"
          />
        </div>

        <div className="pt-2">
          <p className="text-xs text-zinc-600 mb-3">
            By creating, you agree to our Terms of Service.
          </p>
          <button
            type="submit"
            disabled={!name || !symbol}
            className="btn-primary w-full py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Token 🚀
          </button>
        </div>
      </div>
    </form>
  );
}
