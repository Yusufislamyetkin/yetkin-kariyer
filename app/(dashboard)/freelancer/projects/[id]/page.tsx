"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Calendar, DollarSign, Users, Send, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Textarea } from "@/app/components/ui/Textarea";

interface FreelancerProject {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  deadline: string | null;
  status: string;
  createdBy: string;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    role: string;
  };
  bids: Array<{
    id: string;
    userId: string;
    amount: number;
    message: string;
    status: string;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      profileImage: string | null;
    };
  }>;
}

export default function FreelancerProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [project, setProject] = useState<FreelancerProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/freelancer/projects/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setProject(data.project);
      } else {
        router.push("/freelancer/projects");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      router.push("/freelancer/projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(`/api/freelancer/projects/${params.id}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(bidAmount),
          message: bidMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBidAmount("");
        setBidMessage("");
        setShowBidForm(false);
        await fetchProject(); // Refresh project data
      } else {
        alert(data.error || "Teklif gönderilirken bir hata oluştu");
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
      alert("Teklif gönderilirken bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const hasUserBid = project?.bids.some((bid) => bid.userId === session?.user?.id);
  const isCreator = project?.createdBy === session?.user?.id;
  const canBid = project?.status === "open" && !isCreator && !hasUserBid && session?.user?.id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
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
            {project.title}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Proje Detayları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                  {project.description}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {project.budget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Bütçe</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {project.budget.toLocaleString("tr-TR")} ₺
                      </p>
                    </div>
                  </div>
                )}
                {project.deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Son Tarih</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(project.deadline).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bid Form */}
          {canBid && (
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Teklif Ver</CardTitle>
              </CardHeader>
              <CardContent>
                {!showBidForm ? (
                  <Button
                    variant="gradient"
                    onClick={() => setShowBidForm(true)}
                    className="w-full"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Teklif Formunu Aç
                  </Button>
                ) : (
                  <form onSubmit={handleSubmitBid} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Teklif Tutarı (₺)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Mesajınız
                      </label>
                      <Textarea
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="Projeye dair teklifinizi ve neden sizi seçmeleri gerektiğini açıklayın..."
                        rows={6}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="gradient"
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting ? "Gönderiliyor..." : "Teklif Gönder"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowBidForm(false);
                          setBidAmount("");
                          setBidMessage("");
                        }}
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {hasUserBid && (
            <Card variant="elevated" className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="h-5 w-5" />
                  <p className="font-medium">Bu projeye zaten teklif verdiniz</p>
                </div>
              </CardContent>
            </Card>
          )}

          {isCreator && (
            <Card variant="elevated" className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                  <p className="font-medium">Bu projenin sahibisiniz</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Teklif Verenler</CardTitle>
            </CardHeader>
            <CardContent>
              {project.bids.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Henüz teklif yok
                </p>
              ) : (
                <div className="space-y-3">
                  {project.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                          {bid.user.name || bid.user.email}
                        </p>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {bid.amount.toLocaleString("tr-TR")} ₺
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {bid.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(bid.createdAt).toLocaleDateString("tr-TR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Proje Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Oluşturan</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {project.creator.name || project.creator.email}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Oluşturulma Tarihi</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(project.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Durum</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {project.status === "open" && "Açık"}
                  {project.status === "in_progress" && "Devam Ediyor"}
                  {project.status === "completed" && "Tamamlandı"}
                  {project.status === "cancelled" && "İptal Edildi"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

