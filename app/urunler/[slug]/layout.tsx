import type { Metadata } from "next";

const products: Record<string, {
  name: string;
  description: string;
  price: number;
  period: string;
}> = {
  "temel-plan": {
    name: "Temel Plan",
    description: "Giriş seviyesi, temel özelliklere erişim. Ders erişimi, test çözme, canlı kodlama ve daha fazlası.",
    price: 12000,
    period: "yıl",
  },
  "pro-plan": {
    name: "Pro Plan",
    description: "Tüm özelliklere erişim ve gelişmiş destek. Mentor desteği, hackathonlar, freelancer projeler ve daha fazlası.",
    price: 15000,
    period: "yıl",
  },
  "vip-plan": {
    name: "VIP Plan",
    description: "Premium özellikler ve kişisel destek. Kişisel mentor, 7/24 destek, özel içerikler ve daha fazlası.",
    price: 30000,
    period: "yıl",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products[slug];

  if (!product) {
    return {
      title: "Ürün Bulunamadı",
      description: "Aradığınız ürün bulunamadı.",
    };
  }

  const siteUrl = "https://ytkacademy.com.tr";
  const productUrl = `${siteUrl}/urunler/${slug}`;

  return {
    title: `${product.name} | YTK Academy`,
    description: `${product.description} ${product.price.toLocaleString("tr-TR")} TL / ${product.period}`,
    keywords: [
      product.name,
      "YTK Academy",
      "abonelik planı",
      "eğitim paketi",
      "yazılım eğitimi",
    ],
    openGraph: {
      title: `${product.name} | YTK Academy`,
      description: `${product.description} ${product.price.toLocaleString("tr-TR")} TL / ${product.period}`,
      url: productUrl,
      type: "website",
      siteName: "YTK Academy",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | YTK Academy`,
      description: `${product.description} ${product.price.toLocaleString("tr-TR")} TL / ${product.period}`,
    },
    alternates: {
      canonical: productUrl,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

