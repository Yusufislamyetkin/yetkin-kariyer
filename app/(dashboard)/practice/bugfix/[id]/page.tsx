import { notFound } from "next/navigation";

async function getData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/challenges/bugfix/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.item as {
    id: string;
    title: string;
    buggyCode: string;
    fixDescription?: string | null;
    language: string;
  } | null;
}

export default async function BugfixDetailPage({ params }: { params: { id: string } }) {
  const item = await getData(params.id);
  if (!item) return notFound();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{item.title}</h1>
        {item.fixDescription ? <p className="text-sm text-gray-600 mt-1">{item.fixDescription}</p> : null}
      </div>
      <div className="rounded-xl border p-4 bg-gray-50">
        <pre className="text-xs overflow-auto">{item.buggyCode}</pre>
      </div>
    </div>
  );
}

