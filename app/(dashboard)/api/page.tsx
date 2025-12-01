"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Code, Key, Book, Zap } from "lucide-react";

export default function APIPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Code className="w-8 h-8" />
              API Dokümantasyonu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Yetkin Academy API
              </h2>
              <p className="leading-relaxed mb-4">
                Yetkin Academy API&apos;si, platform verilerine programatik erişim sağlar. 
                RESTful API kullanarak kullanıcı bilgileri, kurslar, projeler ve daha fazlasına erişebilirsiniz.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Hızlı Başlangıç
              </h2>
              <div className="bg-gray-900 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="text-green-400 text-sm overflow-x-auto">
{`// API Base URL
const API_BASE = 'https://yetkinacademy.vercel.app/api';

// Örnek: Kullanıcı bilgilerini getir
fetch(\`\${API_BASE}/profile/\${userId}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(data => console.log(data));`}
                </pre>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                API Özellikleri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kimlik Doğrulama</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    OAuth 2.0 ve API key desteği
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">RESTful API</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Standart HTTP metodları ve JSON formatı
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Book className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Kapsamlı Dokümantasyon</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detaylı API referansı ve örnekler
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Code className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">SDK Desteği</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    JavaScript, Python ve diğer diller için SDK&apos;lar
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                API Endpoint&apos;leri
              </h2>
              <div className="space-y-3">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    GET /api/profile/:userId
                  </code>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Kullanıcı profil bilgilerini getirir
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    GET /api/posts
                  </code>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Gönderileri listeler
                  </p>
                </div>
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                    GET /api/courses
                  </code>
                  <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                    Kursları listeler
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                API Key Alma
              </h2>
              <p className="leading-relaxed mb-4">
                API kullanmak için önce bir API key almanız gerekmektedir. 
                Profil ayarlarınızdan &quot;API Keys&quot; bölümüne giderek yeni bir key oluşturabilirsiniz.
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm">
                  <strong>Not:</strong> API key&apos;lerinizi güvende tutun ve asla public repository&apos;lerde paylaşmayın.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Daha Fazla Bilgi
              </h2>
              <p className="leading-relaxed">
                Detaylı API dokümantasyonu için: 
                <a href="/api/docs" className="text-blue-500 hover:underline ml-1">
                  API Dokümantasyonu
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

