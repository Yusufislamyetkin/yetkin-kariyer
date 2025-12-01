"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { MapPin, Building, Globe, Mail, Phone } from "lucide-react";

export default function LocationsPage() {
  const locations = [
    {
      city: "İstanbul",
      address: "Maslak Mahallesi, Büyükdere Caddesi No:123",
      district: "Sarıyer, İstanbul",
      postalCode: "34398",
      country: "Türkiye",
      phone: "+90 (212) 123 45 67",
      email: "istanbul@yetkinacademy.com",
    },
    {
      city: "Ankara",
      address: "Çankaya Mahallesi, Tunalı Hilmi Caddesi No:45",
      district: "Çankaya, Ankara",
      postalCode: "06420",
      country: "Türkiye",
      phone: "+90 (312) 234 56 78",
      email: "ankara@yetkinacademy.com",
    },
    {
      city: "İzmir",
      address: "Alsancak Mahallesi, Kordonboyu Caddesi No:78",
      district: "Konak, İzmir",
      postalCode: "35220",
      country: "Türkiye",
      phone: "+90 (232) 345 67 89",
      email: "izmir@yetkinacademy.com",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MapPin className="w-8 h-8" />
              Ofis Konumlarımız
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <p className="leading-relaxed mb-6">
                Yetkin Academy olarak Türkiye&apos;nin farklı şehirlerinde ofislerimiz bulunmaktadır. 
                Aşağıdaki konumlardan size en yakın ofisimizi ziyaret edebilir veya iletişime geçebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-5 h-5 text-blue-500" />
                      <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
                        {location.city}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                      <div className="text-sm">
                        <p>{location.address}</p>
                        <p>{location.district}</p>
                        <p>{location.postalCode}</p>
                        <p className="mt-1">{location.country}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <a href={`tel:${location.phone}`} className="text-sm text-blue-500 hover:underline">
                        {location.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <a href={`mailto:${location.email}`} className="text-sm text-blue-500 hover:underline">
                        {location.email}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Uzaktan Çalışma
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Yetkin Academy olarak, tüm ekibimizle uzaktan çalışma modelini destekliyoruz. 
                    Türkiye&apos;nin her yerinden bize katılabilir ve platformumuzu kullanabilirsiniz.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Ziyaret Saatleri
              </h2>
              <p className="leading-relaxed mb-4">
                Ofislerimiz hafta içi 09:00 - 18:00 saatleri arasında açıktır. 
                Ziyaret etmeden önce randevu almanızı öneririz.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

