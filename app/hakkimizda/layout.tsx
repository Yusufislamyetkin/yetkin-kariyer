import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "YTK Academy hakkında bilgi edinin. Yusuf İslam Yetkin tarafından kurulan, yazılım geliştirme alanında kapsamlı eğitim ve kariyer platformu.",
  keywords: [
    "YTK Academy hakkında",
    "yazılım eğitimi",
    "kariyer platformu",
    "Yusuf İslam Yetkin",
    "eğitim teknolojileri",
  ],
  openGraph: {
    title: "Hakkımızda | YTK Academy",
    description: "YTK Academy hakkında bilgi edinin. Yazılım geliştirme alanında kapsamlı eğitim ve kariyer platformu.",
    url: "https://ytkacademy.com.tr/hakkimizda",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/hakkimizda",
  },
};

export default function HakkimizdaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
