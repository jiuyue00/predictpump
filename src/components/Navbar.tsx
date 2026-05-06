"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="border-b border-[#1e1e2e] bg-[#0a0a0f]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">
            <span className="neon-text-purple">Predict</span>
            <span className="neon-text-green">Pump</span>
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <a href="#create" className="text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block">
            Create
          </a>
          <a href="#predictions" className="text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:block">
            Predictions
          </a>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
