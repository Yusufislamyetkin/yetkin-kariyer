import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description: "YTK Academy platformu hakkında sık sorulan sorular ve yanıtları. Platform kullanımı, kurslar, kariyer desteği ve daha fazlası hakkında bilgi edinin.",
  keywords: [
    "YTK Academy SSS",
    "sık sorulan sorular",
    "platform kullanımı",
    "kurs soruları",
    "kariyer desteği",
    "hackathon soruları",
  ],
  openGraph: {
    title: "Sık Sorulan Sorular | YTK Academy",
    description: "YTK Academy platformu hakkında sık sorulan sorular ve yanıtları.",
    url: "https://ytkacademy.com.tr/faq",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
