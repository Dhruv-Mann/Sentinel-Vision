"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  /** Called after a successful upload + DB insert so the parent can refresh. */
  onUploadComplete: () => void;
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to upload.");
        return;
      }

      const ext = file.name.split(".").pop() ?? "pdf";
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setError("Upload failed. Please try again.");
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);

      const title = file.name.replace(/\.[^/.]+$/, "") || "Untitled Resume";
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const slug = `${baseSlug}-${Date.now().toString(36)}`;

      const { error: insertError } = await supabase.from("resumes").insert({
        user_id: user.id,
        file_url: publicUrl,
        title,
        slug,
      });

      if (insertError) {
        console.error("DB insert error:", insertError);
        setError("Failed to save resume. Please try again.");
        return;
      }

      onUploadComplete();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => { setError(null); inputRef.current?.click(); }}
        className="inline-flex items-center gap-2 border-2 border-[var(--color-border-main)] px-4 py-2.5 text-sm font-extrabold shadow-[4px_4px_0_var(--color-border-main)] transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0"
        style={{
          background: uploading ? "var(--color-bg-hover)" : "var(--color-accent)",
          color: uploading ? "var(--color-text-primary)" : "#ffffff",
        }}
      >
        {uploading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2"
              style={{
                borderColor: "color-mix(in oklab, var(--color-border-main) 30%, transparent)",
                borderTopColor: "var(--color-border-main)",
              }}
            />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Resume
          </>
        )}
      </button>

      {error && (
        <p
          className="text-xs"
          style={{ color: "#f87171" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
