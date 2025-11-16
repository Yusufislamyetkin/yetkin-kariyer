import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

type PuppeteerModule = typeof import("puppeteer");
type ChromiumModule = typeof import("@sparticuz/chromium");

let cachedPuppeteer: PuppeteerModule | null | undefined;
let cachedChromium: ChromiumModule | null | undefined;

async function loadPuppeteer() {
  if (cachedPuppeteer !== undefined) {
    return cachedPuppeteer;
  }

  try {
    const mod = await import("puppeteer");
    cachedPuppeteer = (mod as any).default ?? mod;
  } catch (error) {
    console.warn("Puppeteer import failed:", error);
    cachedPuppeteer = null;
  }

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
    const renderUrl = `${baseUrl}/cv/render/${cv.id}`;

    const puppeteer = await loadPuppeteer();

    if (!puppeteer) {
      return NextResponse.json(
        { error: "Sunucu PDF oluşturma için yapılandırılmadı" },
        { status: 503 }
      );
    }

    const cookies = request.headers.get("cookie") || "";

    const isVercel = process.env.VERCEL === "1";
    const chromium = await loadChromium();

    const launchOptions: Record<string, unknown> = {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    const browser = await puppeteer.launch(launchOptions);

    try {
      const page = await browser.newPage();

      if (cookies) {
        const cookieArray = cookies.split(";").map((cookie) => {
          const trimmed = cookie.trim();
          const equalIndex = trimmed.indexOf("=");
          if (equalIndex === -1) return null;
          
          const name = trimmed.substring(0, equalIndex);
          const value = trimmed.substring(equalIndex + 1);
          
          return {
            name: name.trim(),
            value: value.trim(),
            domain: requestUrl.hostname,
            path: "/",
          };
        }).filter((cookie): cookie is { name: string; value: string; domain: string; path: string } => cookie !== null);

        if (cookieArray.length > 0) {
          await page.setCookie(...cookieArray);
        }
      }

      await page.setViewport({
        width: 794,
        height: 1123,
      });

      await page.goto(renderUrl, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      // Wait for CV content to be rendered
      try {
        await page.waitForSelector("#cv-content", { timeout: 10000 });
      } catch (error) {
        console.error("CV content selector not found:", error);
        // Try to wait a bit more and check if page loaded
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      
      // Additional wait for any dynamic content
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
      });

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="cv-${cv.id}.pdf"`,
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      return NextResponse.json(
        { error: "PDF oluşturulurken bir hata oluştu" },
        { status: 500 }
      );
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "PDF oluşturulurken bir hata oluştu" },
      { status: 500 }
    );
  }
}

