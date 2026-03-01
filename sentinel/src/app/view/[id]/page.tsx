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
 * - Uses the admin (service-role) client so unauthenticated recruiters
 *   can fetch resume metadata (RLS restricts anon reads).
 * - Returns 404 if the resume doesn't exist.
 * - Renders the PDF viewer + silent tracking client component.
 */
export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;

  const { data: resume, error } = await supabaseAdmin
    .from("resumes")
    .select("id, file_url, title")
    .eq("id", id)
    .single();

  if (error || !resume) {
    notFound();
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
