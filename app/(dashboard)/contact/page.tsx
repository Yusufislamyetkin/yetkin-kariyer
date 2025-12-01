"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Mail, Phone, MessageCircle, Clock, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageCircle className="w-8 h-8" />
              İletişim
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <p className="leading-relaxed mb-6">
                Yetkin Academy ile iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz. 
                Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçmekten çekinmeyin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    E-posta
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Genel İletişim</p>
                    <a 
                      href="mailto:info@yetkinacademy.com" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      info@yetkinacademy.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Destek</p>
                    <a 
                      href="mailto:destek@yetkinacademy.com" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      destek@yetkinacademy.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">İş Birliği</p>
                    <a 
                      href="mailto:isbirligi@yetkinacademy.com" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      isbirligi@yetkinacademy.com
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Telefon
                  </h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">İstanbul Ofisi</p>
                    <a 
                      href="tel:+902121234567" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      +90 (212) 123 45 67
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ankara Ofisi</p>
                    <a 
                      href="tel:+903122345678" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      +90 (312) 234 56 78
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">İzmir Ofisi</p>
                    <a 
                      href="tel:+902323456789" 
                      className="text-blue-500 hover:underline font-medium"
                    >
                      +90 (232) 345 67 89
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Çalışma Saatleri
              </h2>
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Hafta İçi: 09:00 - 18:00
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Cumartesi: 10:00 - 16:00
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pazar: Kapalı
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-3">
                      E-posta desteği 7/24 aktif, en geç 24 saat içinde yanıt veriyoruz.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Ofis Konumları
              </h2>
              <p className="leading-relaxed mb-4">
                Bizi ziyaret etmek isterseniz, ofis konumlarımızı görmek için{" "}
                <a href="/locations" className="text-blue-500 hover:underline">
                  Konumlar
                </a>{" "}
                sayfasını ziyaret edebilirsiniz.
              </p>
            </div>

            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Hızlı Yanıt İçin
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Teknik sorunlar, hesap problemleri veya acil durumlar için destek e-posta adresimizi kullanın. 
                Genellikle 2-4 saat içinde yanıt veriyoruz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

