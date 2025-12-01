"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Shield, Lock, Eye } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Shield className="w-8 h-8" />
              Gizlilik Politikası
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
                Veri Toplama
              </h2>
              <p className="leading-relaxed mb-4">
                Yetkin Academy olarak, platformumuzu kullanırken aşağıdaki bilgileri topluyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hesap bilgileri (isim, e-posta, profil fotoğrafı)</li>
                <li>Eğitim aktiviteleri ve ilerleme verileri</li>
                <li>Platform kullanım istatistikleri</li>
                <li>İletişim bilgileri (destek talepleri için)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Veri Kullanımı
              </h2>
              <p className="leading-relaxed mb-4">
                Topladığımız verileri şu amaçlarla kullanıyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Platform hizmetlerini sağlamak ve geliştirmek</li>
                <li>Kişiselleştirilmiş öğrenme deneyimi sunmak</li>
                <li>Kullanıcı desteği sağlamak</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
                <li>Yasal yükümlülükleri yerine getirmek</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Veri Güvenliği
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Şifreleme</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tüm veriler SSL/TLS ile şifrelenir
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Erişim Kontrolü</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sadece yetkili personel verilere erişebilir
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Çerezler
              </h2>
              <p className="leading-relaxed">
                Platformumuz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. 
                Çerez tercihlerinizi tarayıcı ayarlarınızdan yönetebilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Haklarınız
              </h2>
              <p className="leading-relaxed mb-4">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinize erişim hakkı</li>
                <li>Verilerinizin düzeltilmesini talep etme hakkı</li>
                <li>Verilerinizin silinmesini talep etme hakkı</li>
                <li>Veri işlemeye itiraz etme hakkı</li>
                <li>Verilerinizin aktarılmasını talep etme hakkı</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                İletişim
              </h2>
              <p className="leading-relaxed">
                Gizlilik politikamız hakkında sorularınız için: 
                <a href="mailto:gizlilik@yetkinacademy.com" className="text-blue-500 hover:underline ml-1">
                  gizlilik@yetkinacademy.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

