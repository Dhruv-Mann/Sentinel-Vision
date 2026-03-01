/**
 * View page loading state – shown while server fetches resume metadata.
 */
export default function ViewLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-white" />
      <p className="mt-4 text-sm text-white/40">Loading resume&hellip;</p>
    </main>
  );
}
