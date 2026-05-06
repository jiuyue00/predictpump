"use client";

export function PredictionCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-4 animate-pulse">
      <div className="flex justify-between mb-2">
        <div className="h-4 w-16 bg-[#1e1e2e] rounded" />
        <div className="h-3 w-20 bg-[#1e1e2e] rounded" />
      </div>
      <div className="h-3 w-3/4 bg-[#1e1e2e] rounded mb-3" />
      <div className="space-y-2 mb-2">
        <div className="h-3 w-full bg-[#1e1e2e] rounded" />
        <div className="h-3 w-full bg-[#1e1e2e] rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 flex-1 bg-[#1e1e2e] rounded-lg" />
        <div className="h-8 flex-1 bg-[#1e1e2e] rounded-lg" />
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="bg-card rounded-xl overflow-hidden animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-[#1e1e2e]/50">
          <div className="col-span-2 flex gap-2">
            <div className="h-4 w-5 bg-[#1e1e2e] rounded" />
            <div className="h-4 w-16 bg-[#1e1e2e] rounded" />
          </div>
          <div className="h-4 bg-[#1e1e2e] rounded" />
          <div className="h-4 bg-[#1e1e2e] rounded" />
          <div className="h-4 bg-[#1e1e2e] rounded" />
          <div className="h-4 bg-[#1e1e2e] rounded" />
        </div>
      ))}
    </div>
  );
}
