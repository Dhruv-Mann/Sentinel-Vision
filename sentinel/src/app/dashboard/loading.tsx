/**
 * Dashboard loading skeleton – shown during route transitions.
 */
export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-800" />
          <div className="h-10 w-36 animate-pulse rounded-lg bg-zinc-800" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
