import crypto from "crypto";

/**
 * QStash Helper Library
 * Upstash QStash v2 API ile background job queue yönetimi
 */

/**
 * Base URL'i environment variable'lardan al
 * URL'de scheme yoksa otomatik olarak ekler (https:// production, http:// localhost)
 * Vercel'de VERCEL_URL otomatik olarak mevcuttur
 */
function getBaseUrl(): string {
  let baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.VERCEL_URL || // Vercel otomatik olarak sağlar
    "http://localhost:3000";

  // URL'de scheme yoksa ekle
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    // Production'da (Vercel) https:// kullan, localhost'ta http://
    if (baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1")) {
      baseUrl = `http://${baseUrl}`;
    } else {
      baseUrl = `https://${baseUrl}`;
    }
  }

  // URL'in sonundaki slash'ı kaldır
  baseUrl = baseUrl.replace(/\/$/, "");

  return baseUrl;
}

/**
 * QStash job queue'ya ekle
 * @param url Target API endpoint (örn: /api/interview/cv-based/generate-background)
 * @param body Request body
 * @param options Queue options (retry, delay)
 */
export async function queueJob(
  url: string,
  body: any,
  options?: {
    delay?: number; // seconds
    retries?: number;
  }
): Promise<Response> {
  const qstashUrl = process.env.QSTASH_URL || "https://qstash.upstash.io";
  const qstashToken = process.env.QSTASH_TOKEN;

  if (!qstashToken) {
    console.warn("[QSTASH] QSTASH_TOKEN not configured, falling back to direct call");
    // Fallback: direkt API call (timeout riski var, sadece development için)
    const baseUrl = getBaseUrl();
    const targetUrl = `${baseUrl}${url}`;
    
    return fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  // Target URL'i oluştur
  const baseUrl = getBaseUrl();
  const targetUrl = `${baseUrl}${url}`;

  // QStash v2 API endpoint
  const qstashEndpoint = `${qstashUrl}/v2/publish/${encodeURIComponent(targetUrl)}`;

  // Headers hazırla
  const headers: Record<string, string> = {
    Authorization: `Bearer ${qstashToken}`,
    "Content-Type": "application/json",
  };

  // Retry ayarı
  if (options?.retries !== undefined) {
    headers["Upstash-Retries"] = String(options.retries);
  }

  // Delay ayarı
  if (options?.delay !== undefined) {
    headers["Upstash-Delay"] = String(options.delay);
  }

  try {
    const response = await fetch(qstashEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[QSTASH] Failed to queue job: ${response.status} ${errorText}`);
      throw new Error(`QStash queue failed: ${response.status} ${errorText}`);
    }

    console.log(`[QSTASH] Job queued successfully for ${url}`);
    return response;
  } catch (error: any) {
    console.error("[QSTASH] Error queueing job:", error);
    throw error;
  }
}

/**
 * QStash webhook signature'ını doğrula
 * @param signature Upstash-Signature header değeri
 * @param body Request body (string olarak)
 * @param url Request URL
 * @returns true if signature is valid
 */
export function verifyQStashSignature(
  signature: string | null,
  body: string,
  url: string
): boolean {
  if (!signature) {
    console.warn("[QSTASH] No signature provided");
    return false;
  }

  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;

  if (!currentKey && !nextKey) {
    console.warn("[QSTASH] No signing keys configured, skipping verification");
    // Development için signature verification'ı skip edebiliriz
    // Production'da mutlaka key'ler olmalı
    return process.env.NODE_ENV !== "production";
  }

  // Signature format: v1={signature},v2={signature}
  const signatures = signature.split(",");
  
  for (const sigPair of signatures) {
    const [version, sig] = sigPair.split("=");
    if (!version || !sig) continue;

    // v1 veya v2 olabilir
    const signingKey = version === "v1" ? currentKey : nextKey;
    if (!signingKey) continue;

    // HMAC-SHA256 ile doğrula
    // QStash signature format: HMAC-SHA256(body + url)
    const message = body + url;
    const hmac = crypto.createHmac("sha256", signingKey);
    hmac.update(message);
    const expectedSignature = hmac.digest("hex");

    // Constant-time comparison
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSignature))) {
      console.log(`[QSTASH] Signature verified with ${version}`);
      return true;
    }
  }

  console.warn("[QSTASH] Signature verification failed");
  return false;
}

/**
 * Request'ten QStash signature'ını doğrula
 * @param request Request object
 * @returns true if signature is valid
 */
export async function verifyQStashRequest(request: Request): Promise<boolean> {
  const signature = request.headers.get("Upstash-Signature");
  const url = request.url;
  
  // Body'yi string olarak al
  const body = await request.text();
  
  return verifyQStashSignature(signature, body, url);
}

