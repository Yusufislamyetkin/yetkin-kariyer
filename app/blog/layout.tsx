import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Yazılım geliştirme, kariyer ve teknoloji hakkında güncel içerikler. YTK Academy blog'unda yazılım dünyasından haberler, ipuçları ve rehberler.",
  keywords: [
    "yazılım blog",
    "teknoloji haberleri",
    "programlama ipuçları",
    "kariyer rehberi",
    "yazılım geliştirme",
  ],
  openGraph: {
    title: "Blog | YTK Academy",
    description: "Yazılım geliştirme, kariyer ve teknoloji hakkında güncel içerikler.",
    url: "https://ytkacademy.com.tr/blog",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
