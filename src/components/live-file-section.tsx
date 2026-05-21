const liveFileRows = [
  ["ACTION REPLAY 001", "TEE + POSTER DROP"],
  ["LIVE FILE A", "AR001-GALAXY TEE"],
  ["LIVE FILE B", "2026 PROMO POSTER"],
  ["STATUS", "UNLOCKED"],
  ["CATALOG", "FULLY VISIBLE"],
];

export function LiveFileSection() {
  return (
    <section className="border-y border-white/10 bg-[#030304] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-3xl border border-white/10 bg-black p-4 shadow-[0_0_55px_rgba(139,92,246,0.14)] sm:p-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-violet-200">
            Recovered system file
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 font-mono text-xs uppercase tracking-[0.14em]">
            {liveFileRows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] bg-black"
              >
                <div className="min-w-0 border-r border-white/10 px-3 py-4 text-zinc-500">
                  {label}
                </div>
                <div className="min-w-0 px-3 py-4 text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
