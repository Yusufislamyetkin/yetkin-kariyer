import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İade ve İptal Politikası",
  description: "YTK Academy iade ve iptal politikası. Dijital eğitim hizmetlerimiz hakkında bilgi edinin.",
  keywords: [
    "iade politikası",
    "iptal politikası",
    "YTK Academy iade",
    "dijital hizmet iade",
  ],
  openGraph: {
    title: "İade ve İptal Politikası | YTK Academy",
    description: "YTK Academy iade ve iptal politikası. Dijital eğitim hizmetlerimiz hakkında bilgi edinin.",
    url: "https://ytkacademy.com.tr/iade-politikasi",
  },
  alternates: {
    canonical: "https://ytkacademy.com.tr/iade-politikasi",
  },
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

