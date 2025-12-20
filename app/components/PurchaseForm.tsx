"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loader2, Mail, User, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/app/components/ui/Card";

interface PurchaseFormProps {
  planType: "TEMEL" | "PRO" | "VIP";
  planName: string;
  planPrice: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  email: string;
  name: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  general?: string;
}

export default function PurchaseForm({
  planType,
  planName,
  planPrice,
  onClose,
  onSuccess,
}: PurchaseFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = "E-posta adresi zorunludur";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    if (!formData.name.trim()) {
      newErrors.name = "İsim zorunludur";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "İsim en az 2 karakter olmalıdır";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch("/api/subscription/guest-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name.trim(),
          planType,
          durationMonths: 12,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Satın alma işlemi başarısız oldu");
      }

      setIsSuccess(true);

      // Show success message for 3 seconds then close
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (error: any) {
      console.error("[PURCHASE_FORM] Error:", error);
      setErrors({
        general: error.message || "Satın alma işlemi sırasında bir hata oluştu",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Satın Alma Başarılı!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Hesabınız oluşturuldu ve giriş bilgileriniz e-posta adresinize gönderildi.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Bu pencere otomatik olarak kapanacak...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {planName} Planı Satın Al
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Satın Alma Bilgileri</p>
              <p className="text-sm mt-1">
                Plan: {planName} • Fiyat: {planPrice} TL/yıl
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ad Soyad *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Adınızı ve soyadınızı girin"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta Adresi *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Giriş bilgileriniz bu e-posta adresine gönderilecektir.
            </p>
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  İşleniyor...
                </>
              ) : (
                "Satın Al"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
