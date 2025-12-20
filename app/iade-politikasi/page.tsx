"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { FileText, AlertCircle, Shield } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-8 h-8" />
              İade ve İptal Politikası
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Önemli:</strong> YTK Academy dijital eğitim hizmeti sunmaktadır. 
                  Dijital içeriklerin doğası gereği, abonelik başladıktan sonra iade yapılamamaktadır.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                1. İade Politikası
              </h2>
              <p className="leading-relaxed mb-4">
                YTK Academy, dijital eğitim platformu olarak hizmet vermektedir. Abonelik planlarımız 
                dijital içerik ve hizmetlerden oluşmaktadır. Dijital ürünlerin doğası gereği ve 
                tüketicinin korunması hakkında kanunun 15. maddesi uyarınca, dijital içeriklerin 
                anında teslim edilmesi durumunda cayma hakkı kullanılamaz.
              </p>
              <p className="leading-relaxed mb-4">
                Bu nedenle, abonelik planlarımız için iade yapılamamaktadır. Abonelik başladıktan 
                sonra, ödeme yapılmış olsa bile iade talebi kabul edilmemektedir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                2. Abonelik İptali
              </h2>
              <p className="leading-relaxed mb-4">
                Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal işlemi:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Profil sayfanızdan &quot;Aboneliği İptal Et&quot; seçeneğini kullanarak</li>
                <li>Destek ekibimizle iletişime geçerek</li>
                <li>E-posta ile destek@ytkacademy.com.tr adresine yazabilirsiniz</li>
              </ul>
              <p className="leading-relaxed mt-4">
                <strong>Önemli:</strong> Aboneliği iptal ettiğinizde, mevcut abonelik süreniz sona 
                erene kadar platform özelliklerine erişmeye devam edebilirsiniz. Abonelik süresi 
                bittikten sonra otomatik olarak yenilenmeyecektir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                3. Özel Durumlar
              </h2>
              <p className="leading-relaxed mb-4">
                Aşağıdaki durumlarda özel değerlendirme yapılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Teknik sorunlar nedeniyle hizmete erişilememesi durumunda</li>
                <li>Platformun hizmet vermeyi durdurması durumunda</li>
                <li>Yasal zorunluluklar gereği</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Bu durumlarda lütfen destek ekibimizle iletişime geçin. Her durum bireysel olarak 
                değerlendirilecektir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                4. Ödeme İade Talepleri
              </h2>
              <p className="leading-relaxed mb-4">
                Ödeme iade talepleri sadece aşağıdaki durumlarda değerlendirilir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Çift ödeme yapılması durumunda (fazla ödeme iadesi yapılır)</li>
                <li>Teknik hata nedeniyle yanlış plan satın alınması (24 saat içinde bildirilmesi gerekir)</li>
                <li>Platformun hizmet vermeyi tamamen durdurması durumunda</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                5. Yasal Haklarınız
              </h2>
              <p className="leading-relaxed mb-4">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mevzuat kapsamında 
                sahip olduğunuz haklar saklıdır. Ancak, dijital içeriklerin anında teslim edilmesi 
                durumunda cayma hakkı kullanılamaz.
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Bilgilendirme:</strong> Satın alma işlemi yapmadan önce lütfen plan 
                  özelliklerini ve fiyatlandırmayı dikkatlice inceleyin. Abonelik başladıktan 
                  sonra iade yapılamayacağını unutmayın.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                6. İletişim
              </h2>
              <p className="leading-relaxed mb-4">
                İade ve iptal politikası hakkında sorularınız için:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  E-posta: <a href="mailto:destek@ytkacademy.com.tr" className="text-blue-500 hover:underline">
                    destek@ytkacademy.com.tr
                  </a>
                </li>
                <li>
                  WhatsApp: <a 
                    href="https://wa.me/905389351189?text=Merhaba%2C%20YTK%20Academy%20iade%20politikası%20hakkında%20bilgi%20almak%20istiyorum" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    +90 538 935 11 89
                  </a>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Bu politika YTK Academy tarafından hazırlanmıştır ve yasal mevzuata uygun olarak 
                düzenlenmiştir. Politika değişiklikleri bu sayfada yayınlanacaktır.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

