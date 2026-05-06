"use client";

import { useState } from "react";

type Step = "intro" | "connect" | "create" | "predict" | "trade" | "done";

const steps: { id: Step; title: string; desc: string }[] = [
  { id: "intro", title: "Welcome to PredictPump", desc: "Create tokens and trade predictions in 1 click." },
  { id: "connect", title: "Connect Wallet", desc: "Link your MetaMask or any WalletConnect-compatible wallet." },
  { id: "create", title: "Create a Token", desc: "Pick a name, symbol, and supply. AI does the rest." },
  { id: "predict", title: "Make Predictions", desc: "Bet UP or DOWN on any token. Winners split the pool." },
  { id: "trade", title: "Trade & Profit", desc: "Track your PnL, claim rewards, watch the leaderboard." },
];

export default function OnboardingTutorial() {
  const [open, setOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-card rounded-xl border border-[#1e1e2e] shadow-2xl animate-fade-in-up">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg">
            {step.id === "intro" && "👋"}
            {step.id === "connect" && "🔗"}
            {step.id === "create" && "🚀"}
            {step.id === "predict" && "🎯"}
            {step.id === "trade" && "💰"}
          </span>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-300 text-sm"
          >
            ✕
          </button>
        </div>

        <h3 className="text-sm font-bold mb-1">{step.title}</h3>
        <p className="text-xs text-zinc-400 mb-3">{step.desc}</p>

        {/* Progress bar */}
        <div className="h-1 bg-[#0a0a0f] rounded-full mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#bf5af2] to-[#39ff14] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn-secondary flex-1 py-1.5 rounded-lg text-xs"
            >
              Back
            </button>
          )}
          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-primary flex-1 py-1.5 rounded-lg text-xs"
            >
              Next
            </button>
          ) : (
            <button
              onClick={() => setOpen(false)}
              className="btn-primary flex-1 py-1.5 rounded-lg text-xs"
            >
              Let's Go! 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
