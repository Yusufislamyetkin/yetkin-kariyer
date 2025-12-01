"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/Accordion";
import { HelpCircle, BookOpen, MessageCircle, Video } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <HelpCircle className="w-8 h-8" />
              Yardım Merkezi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Sık Sorulan Sorular
              </h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Hesabımı nasıl oluşturabilirim?</AccordionTrigger>
                  <AccordionContent>
                    Ana sayfadaki &quot;Kayıt Ol&quot; butonuna tıklayarak hesabınızı oluşturabilirsiniz. 
                    E-posta adresiniz ve şifrenizle kayıt olabilirsiniz.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Kurslara nasıl erişebilirim?</AccordionTrigger>
                  <AccordionContent>
                    Dashboard&apos;dan &quot;Eğitim&quot; bölümüne giderek mevcut kursları görüntüleyebilir ve 
                    istediğiniz kursa kayıt olabilirsiniz.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Rozetler nasıl kazanılır?</AccordionTrigger>
                  <AccordionContent>
                    Rozetler, platformda çeşitli aktiviteler yaparak kazanılır. Kurs tamamlama, 
                    proje bitirme, hackathon&apos;lara katılma gibi aktiviteler rozet kazandırır.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Profilimi nasıl düzenleyebilirim?</AccordionTrigger>
                  <AccordionContent>
                    Profil sayfanıza giderek &quot;Düzenle&quot; butonuna tıklayın. Buradan profil fotoğrafı, 
                    isim, bio ve diğer bilgilerinizi güncelleyebilirsiniz.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>İş ilanlarına nasıl başvurabilirim?</AccordionTrigger>
                  <AccordionContent>
                    &quot;İş Fırsatları&quot; bölümünden ilgilendiğiniz pozisyonları görüntüleyebilir ve 
                    başvuru yapabilirsiniz. CV&apos;nizi oluşturduktan sonra başvurularınızı kolayca yönetebilirsiniz.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Destek Kaynakları
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Dokümantasyon</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Platform özellikleri ve kullanım kılavuzları
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Video Eğitimler</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Platform kullanımı için video rehberler
                  </p>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <MessageCircle className="w-6 h-6 text-blue-500" />
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Topluluk Desteği</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Diğer kullanıcılardan yardım alın
                  </p>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                İletişim
              </h2>
              <p className="leading-relaxed">
                Daha fazla yardıma ihtiyacınız varsa, lütfen bizimle iletişime geçin: 
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

