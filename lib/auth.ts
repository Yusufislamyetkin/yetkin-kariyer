import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = loginSchema.parse(credentials);

          // Lazy-load db to avoid importing Prisma in Edge middleware build
          const { db } = await import("@/lib/db");
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

          // Check if user has a password (OAuth users might not have one)
          if (!user.password) {
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Validate required data
          if (!user.email) {
            console.error("Google OAuth: User email is missing");
            return false;
          }

          if (!account.providerAccountId) {
            console.error("Google OAuth: Provider account ID is missing");
            return false;
          }

          const { db } = await import("@/lib/db");
          
          // Check if user exists
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            // User exists, check if account exists
            try {
              const existingAccount = await db.account.findUnique({
                where: {
                  provider_providerAccountId: {
                    provider: "google",
                    providerAccountId: account.providerAccountId,
                  },
                },
              });

              if (!existingAccount) {
                // Link account to existing user
                await db.account.create({
                  data: {
                    userId: existingUser.id,
                    type: account.type || "oauth",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  },
                });
              }
            } catch (accountError: any) {
              // If Account model doesn't exist, try to create user without account linking
              console.warn("Account model error (might need migration):", accountError);
              // Continue anyway - user can still sign in
            }
          } else {
            // Create new user
            let newUser;
            try {
              newUser = await db.user.create({
                data: {
                  email: user.email,
                  name: user.name || (profile as any)?.name || null,
                  emailVerified: new Date(),
                  profileImage: user.image || (profile as any)?.picture || null,
                  role: "candidate" as UserRole,
                  password: null, // Explicitly set to null for OAuth users
                },
              });
              console.log("Google OAuth: Yeni kullanıcı oluşturuldu:", {
                userId: newUser.id,
                email: newUser.email,
              });
            } catch (createError: any) {
              console.error("Google OAuth: Kullanıcı oluşturma hatası:", {
                error: createError?.message,
                code: createError?.code,
                email: user.email,
              });
              // If user creation fails, try to find user again (might have been created by another request)
              const retryUser = await db.user.findUnique({
                where: { email: user.email },
              });
              if (retryUser) {
                newUser = retryUser;
                console.log("Google OAuth: Kullanıcı retry ile bulundu:", {
                  userId: retryUser.id,
                  email: retryUser.email,
                });
              } else {
                throw new Error(`Kullanıcı oluşturulamadı: ${createError?.message || "Bilinmeyen hata"}`);
              }
            }

            // Create account if Account model exists
            if (newUser) {
              try {
                await db.account.create({
                  data: {
                    userId: newUser.id,
                    type: account.type || "oauth",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    refresh_token: account.refresh_token,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                    session_state: account.session_state,
                  },
                });
              } catch (accountError: any) {
                // If Account model doesn't exist, log warning but continue
                console.warn("Account model error (might need migration):", accountError);
                // User is created, they can still sign in
              }
            }
          }

          return true;
        } catch (error: any) {
          console.error("Error in signIn callback:", error);
          console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            email: user.email,
            provider: account?.provider,
          });
          // Return false to deny access, but log the error for debugging
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
      } else if (account?.provider === "google" && token.email) {
        // For Google OAuth, always fetch user from database by email
        // This ensures we have the correct userId even if signIn callback had issues
        try {
          const { db } = await import("@/lib/db");
          const dbUser = await db.user.findUnique({
            where: { email: token.email as string },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          } else {
            // User not found - this shouldn't happen if signIn callback worked
            console.error("Google OAuth: User not found in database:", {
              email: token.email,
              provider: account.provider,
            });
          }
        } catch (error) {
          console.error("Error fetching user in jwt callback:", error);
        }
      } else if (token.email && !token.id) {
        // Fallback: if we have email but no id, try to find user by email
        // This handles edge cases where user object wasn't passed correctly
        try {
          const { db } = await import("@/lib/db");
          const dbUser = await db.user.findUnique({
            where: { email: token.email as string },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user by email in jwt callback:", error);
        }
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

