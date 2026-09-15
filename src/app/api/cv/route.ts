import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CV_FILENAME = "Alisson_Almeida_CV.pdf";

/** GET /api/cv — serve CV PDF with no-cache headers (evita PDF antigo em cache). */
export async function GET() {
  try {
    const pdfPath = path.join(process.cwd(), "public/cv", CV_FILENAME);
    const buffer = await readFile(pdfPath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${CV_FILENAME}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "cv_unavailable" }, { status: 404 });
  }
}
