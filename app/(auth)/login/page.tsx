import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  // Check if user is already logged in
  const session = await auth();

  // If user has an active session, redirect to dashboard
  if (session) {
    redirect("/dashboard");
  }

  // If no session, show login form
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
