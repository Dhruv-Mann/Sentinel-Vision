"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTracking } from "@/hooks/use-tracking";

// Configure the PDF.js worker via CDN to avoid Next.js build issues
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  fileUrl: string;
  resumeId: string;
}

export default function PdfViewer({ fileUrl, resumeId }: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Silent analytics – fires once, heartbeats every 5 s
  useTracking(resumeId);

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
        onLoadSuccess={() => setIsLoading(false)}
        onLoadError={(err) => {
          console.error("PDF load error:", err);
          setIsLoading(false);
        }}
        loading={null} // we handle loading ourselves above
        className="w-full max-w-[800px]"
      >
        {!isLoading && (
          <Page
            pageNumber={1}
            width={800}
            className="mx-auto shadow-2xl rounded-lg overflow-hidden"
          />
        )}
      </Document>
    </div>
  );
}
