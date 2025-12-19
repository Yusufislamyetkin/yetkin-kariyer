import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariyer",
  description: "YTK Academy ekibine katılın. Açık pozisyonları görüntüleyin ve eğitim teknolojilerinin geleceğini şekillendiren ekibimizin bir parçası olun.",
  keywords: [
    "YTK Academy iş ilanları",
    "yazılım işleri",
    "eğitim teknolojileri kariyer",
    "remote iş",
    "yazılım geliştirici işleri",
  ],
  openGraph: {
    title: "Kariyer | YTK Academy",
    description: "YTK Academy ekibine katılın. Açık pozisyonları görüntüleyin ve eğitim teknolojilerinin geleceğini şekillendirin.",
    url: "https://ytkacademy.com.tr/careers",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/careers",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
