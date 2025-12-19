import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Code } from "lucide-react";
import { loadLiveCodingCases } from "@/lib/education/loadLiveCodingCases";
import { SubscriptionCheckWrapper } from "../_components/SubscriptionCheckWrapper";
import { CaseList } from "./_components/CaseList";

export const dynamic = "force-dynamic";

const LANGUAGE_ICONS: Record<string, string> = {
  csharp: "💻",
  java: "☕",
  python: "🐍",
  php: "🐘",
  javascript: "📜",
  typescript: "📘",
  go: "🐹",
  rust: "🦀",
  cpp: "⚡",
  kotlin: "🔷",
  ruby: "💎",
};

const LANGUAGE_COLORS: Record<string, string> = {
  csharp: "#239120",
  java: "#ED8B00",
  python: "#3776AB",
  php: "#777BB4",
  javascript: "#F7DF1E",
  typescript: "#3178C6",
  go: "#00ADD8",
  rust: "#000000",
  cpp: "#00599C",
  kotlin: "#7F52FF",
  ruby: "#CC342D",
};

export default function LanguageCasesPage({
  params,
}: {
  params: { language: string };
}) {
  const liveCodingCases = loadLiveCodingCases();
  const language = liveCodingCases.languages.find(
    (lang) => lang.id === params.language
  );

  if (!language) {
    notFound();
  }

  const icon = LANGUAGE_ICONS[language.id] || "💻";
  const color = LANGUAGE_COLORS[language.id] || "#666";

  return (
    <SubscriptionCheckWrapper>
      <div className="space-y-8 animate-fade-in">
      <section className="rounded-3xl border border-emerald-500/10 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/50 p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-6 mb-6">
          <Link href="/education/cases">
            <Button variant="outline" size="sm" className="bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dillere Dön
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-xl text-4xl"
              style={{
                backgroundColor: `${color}15`,
                border: `2px solid ${color}30`,
              }}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold leading-tight">
                {language.name} Case&apos;leri
              </h1>
              <p className="text-base text-white/80 mt-2">
                {language.cases.length} adet case ile {language.name} programlama dilinde pratik yapın.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CaseList cases={language.cases} color={color} />
    </div>
    </SubscriptionCheckWrapper>
  );
}

