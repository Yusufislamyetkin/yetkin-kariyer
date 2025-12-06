import { db } from "@/lib/db";
import { Session } from "next-auth";

/**
 * Gets userId from session, with fallback to email lookup for Google OAuth users
 * This ensures compatibility with both credentials and OAuth login methods
 */
export async function getUserIdFromSession(session: Session | null): Promise<string | null> {
  if (!session?.user) {
    return null;
  }

  // Try to get userId from session (works for credentials login and OAuth if JWT callback worked)
  let userId: string | null = (session.user as any)?.id as string | null;

  // If userId is missing but email exists, try to find user by email (for Google OAuth fallback)
  if (!userId && session.user.email) {
    try {
      const dbUser = await db.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      if (dbUser) {
        userId = dbUser.id;
      }
    } catch (error) {
      console.error("Error fetching user by email:", error);
    }
  }

  return userId;
}

/**
 * Gets user name with fallback for display purposes
 */
export function getUserName(user: { name?: string | null; email?: string | null } | null | undefined): string {
  if (!user) return "Kullanıcı";
  return user.name || user.email?.split("@")[0] || "Kullanıcı";
}

