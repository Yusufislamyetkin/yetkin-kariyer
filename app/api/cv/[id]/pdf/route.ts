import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { generatePdfToken } from "@/lib/cv/pdf-token";
import { createRequire } from "module";

export const runtime = "nodejs";

type PuppeteerModule = typeof import("puppeteer-core");
type ChromiumModule = typeof import("@sparticuz/chromium");

let cachedPuppeteer: PuppeteerModule | null | undefined;
let cachedChromium: ChromiumModule | null | undefined;

async function loadPuppeteer(preferCore: boolean) {
  if (cachedPuppeteer !== undefined) {
    return cachedPuppeteer;
  }

  const moduleOrder = preferCore
    ? ["puppeteer-core", "puppeteer"]
    : ["puppeteer", "puppeteer-core"];

  const errors: string[] = [];

  // Try dynamic import first
  for (const moduleName of moduleOrder) {
    try {
      console.log(`[PDF] Attempting to load ${moduleName}...`);
      const mod = await import(moduleName);
      
      // Check if the module has the expected structure
      const puppeteerInstance = (mod as any).default ?? mod;
      
      // Verify it has the launch method
      if (typeof puppeteerInstance?.launch === "function") {
        console.log(`[PDF] Successfully loaded ${moduleName}`);
        cachedPuppeteer = puppeteerInstance;
        return cachedPuppeteer;
      } else {
        errors.push(`${moduleName}: module loaded but missing 'launch' method`);
      }
    } catch (error: any) {
      const errorMsg = error?.message || String(error);
      errors.push(`${moduleName} (import): ${errorMsg}`);
      console.warn(`[PDF] Puppeteer import failed for ${moduleName}:`, errorMsg);
      
      // Check if it's a module not found error
      if (errorMsg.includes("Cannot find module") || errorMsg.includes("MODULE_NOT_FOUND")) {
        console.error(`[PDF] Module ${moduleName} is not installed. Run: npm install ${moduleName}`);
      }
    }
  }

  // Try require as fallback (for Node.js runtime)
  try {
    let requireModule: NodeRequire;
    
    if (typeof require !== "undefined") {
      requireModule = require;
    } else {
      // Use createRequire if import.meta.url is available
      try {
        // @ts-ignore - import.meta.url might not be available in all contexts
        if (typeof import.meta !== "undefined" && import.meta.url) {
          requireModule = createRequire(import.meta.url);
        } else {
          throw new Error("import.meta.url not available");
        }
      } catch {
        // If createRequire fails, skip require fallback
        throw new Error("Cannot create require function");
      }
    }
    
    for (const moduleName of moduleOrder) {
      try {
        console.log(`[PDF] Attempting to require ${moduleName}...`);
        const mod = requireModule(moduleName);
        const puppeteerInstance = mod.default ?? mod;
        
        if (typeof puppeteerInstance?.launch === "function") {
          console.log(`[PDF] Successfully loaded ${moduleName} via require`);
          cachedPuppeteer = puppeteerInstance;
          return cachedPuppeteer;
        }
      } catch (error: any) {
        const errorMsg = error?.message || String(error);
        errors.push(`${moduleName} (require): ${errorMsg}`);
        console.warn(`[PDF] Puppeteer require failed for ${moduleName}:`, errorMsg);
      }
    }
  } catch (requireError: any) {
    console.warn(`[PDF] Could not use require fallback:`, requireError?.message);
  }

  // Log all errors for debugging
  console.error("[PDF] Failed to load Puppeteer from all sources:", errors);
  cachedPuppeteer = null;
  return cachedPuppeteer;
}

async function loadChromium() {
  if (cachedChromium !== undefined) {
    return cachedChromium;
  }

  try {
    const mod = await import("@sparticuz/chromium");
    cachedChromium = (mod as any).default ?? mod;
  } catch (error) {
    cachedChromium = null;
  }

  return cachedChromium;
}

interface CVData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    profilePhoto?: string;
  };
  summary?: string;
  experience?: Array<{
    company?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    current?: boolean;
  }>;
  education?: Array<{
    school?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: string[];
  languages?: Array<{
    name?: string;
    level?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements?: Array<{
    title?: string;
    description?: string;
    date?: string;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string;
    expiryDate?: string;
  }>;
  references?: Array<{
    name?: string;
    position?: string;
    company?: string;
    email?: string;
    phone?: string;
  }>;
  hobbies?: string[];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle params as Promise (Next.js 15) or object (Next.js 14)
    const resolvedParams = await Promise.resolve(params);
    const cvId = resolvedParams.id;

    const cv = await db.cV.findUnique({
      where: { id: cvId },
      include: {
        template: true,
      },
    });

    if (!cv || cv.userId !== (session.user.id as string)) {
      return NextResponse.json({ error: "CV bulunamadı" }, { status: 404 });
    }

    // Get the base URL for the render page
    const requestUrl = new URL(request.url);
    const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;
    
    // Generate secure token for PDF generation
    const pdfToken = generatePdfToken(cv.id, session.user.id as string);
    const renderUrl = `${baseUrl}/cv/render/${cv.id}?pdf=true&token=${pdfToken}`;

    const isVercel = process.env.VERCEL === "1";
    const isLocal = process.env.NODE_ENV === "development";
    
    console.log("[PDF] Environment:", { 
      isVercel, 
      isLocal, 
      nodeEnv: process.env.NODE_ENV,
      preferCore: isVercel 
    });
    
    const puppeteer = await loadPuppeteer(isVercel);

    if (!puppeteer) {
      console.error("[PDF] Puppeteer not available");
      
      // Provide more helpful error message
      const errorMessage = isLocal
        ? "Puppeteer modülleri yüklü değil. Lütfen 'npm install puppeteer puppeteer-core' komutunu çalıştırın."
        : "Sunucu PDF oluşturma için yapılandırılmadı. Puppeteer modülleri yüklü değil.";
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 503 }
      );
    }

    const chromium = await loadChromium();

    const launchOptions: Record<string, unknown> = {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-renderer-backgrounding",
        "--disable-features=TranslateUI",
        "--disable-ipc-flooding-protection",
      ],
    };

    if (isVercel && chromium) {
      if (typeof (chromium as any).setGraphicsMode === "function") {
        (chromium as any).setGraphicsMode(false);
      }
      if (typeof chromium.executablePath === "function") {
        (launchOptions as any).executablePath = await chromium.executablePath();
      }
      (launchOptions as any).args = [
        ...(Array.isArray(chromium.args) ? chromium.args : []),
        "--hide-scrollbars",
        "--disable-web-security",
      ];
    }

    let browser;
    try {
      browser = await puppeteer.launch(launchOptions);
      console.log("[PDF] Browser launched successfully");
    } catch (error: any) {
      console.error("[PDF] Failed to launch browser:", error);
      return NextResponse.json(
        { error: `Tarayıcı başlatılamadı: ${error.message || "Bilinmeyen hata"}` },
        { status: 500 }
      );
    }

    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid bot detection
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      );

      // Set extra headers
      await page.setExtraHTTPHeaders({
        "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      });

      await page.setViewport({
        width: 794,
        height: 1123,
      });

      // Ensure screen media CSS is applied and page size from CSS is respected
      try {
        await page.emulateMediaType("screen");
      } catch (error) {
        console.warn("[PDF] Failed to emulate media type:", error);
      }

      console.log("[PDF] Navigating to render URL:", renderUrl);
      
      // Navigate to render page
      try {
        await page.goto(renderUrl, {
          waitUntil: "networkidle0",
          timeout: 45000,
        });
        console.log("[PDF] Page navigation completed");
      } catch (error: any) {
        console.error("[PDF] Navigation failed:", error);
        throw new Error(`Sayfa yüklenemedi: ${error.message || "Zaman aşımı"}`);
      }

      // Wait for CV content to be rendered
      try {
        await page.waitForSelector("#cv-content", { timeout: 15000 });
        console.log("[PDF] CV content selector found");
      } catch (error) {
        console.error("[PDF] CV content selector not found:", error);
        // Check if page loaded with error message
        const pageContent = await page.content();
        if (pageContent.includes("CV bulunamadı") || pageContent.includes("Unauthorized")) {
          throw new Error("CV erişim hatası: Kimlik doğrulama başarısız");
        }
        // Try to wait a bit more and check if page loaded
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
      
      // Additional wait for any dynamic content and fonts to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("[PDF] Generating PDF...");
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
      });

      const requestUrlObj = new URL(request.url);
      const forceDownload = requestUrlObj.searchParams.get("download") === "1";
      const contentLength = (pdfBuffer as unknown as Buffer).length;
      
      console.log("[PDF] PDF generated successfully, size:", contentLength, "bytes");

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `${forceDownload ? "attachment" : "inline"}; filename="cv-${cv.id}.pdf"`,
          "Content-Length": contentLength.toString(),
        },
      });
    } catch (error: any) {
      console.error("[PDF] Error generating PDF:", error);
      const errorMessage = error.message || "PDF oluşturulurken bir hata oluştu";
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    } finally {
      try {
        await browser.close();
        console.log("[PDF] Browser closed");
      } catch (error) {
        console.error("[PDF] Error closing browser:", error);
      }
    }
  } catch (error: any) {
    console.error("[PDF] Error in PDF route:", error);
    const errorMessage = error.message || "PDF oluşturulurken bir hata oluştu";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

