# PredictPump

Create & Predict in 1 Click — AI-powered token creation + built-in prediction markets.

## Tech Stack
- Next.js 16 + Tailwind CSS v4
- RainbowKit + Wagmi + Viem
- Solidity (BSC chain)
- Hardhat for deployment

## Getting Started

```bash
npm install
npm run dev
```

## Deploy Contracts

```bash
cd contracts
npm install
npx hardhat run scripts/deploy.ts --network bscTestnet
```

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_FACTORY_ADDRESS=<deployed factory address>
NEXT_PUBLIC_BSC_TESTNET_RPC=<rpc url>
```
