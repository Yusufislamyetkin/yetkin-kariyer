import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { Providers } from "@/app/providers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";

const siteUrl = "https://ytkacademy.com.tr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YTK Academy - Kariyer Platformu",
    template: "%s | YTK Academy",
  },
  description: "Yazılım öğren, iş bul, kazanç elde et. AI destekli öğrenme, canlı kodlama, sosyal ağ ve kazanç fırsatları tek platformda. 25+ teknoloji kursu, hackathon'lar, freelancer projeler ve kariyer desteği.",
  keywords: [
    "yazılım eğitimi",
    "programlama kursları",
    "yazılım geliştirme",
    "kariyer platformu",
    "AI destekli öğrenme",
    "hackathon",
    "freelancer",
    "mülakat simülasyonu",
    "CV oluşturma",
    "sosyal ağ",
    "yazılım topluluğu",
    "React",
    "Node.js",
    ".NET Core",
    "Python",
    "Java",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Türkiye",
  ],
  authors: [{ name: "YTK Academy", url: siteUrl }],
  creator: "YTK Academy",
  publisher: "YTK Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "YTK Academy",
    title: "YTK Academy - Yazılım Öğren, İş Bul, Kazanç Elde Et",
    description: "Kapsamlı eğitim, sosyal ağ ve kariyer platformu. AI destekli öğrenme, canlı kodlama, hackathon'lar ve freelancer fırsatları tek platformda.",
    images: [
      {
        url: `${siteUrl}/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: "YTK Academy - Kariyer Platformu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YTK Academy - Yazılım Öğren, İş Bul, Kazanç Elde Et",
    description: "Kapsamlı eğitim, sosyal ağ ve kariyer platformu. AI destekli öğrenme, canlı kodlama, hackathon'lar ve freelancer fırsatları.",
    images: [`${siteUrl}/images/og-image.png`],
    creator: "@ytkacademy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/images/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  verification: {
    // Google Search Console verification code buraya eklenecek
    // google: "verification-code-here",
  },
  category: "education",
  classification: "Eğitim ve Kariyer Platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <GoogleAnalytics />
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
