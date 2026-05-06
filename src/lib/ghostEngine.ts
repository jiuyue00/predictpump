"use client";

import { useAccount } from "wagmi";

const GHOST_WALLETS = Array.from({ length: 500 }, (_, i) => ({
  address: `0x${Array.from({ length: 40 }, () => 
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("")}`,
  balance: parseFloat((Math.random() * 50 + 0.1).toFixed(4)),
  createdAt: Date.now() - Math.random() * 86400000 * 30,
  totalBets: Math.floor(Math.random() * 50),
  winRate: Math.random() * 0.8 + 0.2,
}));

const TOKEN_NAMES = ["Pepe 2.0", "Moon Cat", "Doge 2.0", "AI Agent", "Elon Musk", "Turbo", "Grok", "CatWif", "Bonk2", "Shiba 2.0"];
const TOKEN_SYMBOLS = ["PEPE2", "MOON", "DOGE2", "AGENT", "ELON", "TURBO", "GROK", "CATWIF", "BONK2", "SHIBA2"];

interface GhostPlayer {
  address: string;
  balance: number;
  createdAt: number;
  totalBets: number;
  winRate: number;
}

export interface GhostAction {
  type: "create" | "predict_up" | "predict_down" | "buy" | "sell" | "claim";
  player: GhostPlayer;
  token: string;
  symbol: string;
  amount: number;
  timestamp: number;
}

let ghostActions: GhostAction[] = [];
let ghostListeners: Array<(actions: GhostAction[]) => void> = [];

function generateGhostAction(): GhostAction {
  const player = GHOST_WALLETS[Math.floor(Math.random() * GHOST_WALLETS.length)];
  const tokenIdx = Math.floor(Math.random() * TOKEN_NAMES.length);
  const types: GhostAction["type"][] = ["create", "predict_up", "predict_down", "buy", "sell", "claim"];
  const type = types[Math.floor(Math.random() * types.length)];
  const amount = parseFloat((Math.random() * 5 + 0.01).toFixed(2));

  return {
    type,
    player,
    token: TOKEN_NAMES[tokenIdx],
    symbol: TOKEN_SYMBOLS[tokenIdx],
    amount,
    timestamp: Date.now(),
  };
}

// Generate initial batch
for (let i = 0; i < 100; i++) {
  ghostActions.push(generateGhostAction());
}

// Keep generating
setInterval(() => {
  const action = generateGhostAction();
  ghostActions = [action, ...ghostActions.slice(0, 500)];
  ghostListeners.forEach((fn) => fn(ghostActions));
}, 2000 + Math.random() * 3000);

export function getGhostActions() {
  return ghostActions;
}

export function getGhostStats() {
  const recent = ghostActions.filter((a) => a.timestamp > Date.now() - 86400000);
  const uniquePlayers = new Set(recent.map((a) => a.player.address));
  const totalVolume = recent.reduce((sum, a) => sum + a.amount, 0);
  const uniqueTokens = new Set(recent.map((a) => a.symbol));

  return {
    playersToday: Math.max(uniquePlayers.size + Math.floor(Math.random() * 20), 238),
    totalVolume: Math.max(parseFloat(totalVolume.toFixed(1)) + 12, 12.4),
    tokensCreated: Math.max(uniqueTokens.size + Math.floor(Math.random() * 5), 47),
  };
}

export function subscribeGhostActions(fn: (actions: GhostAction[]) => void) {
  ghostListeners.push(fn);
  fn(ghostActions);
  return () => {
    ghostListeners = ghostListeners.filter((l) => l !== fn);
  };
}

export function generateGhostPredictions() {
  return TOKEN_NAMES.map((name, i) => {
    const upPool = parseFloat((Math.random() * 10 + 0.1).toFixed(1));
    const downPool = parseFloat((Math.random() * 10 + 0.1).toFixed(1));
    const resolved = i > 6;
    return {
      id: i,
      token: name,
      symbol: TOKEN_SYMBOLS[i],
      question: `Will $${TOKEN_SYMBOLS[i]} go up or down in 24h?`,
      upPool,
      downPool,
      endTime: resolved
        ? `Resolved: ${Math.random() > 0.5 ? "UP 🚀" : "DOWN 📉"}`
        : `${Math.floor(Math.random() * 23 + 1)}h ${Math.floor(Math.random() * 60)}m`,
      status: resolved ? ("resolved" as const) : ("active" as const),
      winner: resolved ? (Math.random() > 0.5 ? ("up" as const) : ("down" as const)) : undefined,
    };
  });
}
