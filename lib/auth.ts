import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { UserRole } from "@/types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// NextAuth v5 uses AUTH_SECRET or NEXTAUTH_SECRET
const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

// Warn if secret is missing, but don't throw during build
// This allows the build to complete, but NextAuth will fail at runtime if secret is missing
if (!authSecret) {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "⚠️  AUTH_SECRET or NEXTAUTH_SECRET environment variable is required in production. Please set it in your Vercel project settings."
    );
  } else {
    console.warn("⚠️  AUTH_SECRET or NEXTAUTH_SECRET not set. Using temporary secret for development only.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: authSecret || "temp-dev-secret-change-in-production-please-set-auth-secret",
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = loginSchema.parse(credentials);

          // Check database connection
          let user;
          try {
            user = await db.user.findUnique({
              where: { email },
            });
          } catch (dbError: any) {
            console.error("Database connection error:", dbError);
            throw new Error("Veritabanı bağlantı hatası. Lütfen daha sonra tekrar deneyin.");
          }

          if (!user) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
          };
        } catch (error: any) {
          console.error("Auth error:", error);
          // Return null for invalid credentials, but log other errors
          if (error.message && error.message.includes("Veritabanı")) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
});

