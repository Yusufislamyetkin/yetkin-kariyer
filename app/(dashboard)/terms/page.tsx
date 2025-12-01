"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { FileText, AlertCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              Kullanım Koşulları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Kullanım Şartları
              </h2>
              <p className="leading-relaxed mb-4">
                Yetkin Academy platformunu kullanarak, aşağıdaki koşulları kabul etmiş sayılırsınız:
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. Hesap Sorumluluğu
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hesap bilgilerinizin doğruluğundan siz sorumlusunuz</li>
                <li>Hesabınızın güvenliğinden siz sorumlusunuz</li>
                <li>Hesabınız altında yapılan tüm aktivitelerden siz sorumlusunuz</li>
                <li>Bir başkasının hesabını kullanmak yasaktır</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Kullanıcı Davranışı
              </h2>
              <p className="leading-relaxed mb-4">
                Platform kullanırken aşağıdaki davranışlar yasaktır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Yasa dışı içerik paylaşmak</li>
                <li>Başkalarını rahatsız etmek veya taciz etmek</li>
                <li>Spam veya istenmeyen içerik göndermek</li>
                <li>Platform güvenliğini tehdit eden aktiviteler</li>
                <li>Telif hakkı ihlali yapmak</li>
                <li>Otomatik bot veya script kullanmak</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. İçerik Hakları
              </h2>
              <p className="leading-relaxed mb-4">
                Platform üzerinde paylaştığınız içeriklerin hakları size aittir. Ancak, 
                platform üzerinde görüntülenmesi ve paylaşılması için gerekli lisansları bize veriyorsunuz.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Hizmet Değişiklikleri
              </h2>
              <p className="leading-relaxed">
                Yetkin Academy, platform özelliklerini, içeriğini veya hizmetlerini önceden 
                bildirimde bulunmaksızın değiştirme, askıya alma veya sonlandırma hakkını saklı tutar.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Hesap İptali
              </h2>
              <p className="leading-relaxed mb-4">
                Aşağıdaki durumlarda hesabınız askıya alınabilir veya iptal edilebilir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kullanım koşullarını ihlal etmek</li>
                <li>Uzun süre aktif olmamak</li>
                <li>Yasal gereklilikler</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                6. Sorumluluk Reddi
              </h2>
              <p className="leading-relaxed">
                Yetkin Academy, platform içeriğinin doğruluğu, güncelliği veya eksiksizliği 
                konusunda garanti vermez. Platform &quot;olduğu gibi&quot; sunulmaktadır.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Önemli:</strong> Bu koşulları kabul etmeden platformu kullanamazsınız. 
                  Koşulları kabul etmiyorsanız, lütfen platformu kullanmayın.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                İletişim
              </h2>
              <p className="leading-relaxed">
                Kullanım koşulları hakkında sorularınız için: 
                <a href="mailto:destek@yetkinacademy.com" className="text-blue-500 hover:underline ml-1">
                  destek@yetkinacademy.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

