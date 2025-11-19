import { notFound } from "next/navigation";
import { LiveCodingEditor } from "@/app/components/education/LiveCodingEditor";

async function getData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/challenges/live/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.item as {
    id: string;
    title: string;
    description?: string | null;
    languages: string[];
    starterCode?: Record<string, string> | null;
  } | null;
}

export default async function LiveCodingDetailPage({ params }: { params: { id: string } }) {
  const item = await getData(params.id);
  if (!item) return notFound();

  const firstLang = item.languages?.[0] || "javascript";
  const initialCode = (item.starterCode || {})[firstLang] || "";

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{item.title}</h1>
        {item.description ? <p className="text-sm text-gray-600 mt-1">{item.description}</p> : null}
      </div>
      <div className="rounded-xl border">
        {/* @ts-ignore */}
        <LiveCodingEditor
          taskId={item.id}
          languages={(item.languages as unknown) as any}
          activeLanguage={(firstLang as unknown) as any}
          value={initialCode}
          onChange={() => {}}
          onLanguageChange={() => {}}
        />
      </div>
    </div>
  );
}

