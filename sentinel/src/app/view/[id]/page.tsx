import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";
import PdfViewer from "@/components/pdf-viewer";

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Public resume viewer page (Server Component).
 *
 * Route: /view/:id
 * - Fetches resume metadata from Supabase on the server.
 * - Returns 404 if the resume doesn't exist.
 * - Renders the PDF viewer + silent tracking client component.
 */
export default async function ViewPage({ params }: ViewPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: resume, error } = await supabase
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
    </main>
  );
}
