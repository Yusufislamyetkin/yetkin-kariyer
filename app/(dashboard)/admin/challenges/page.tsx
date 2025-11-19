"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Loader2, RefreshCw, Upload, Rocket, Plus, Trash2 } from "lucide-react";

type LiveItem = {
  id: string;
  title: string;
  description?: string | null;
  difficulty?: string | null;
  languages: string[];
  isPublished: boolean;
  createdAt: string;
};

type BugfixItem = {
  id: string;
  title: string;
  language: string;
  isPublished: boolean;
  createdAt: string;
};

export default function ChallengesAdminPage() {
  const [tab, setTab] = useState<"live" | "bugfix" | "settings">("live");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [bugfixItems, setBugfixItems] = useState<BugfixItem[]>([]);

  const [creatingLive, setCreatingLive] = useState(false);
  const [creatingBug, setCreatingBug] = useState(false);

  const [liveForm, setLiveForm] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    languages: ["javascript"],
    isPublished: true
  });

  const [bugForm, setBugForm] = useState({
    title: "",
    buggyCode: "function add(a,b){ return a - b; }",
    fixDescription: "Toplama işlemi için + kullanılmalı.",
    language: "javascript",
    isPublished: true
  });

  const filteredLive = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return liveItems;
    return liveItems.filter((x) => x.title.toLowerCase().includes(q) || (x.description || "").toLowerCase().includes(q));
  }, [query, liveItems]);

  const filteredBugfix = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bugfixItems;
    return bugfixItems.filter((x) => x.title.toLowerCase().includes(q));
  }, [query, bugfixItems]);

  async function loadData() {
    setLoading(true);
    try {
      const [liveRes, bugRes] = await Promise.all([
        fetch("/api/challenges/live?published="),
        fetch("/api/challenges/bugfix?published=")
      ]);
      const [liveJson, bugJson] = await Promise.all([liveRes.json(), bugRes.json()]);
      setLiveItems(liveJson.items || []);
      setBugfixItems(bugJson.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadData();
  }, []);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await fetch("/api/admin/seed/challenges", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Seed başarısız");
      }
      await loadData();
    } catch {
      // ignore for now
    } finally {
      setSeeding(false);
    }
  }

  async function createLive() {
    setCreatingLive(true);
    try {
      const res = await fetch("/api/challenges/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(liveForm)
      });
      if (!res.ok) throw new Error("Oluşturma başarısız");
      setLiveForm((p) => ({ ...p, title: "", description: "" }));
      await loadData();
    } finally {
      setCreatingLive(false);
    }
  }

  async function createBugfix() {
    setCreatingBug(true);
    try {
      const res = await fetch("/api/challenges/bugfix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bugForm)
      });
      if (!res.ok) throw new Error("Oluşturma başarısız");
      setBugForm((p) => ({ ...p, title: "" }));
      await loadData();
    } finally {
      setCreatingBug(false);
    }
  }

  async function deleteLive(id: string) {
    await fetch(`/api/challenges/live/${id}`, { method: "DELETE" });
    await loadData();
  }
  async function deleteBug(id: string) {
    await fetch(`/api/challenges/bugfix/${id}`, { method: "DELETE" });
    await loadData();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Admin • Challenge Yönetimi</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input placeholder="Ara..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Yenile
          </Button>
          <Button onClick={handleSeed} disabled={seeding}>
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            10+10 Seed
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === "live" ? "primary" : "secondary"} onClick={() => setTab("live")}>Live Coding</Button>
        <Button variant={tab === "bugfix" ? "primary" : "secondary"} onClick={() => setTab("bugfix")}>Bugfix</Button>
        <Button variant={tab === "settings" ? "primary" : "secondary"} onClick={() => setTab("settings")}>Ayarlar</Button>
      </div>

      {tab === "live" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Live Coding Listesi</h2>
            </div>
            <div className="space-y-2">
              {filteredLive.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.languages.join(", ")} • {item.isPublished ? "Yayında" : "Taslak"}</div>
                  </div>
                  <Button variant="danger" onClick={() => deleteLive(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {filteredLive.length === 0 && <div className="text-sm text-gray-500">Kayıt bulunamadı.</div>}
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Yeni Live Coding</h3>
              <Rocket className="h-4 w-4 text-purple-600" />
            </div>
            <Input placeholder="Başlık" value={liveForm.title} onChange={(e) => setLiveForm((p) => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Açıklama" value={liveForm.description} onChange={(e) => setLiveForm((p) => ({ ...p, description: e.target.value }))} />
            <Input placeholder="Diller (virgülle)" value={liveForm.languages.join(",")} onChange={(e) => setLiveForm((p) => ({ ...p, languages: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))} />
            <div className="flex justify-end">
              <Button onClick={createLive} disabled={creatingLive || !liveForm.title}>
                {creatingLive ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === "bugfix" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-xl border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Bugfix Listesi</h2>
            </div>
            <div className="space-y-2">
              {filteredBugfix.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.language} • {item.isPublished ? "Yayında" : "Taslak"}</div>
                  </div>
                  <Button variant="danger" onClick={() => deleteBug(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {filteredBugfix.length === 0 && <div className="text-sm text-gray-500">Kayıt bulunamadı.</div>}
            </div>
          </div>

          <div className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Yeni Bugfix</h3>
              <Rocket className="h-4 w-4 text-amber-600" />
            </div>
            <Input placeholder="Başlık" value={bugForm.title} onChange={(e) => setBugForm((p) => ({ ...p, title: e.target.value }))} />
            <Input placeholder="Dil" value={bugForm.language} onChange={(e) => setBugForm((p) => ({ ...p, language: e.target.value }))} />
            <div className="flex justify-end">
              <Button onClick={createBugfix} disabled={creatingBug || !bugForm.title}>
                {creatingBug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Oluştur
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div className="rounded-xl border p-6 space-y-3">
          <div className="text-sm text-gray-600">
            Bu sayfadan Canlı Kodlama ve Bugfix verilerini yönetebilir, 10+10 seed atabilirsiniz.
          </div>
        </div>
      )}
    </div>
  );
}

