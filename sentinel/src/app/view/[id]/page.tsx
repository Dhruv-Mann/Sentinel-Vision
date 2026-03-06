import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-admin";
import PdfViewer from "@/components/pdf-viewer";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Public resume viewer page (Server Component).
 *
 * Route: /view/:id
 * - Accepts both a UUID or a custom slug.
 * - Uses the admin (service-role) client so unauthenticated recruiters
 *   can fetch resume metadata (RLS restricts anon reads).
 * - Returns 404 if the resume doesn't exist.
 */
export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;

  // Check if id is a UUID (simple regex check)
  const isUUID =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  let resume: { id: string; file_url: string; title: string; expires_at: string | null } | null = null;

  if (isUUID) {
    const { data } = await supabaseAdmin
      .from("resumes")
      .select("id, file_url, title, expires_at")
      .eq("id", id)
      .single();
    resume = data;
  }

  // Fallback: try slug lookup
  if (!resume) {
    const { data } = await supabaseAdmin
      .from("resumes")
      .select("id, file_url, title, expires_at")
      .eq("slug", id)
      .single();
    resume = data;
  }

  if (!resume) {
    notFound();
  }

  // Check link expiry
  if (resume.expires_at && new Date(resume.expires_at) <= new Date()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-100">
          Link Expired
        </h1>
        <p className="mt-3 text-lg text-zinc-500">
          This resume link is no longer active. Please contact the owner for a new link.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-zinc-100"
        >
          Go Home
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start px-4 py-10">
      <h1 className="mb-6 text-lg font-medium text-white/80 tracking-tight">
        {resume.title}
      </h1>

      <PdfViewer fileUrl={resume.file_url} resumeId={resume.id} />

      <p className="mt-10 text-xs text-white/20">
        Tracked by{" "}
        <a href="/" className="underline hover:text-white/40">
          Sentinel
        </a>
      </p>
    </main>
  );
}
