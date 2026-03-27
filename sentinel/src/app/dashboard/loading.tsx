/**
 * Dashboard loading skeleton – shown during route transitions.
 */
export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 py-12">
      <div className="page-frame">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-zinc-800/70" />
            <div className="mt-3 h-8 w-48 animate-pulse rounded bg-zinc-800" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-xl bg-zinc-800" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60"
            />
          ))}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
