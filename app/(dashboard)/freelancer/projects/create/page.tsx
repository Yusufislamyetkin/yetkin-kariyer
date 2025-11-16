"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

export default function CreateFreelancerProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      
      // Parse budget - only include if it's a valid positive number
      let budget: number | undefined = undefined;
      if (formData.budget && formData.budget.trim() !== "") {
        const parsed = parseFloat(formData.budget);
        if (!isNaN(parsed) && parsed > 0) {
          budget = parsed;
        }
      }
      
      // Convert datetime-local to ISO string format
      let deadline: string | undefined = undefined;
      if (formData.deadline && formData.deadline.trim() !== "") {
        // datetime-local format is "YYYY-MM-DDTHH:mm", convert to ISO
        const date = new Date(formData.deadline);
        if (!isNaN(date.getTime())) {
          deadline = date.toISOString();
        }
      }
      
      const response = await fetch("/api/freelancer/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          budget: budget ?? null,
          deadline: deadline ?? null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/freelancer/projects/${data.project.id}`);
      } else {
        // Show detailed error messages if available
        let errorMessage = data.error || "Proje oluşturulurken bir hata oluştu";
        
        // Add message if available
        if (data.message && data.message !== errorMessage) {
          errorMessage += `\n\n${data.message}`;
        }
        
        // Add validation details if available
        if (data.details && Array.isArray(data.details)) {
          const detailMessages = data.details.map((err: any) => {
            const field = err.path || "alan";
            return `${field}: ${err.message}`;
          }).join("\n");
          errorMessage = `${errorMessage}\n\nDetaylar:\n${detailMessages}`;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      const errorMessage = error instanceof Error ? error.message : "Bilinmeyen hata";
      alert(`Proje oluşturulurken bir hata oluştu: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/freelancer/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-gray-100">
            Yeni Proje Oluştur
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Proje Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Proje Başlığı *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Örn: Web Sitesi Geliştirme"
                required
                minLength={3}
                maxLength={200}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Açıklama *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Projenin detaylarını, gereksinimlerini ve beklentilerinizi açıklayın..."
                rows={8}
                required
                minLength={10}
                maxLength={5000}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bütçe (₺)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Son Tarih
                </label>
                <Input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                variant="gradient"
                disabled={loading}
                className="flex-1"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? "Oluşturuluyor..." : "Proje Oluştur"}
              </Button>
              <Link href="/freelancer/projects">
                <Button type="button" variant="outline">
                  İptal
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

