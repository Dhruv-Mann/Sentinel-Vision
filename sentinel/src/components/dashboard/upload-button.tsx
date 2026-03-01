"use client";

import { useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UploadButtonProps {
  /** Called after a successful upload + DB insert so the parent can refresh. */
  onUploadComplete: () => void;
}

export default function UploadButton({ onUploadComplete }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // 1. Get the authenticated user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("You must be logged in to upload.");
        return;
      }

      // 2. Build a unique storage path
      const ext = file.name.split(".").pop() ?? "pdf";
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

      // 3. Upload to the "resumes" storage bucket
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert("Upload failed. Please try again.");
        return;
      }

      // 4. Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("resumes").getPublicUrl(filePath);

      // 5. Insert a row into the resumes table
      const title = file.name.replace(/\.[^/.]+$/, "") || "Untitled Resume";

      // Auto-generate slug from title
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
        alert("Failed to save resume metadata.");
        return;
      }

      // 6. Notify the parent dashboard to refresh
      onUploadComplete();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Something went wrong.");
    } finally {
      setUploading(false);
      // Reset the input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
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
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-medium text-green-400 transition hover:bg-green-500/20 hover:border-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-400/30 border-t-green-400" />
            Uploading&hellip;
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Upload Resume
          </>
        )}
      </button>
    </>
  );
}
