import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "temp-dev-secret";

/**
 * Generates a secure token for PDF generation
 * Token includes: cvId, userId, timestamp, and signature
 */
export function generatePdfToken(cvId: string, userId: string): string {
  const timestamp = Date.now();
  const payload = `${cvId}:${userId}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payload)
    .digest("hex");
  
  // Return base64 encoded token
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");
  return token;
}

/**
 * Verifies a PDF token and returns the parsed data
 * Returns null if token is invalid or expired
 */
export function verifyPdfToken(
  token: string,
  cvId: string,
  userId: string,
  maxAgeMs: number = 5 * 60 * 1000 // 5 minutes default
): { valid: boolean; expired?: boolean } {
  try {
    // Decode token
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    
    if (parts.length !== 4) {
      return { valid: false };
    }
    
    const [tokenCvId, tokenUserId, timestampStr, signature] = parts;
    
    // Verify CV ID and User ID match
    if (tokenCvId !== cvId || tokenUserId !== userId) {
      return { valid: false };
    }
    
    // Verify timestamp (not expired)
    const timestamp = parseInt(timestampStr, 10);
    if (isNaN(timestamp)) {
      return { valid: false };
    }
    
    const age = Date.now() - timestamp;
    if (age > maxAgeMs) {
      return { valid: false, expired: true };
    }
    
    // Verify signature
    const payload = `${tokenCvId}:${tokenUserId}:${timestampStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(payload)
      .digest("hex");
    
    // Use timing-safe comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return { valid: false };
    }
    
    return { valid: true };
  } catch (error) {
    console.error("Error verifying PDF token:", error);
    return { valid: false };
  }
}

