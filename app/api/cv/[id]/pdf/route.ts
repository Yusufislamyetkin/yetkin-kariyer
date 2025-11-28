/**
 * DEPRECATED: This route uses Puppeteer which has issues on Vercel.
 * PDF generation is now handled client-side using jsPDF + html2canvas.
 * This route is kept for backward compatibility but should not be used.
 * 
 * See: lib/cv/pdf-generator.ts for the new client-side implementation
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  // Return error directing users to use client-side PDF generation
  return NextResponse.json(
    { 
      error: "Bu PDF oluşturma yöntemi artık kullanılmıyor. Lütfen tarayıcıda PDF indirme butonunu kullanın.",
      deprecated: true,
      message: "PDF generation is now handled client-side. Please use the download button in the browser."
    },
    { status: 410 } // 410 Gone - indicates the resource is no longer available
  );
}
