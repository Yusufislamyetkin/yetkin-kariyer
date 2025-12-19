import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlandırma",
  description: "YTK Academy fiyatlandırma planları. Temel, Pro ve VIP planlarımızı karşılaştırın ve size en uygun planı seçin. Yıllık aboneliklerle kariyerinizi geliştirin.",
  keywords: [
    "YTK Academy fiyatlandırma",
    "abonelik planları",
    "eğitim paketleri",
    "premium üyelik",
    "yazılım eğitimi fiyatları",
  ],
  openGraph: {
    title: "Fiyatlandırma | YTK Academy",
    description: "YTK Academy fiyatlandırma planları. Temel, Pro ve VIP planlarımızı karşılaştırın ve size en uygun planı seçin.",
    url: "https://ytkacademy.com.tr/fiyatlandirma",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/fiyatlandirma",
  },
};

export default function FiyatlandirmaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
