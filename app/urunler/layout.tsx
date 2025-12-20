import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "YTK Academy ürün ve hizmetleri. Abonelik planlarımızı keşfedin ve kariyerinizi geliştirin.",
  keywords: [
    "YTK Academy ürünler",
    "abonelik planları",
    "eğitim paketleri",
    "premium üyelik",
    "yazılım eğitimi",
  ],
  openGraph: {
    title: "Ürünler | YTK Academy",
    description: "YTK Academy ürün ve hizmetleri. Abonelik planlarımızı keşfedin ve kariyerinizi geliştirin.",
    url: "https://ytkacademy.com.tr/urunler",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/urunler",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

