import { NextResponse, NextRequest } from "next/server";
import { checkRateLimit, rateLimitKey, Limits } from "@/lib/security/rateLimit";

export function middleware(request: NextRequest) {
  const securityEnabled = process.env.NEXT_PUBLIC_SECURITY_HARDENING !== "off";
  if (!securityEnabled) {
    return NextResponse.next();
  }
  const method = request.method.toUpperCase();
  const isMutating = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";

  // Body size guard (based on header; if missing, skip)
  const contentLength = request.headers.get("content-length");
  if (isMutating && contentLength) {
    const len = parseInt(contentLength, 10);
    const MAX = 2 * 1024 * 1024; // 2MB
    if (!Number.isNaN(len) && len > MAX) {
      console.warn("[BODY_LIMIT]", { path: request.nextUrl.pathname, len });
      return new NextResponse(JSON.stringify({ error: "İstek gövdesi çok büyük." }), {
        status: 413,
        headers: { "content-type": "application/json" }
      });
    }
  }

  // Basic brute-force control for NextAuth login
  if (request.nextUrl.pathname.startsWith("/api/auth") && method === "POST") {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.ip ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";
    const key = rateLimitKey(["auth:login:ip", ip]);
    const verdict = checkRateLimit(key, Limits.loginIp);
    if (!verdict.ok) {
      console.warn("[RATE_LIMIT_AUTH]", { ip, path: request.nextUrl.pathname });
      return new NextResponse(JSON.stringify({ error: "Çok fazla deneme. Lütfen daha sonra tekrar deneyin." }), {
        status: 429,
        headers: { "content-type": "application/json", "Retry-After": Math.ceil(verdict.retryAfterMs / 1000).toString() }
      });
    }
  }

  if (!isMutating) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.nextUrl.host;

  // Allow same-origin requests only (basic CSRF/Origin protection)
  if (origin) {
    try {
      const o = new URL(origin);
      if (o.host !== host) {
        console.warn("[ORIGIN_BLOCKED]", { origin: o.host, host, path: request.nextUrl.pathname });
        return new NextResponse(JSON.stringify({ error: "Kaynak doğrulaması başarısız." }), {
          status: 403,
          headers: { "content-type": "application/json" }
        });
      }
    } catch {
      return new NextResponse(JSON.stringify({ error: "Geçersiz Origin başlığı." }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
  } else if (referer) {
    try {
      const r = new URL(referer);
      if (r.host !== host) {
        console.warn("[REFERER_BLOCKED]", { referer: r.host, host, path: request.nextUrl.pathname });
        return new NextResponse(JSON.stringify({ error: "Kaynak doğrulaması başarısız." }), {
          status: 403,
          headers: { "content-type": "application/json" }
        });
      }
    } catch {
      return new NextResponse(JSON.stringify({ error: "Geçersiz Referer başlığı." }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|).*)"],
};

