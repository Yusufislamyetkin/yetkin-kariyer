"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Lock, ArrowLeft, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Geçersiz token. Lütfen e-postanızdaki linki kullanın.");
        setVerifying(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setError(data.message || "Geçersiz veya süresi dolmuş token. Lütfen yeni bir şifre sıfırlama isteği gönderin.");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setError("Token doğrulanamadı. Lütfen tekrar deneyin.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      } else {
        setSuccess(data.message || "Şifreniz başarıyla sıfırlandı.");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-600 dark:text-gray-400">Token doğrulanıyor...</div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 particle-bg">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <Card variant="glass" className="backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-red-600 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
                Geçersiz Token
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <div className="flex flex-col gap-2">
                  <Link href="/forgot-password">
                    <Button variant="gradient" className="w-full">
                      Yeni Şifre Sıfırlama İsteği Gönder
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Giriş Sayfasına Dön
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 particle-bg">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-purple-600 md:to-pink-600 md:bg-[length:200%_auto] md:animate-text-shimmer mb-2">
            YTK Academy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Yeni Şifre Belirle
          </p>
        </div>

        <Card variant="glass" className="backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Şifrenizi Sıfırlayın
            </CardTitle>
            <CardDescription>
              Yeni şifrenizi belirleyin. En az 6 karakter olmalıdır.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {success && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{success}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Yeni şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Yeni şifre (tekrar)"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full group"
                isLoading={loading}
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Giriş sayfasına dön
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-gray-600 dark:text-gray-400">Yükleniyor...</div>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
