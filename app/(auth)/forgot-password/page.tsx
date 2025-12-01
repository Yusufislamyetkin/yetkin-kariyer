"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Mail, ArrowLeft, AlertCircle, CheckCircle, Info, Send } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!email.trim()) {
      setError("Lütfen e-posta adresinizi giriniz.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Lütfen geçerli bir e-posta adresi giriniz.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError("Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.");
        } else {
          setError(data.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } else {
        setSuccess(
          "Eğer bu e-posta adresi sistemimizde kayıtlıysa, şifre sıfırlama linki e-posta adresinize gönderilmiştir. Lütfen e-posta kutunuzu kontrol edin."
        );
        setEmailSent(true);
        setEmail("");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 particle-bg">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:bg-gradient-to-r md:from-blue-600 md:via-purple-600 md:to-pink-600 md:bg-[length:200%_auto] md:animate-text-shimmer mb-2">
            YTK Academy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium text-lg">
            Şifre Sıfırlama
          </p>
        </div>

        <Card variant="glass" className="backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Şifrenizi mi unuttunuz?
            </CardTitle>
            <CardDescription>
              {emailSent
                ? "E-posta adresinize gönderilen linki kontrol edin"
                : "E-posta adresinizi girin, size şifre sıfırlama linki gönderelim"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl backdrop-blur-sm">
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">E-posta gönderildi!</p>
                    <p className="text-sm leading-relaxed">
                      {success}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-xl">
                  <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 text-sm space-y-2">
                    <p className="font-medium">Önemli Bilgiler:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>E-postayı spam klasörünüzde kontrol edin</li>
                      <li>Link 1 saat süreyle geçerlidir</li>
                      <li>E-posta gelmediyse tekrar deneyebilirsiniz</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setEmailSent(false);
                      setSuccess("");
                      setError("");
                    }}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Yeni E-posta Gönder
                  </Button>
                  <Link href="/login" className="w-full">
                    <Button variant="gradient" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Giriş Sayfasına Dön
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {success && (
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-xl backdrop-blur-sm">
                    <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium text-sm">{success}</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-start gap-2 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl backdrop-blur-sm">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-sm flex-1">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      E-posta Adresi
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={loading}
                        autoFocus
                        autoComplete="email"
                      />
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Kayıtlı e-posta adresinizi girin, size şifre sıfırlama linki gönderelim.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full group"
                  isLoading={loading}
                  disabled={loading || !email.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? "Gönderiliyor..." : "Şifre Sıfırlama Linki Gönder"}
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
            )}
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
