"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { LogIn, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import Navbar from "@/app/components/Navbar";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Kayıt başarılı! Giriş yapabilirsiniz.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "Configuration") {
          setError("Sunucu yapılandırma hatası. AUTH_SECRET veya NEXTAUTH_SECRET environment variable'ı eksik olabilir. Lütfen .env dosyanızı kontrol edin veya yöneticiye başvurun.");
        } else if (result.error === "CredentialsSignin") {
          setError("Email veya şifre hatalı");
        } else {
          setError(`Giriş yapılamadı: ${result.error}. Lütfen tekrar deneyin.`);
        }
      } else if (result?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Giriş yapılamadı. Lütfen tekrar deneyin.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.message && error.message.includes("Veritabanı")) {
        setError(error.message);
      } else {
        setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full max-w-full overflow-x-hidden">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 particle-bg min-h-[calc(100vh-4rem)]">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-purple-600 md:to-pink-600 md:bg-[length:200%_auto] md:animate-text-shimmer mb-2">
            YTK Academy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Kariyerinize hoş geldiniz
          </p>
        </div>

        <Card variant="glass" className="backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400 md:group-hover:scale-110 transition-transform" />
              Hesabınıza giriş yapın
            </CardTitle>
            <CardDescription>
              Veya{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                yeni hesap oluşturun
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {success && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                  <Input
                    type="email"
                    placeholder="Email adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                  <Input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                  >
                    Şifrenizi mi unuttunuz?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full group"
                isLoading={loading}
                disabled={loading}
              >
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Giriş yapılıyor..." : "Giriş yap"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
            >
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

