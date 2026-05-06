import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LiveTicker from "@/components/LiveTicker";
import TokenForm from "@/components/TokenForm";
import PredictionsList from "@/components/PredictionsList";
import TokenLeaderboard from "@/components/TokenLeaderboard";
import PlayerLeaderboard from "@/components/PlayerLeaderboard";
import OnboardingTutorial from "@/components/OnboardingTutorial";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <LiveTicker />

      <section id="create" className="max-w-md mx-auto w-full px-4 py-8">
        <ErrorBoundary>
          <TokenForm />
        </ErrorBoundary>
      </section>

      <ErrorBoundary>
        <PredictionsList />
      </ErrorBoundary>

      <ErrorBoundary>
        <TokenLeaderboard />
      </ErrorBoundary>

      <ErrorBoundary>
        <PlayerLeaderboard />
      </ErrorBoundary>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">1️⃣</div>
            <h3 className="font-bold text-sm mb-1">Create Token</h3>
            <p className="text-xs text-zinc-500">Fill in name, symbol, supply. AI generates logo &amp; website.</p>
          </div>
          <div className="bg-card rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">2️⃣</div>
            <h3 className="font-bold text-sm mb-1">Prediction Market</h3>
            <p className="text-xs text-zinc-500">Your token gets an automatic 24h prediction market.</p>
          </div>
          <div className="bg-card rounded-xl p-5 text-center">
            <div className="text-2xl mb-2">3️⃣</div>
            <h3 className="font-bold text-sm mb-1">Trade &amp; Earn</h3>
            <p className="text-xs text-zinc-500">Users predict UP/DOWN. Winners split the pool.</p>
          </div>
        </div>
      </section>

      <OnboardingTutorial />
    </div>
  );
}
