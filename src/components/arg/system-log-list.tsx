type SystemLogListProps = {
  logs: readonly string[];
};

export function SystemLogList({ logs }: SystemLogListProps) {
  return (
    <div className="crt-panel p-4 sm:p-5">
      <p className="border-b border-white/10 pb-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-zinc-500">
        system logs
      </p>
      <ol className="mt-4 space-y-2 font-mono text-xs leading-5 text-zinc-300">
        {logs.map((log) => (
          <li key={log}>{log}</li>
        ))}
      </ol>
    </div>
  );
}
