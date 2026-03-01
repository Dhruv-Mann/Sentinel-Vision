"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTracking } from "@/hooks/use-tracking";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Configure the PDF.js worker via CDN to avoid Next.js build issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  resumeId: string;
}

export default function PdfViewer({ fileUrl, resumeId }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  // Silent analytics – fires once, heartbeats every 5 s
  useTracking(resumeId);

  const onLoadSuccess = useCallback(
    ({ numPages: total }: { numPages: number }) => {
      setNumPages(total);
      setIsLoading(false);
    },
    [],
  );

  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

  return (
    <div className="flex flex-col items-center w-full">
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <span className="ml-3 text-white/70 text-sm">
            Loading resume&hellip;
          </span>
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={onLoadSuccess}
        onLoadError={(err) => {
          console.error("PDF load error:", err);
          setIsLoading(false);
        }}
        loading={null} // we handle loading ourselves above
        className="w-full max-w-[800px]"
      >
        {!isLoading && (
          <Page
            pageNumber={pageNumber}
            width={800}
            className="mx-auto shadow-2xl rounded-lg overflow-hidden"
          />
        )}
      </Document>

      {/* Page navigation */}
      {!isLoading && numPages > 1 && (
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm font-medium text-zinc-400">
            <span className="text-zinc-100">{pageNumber}</span>
            {" / "}
            {numPages}
          </span>

          <button
            type="button"
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
