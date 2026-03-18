export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            License Management
          </p>
          <h2 className="text-2xl font-semibold text-ink-900">
            Operational Dashboard
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="chip">Last 30 days</button>
          <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow">
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
