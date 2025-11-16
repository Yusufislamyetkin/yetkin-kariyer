import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/contexts/ThemeContext";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "AI Recruit - Kariyer Platformu",
  description: "Yapay zeka destekli kariyer geliştirme ve mülakat platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <Providers>
          <ThemeProvider>{children}</ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}

