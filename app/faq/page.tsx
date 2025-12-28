"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/Accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { StructuredData } from "@/app/components/StructuredData";

export default function FAQPage() {
  const faqCategories = [
    {
      category: "Genel",
      questions: [
        {
          q: "Platform ücretsiz mi?",
          a: "Kayıt olmak tamamen ücretsizdir. Ancak platform özelliklerinin kullanımı abonelik sistemi ile aktif olmaktadır.",
        },
        {
          q: "Hesabımı nasıl oluşturabilirim?",
          a: "Ana sayfadaki 'Kayıt Ol' butonuna tıklayarak hesabınızı oluşturabilirsiniz. E-posta adresiniz ve şifrenizle kayıt olabilirsiniz.",
        },
        {
          q: "Mobil uygulama var mı?",
          a: "Şu anda web platformu tüm cihazlarda mükemmel çalışmaktadır. Mobil uygulama yakında gelecektir.",
        },
      ],
    },
    {
      category: "Eğitim",
      questions: [
        {
          q: "Kurslara nasıl erişebilirim?",
          a: "Dashboard'dan 'Eğitim' bölümüne giderek mevcut kursları görüntüleyebilir ve istediğiniz kursa kayıt olabilirsiniz.",
        },
        {
          q: "Kursları ne kadar sürede tamamlayabilirim?",
          a: "Kurslar kendi hızınızda tamamlanabilir. Ortalama bir kurs 2-4 hafta sürmektedir.",
        },
        {
          q: "Sertifika alabilir miyim?",
          a: "Evet, kursları tamamladığınızda dijital sertifika alabilirsiniz. Sertifikalar endüstri tarafından tanınmaktadır.",
        },
        {
          q: "AI özellikleri nasıl çalışır?",
          a: "AI, öğrenme hızınızı ve performansınızı analiz ederek size özel öneriler ve öğrenme yolları sunar.",
        },
      ],
    },
    {
      category: "Kariyer",
      questions: [
        {
          q: "İş bulma desteği var mı?",
          a: "Evet, CV oluşturma, mülakat simülasyonu ve iş ilanlarına doğrudan başvuru özelliklerimiz bulunmaktadır.",
        },
        {
          q: "İş ilanlarına nasıl başvurabilirim?",
          a: "'İş Fırsatları' bölümünden ilgilendiğiniz pozisyonları görüntüleyebilir ve başvuru yapabilirsiniz. CV'nizi oluşturduktan sonra başvurularınızı kolayca yönetebilirsiniz.",
        },
        {
          q: "Mülakat simülasyonu nasıl çalışır?",
          a: "Mülakat simülasyonu özelliği ile gerçekçi mülakat senaryoları yaşayabilir, AI performans analizi ile detaylı geri bildirim alabilirsiniz.",
        },
      ],
    },
    {
      category: "Platform",
      questions: [
        {
          q: "Rozetler nasıl kazanılır?",
          a: "Rozetler, platformda çeşitli aktiviteler yaparak kazanılır. Kurs tamamlama, proje bitirme, hackathon'lara katılma gibi aktiviteler rozet kazandırır.",
        },
        {
          q: "Profilimi nasıl düzenleyebilirim?",
          a: "Profil sayfanıza giderek 'Düzenle' butonuna tıklayın. Buradan profil fotoğrafı, isim, bio ve diğer bilgilerinizi güncelleyebilirsiniz.",
        },
        {
          q: "Hackathon'lara nasıl katılabilirim?",
          a: "'Hackathon' bölümünden aktif yarışmaları görüntüleyebilir, takım oluşturabilir veya mevcut takımlara katılabilirsiniz.",
        },
        {
          q: "Freelancer projelerde nasıl yer alabilirim?",
          a: "Freelancer bölümünden mevcut projeleri görüntüleyebilir, başvuru yapabilir ve kendi projelerinizi oluşturabilirsiniz.",
        },
      ],
    },
  ];

  const siteUrl = "https://ytkacademy.com.tr";
  
  // FAQPage schema için tüm soruları topla
  const mainEntity = faqCategories.flatMap((category) =>
    category.questions.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    }))
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mainEntity,
  };

  return (
    <>
      <StructuredData data={faqSchema} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            <HelpCircle className="w-10 h-10" />
            Sık Sorulan Sorular
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Platform hakkında merak ettiğiniz soruların yanıtları
          </p>
        </div>

        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-gray-900 dark:text-gray-100">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 dark:text-gray-400">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-start gap-4">
            <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Sorunuzun yanıtını bulamadınız mı?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Daha fazla yardıma ihtiyacınız varsa, lütfen bizimle iletişime geçin.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}

