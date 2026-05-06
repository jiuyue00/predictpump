export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] mt-auto py-6">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">
            <span className="neon-text-purple">Predict</span>
            <span className="neon-text-green">Pump</span>
          </span>
          <span className="text-xs text-zinc-600">© 2026</span>
        </div>
        <div className="flex gap-4 text-xs text-zinc-500">
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Docs</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
