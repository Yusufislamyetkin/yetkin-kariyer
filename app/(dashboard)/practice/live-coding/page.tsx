"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/app/components/ui/Input";

type Item = {
  id: string;
  title: string;
  description?: string | null;
  languages: string[];
  isPublished: boolean;
};

export default function LiveCodingListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      const res = await fetch("/api/challenges/live?published=true", { cache: "no-store" });
      const data = await res.json();
      setItems(data.items || []);
    })();
  }, []);

  const filtered = items.filter((x) => x.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Live Coding</h1>
        <div className="w-64">
          <Input placeholder="Ara..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Link key={item.id} href={`/practice/live-coding/${item.id}`} className="rounded-xl border p-4 hover:bg-gray-50">
            <div className="font-medium">{item.title}</div>
            <div className="text-xs text-gray-500 mt-1">{item.languages.join(", ")}</div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="text-sm text-gray-500">Kayıt bulunamadı.</div>}
      </div>
    </div>
  );
}

