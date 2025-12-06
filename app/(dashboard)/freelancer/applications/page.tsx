"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, DollarSign, Users, ClipboardList, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";

interface FreelancerBid {
  id: string;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
  project: {
    id: string;
    title: string;
    description: string;
    budget: number | null;
    deadline: string | null;
    status: string;
    creator: {
      id: string;
      name: string | null;
      email: string;
      profileImage: string | null;
      role: string;
    };
  };
}

export default function FreelancerApplicationsPage() {
  const [bids, setBids] = useState<FreelancerBid[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/freelancer/bids");
      const data = await response.json();

      if (response.ok) {
        setBids(data.bids || []);
      }
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "accepted":
        return "Kabul Edildi";
      case "rejected":
        return "Reddedildi";
      case "pending":
        return "Beklemede";
      default:
        return status;
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "in_progress":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Açık";
      case "in_progress":
        return "Devam Ediyor";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

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

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Başvurularım
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 font-medium">
              Başvurduğunuz freelancer projelerini görüntüleyin
            </p>
          </div>
          <Link href="/freelancer/projects" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 rotate-180" />
              <span>Projelere Dön</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Bids List */}
      {bids.length === 0 ? (
        <Card variant="elevated">
          <CardContent className="py-8 sm:py-12 md:py-16 text-center px-4">
            <ClipboardList className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 dark:text-gray-600 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium text-base sm:text-lg mb-2">
              Henüz başvurunuz yok
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-3 sm:mb-4">
              Projelere göz atarak başvuru yapabilirsiniz
            </p>
            <Link href="/freelancer/projects">
              <Button variant="gradient" size="sm" className="text-xs sm:text-sm">
                Projelere Göz At
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bids.map((bid) => (
            <Link key={bid.id} href={`/freelancer/projects/${bid.project.id}`}>
              <Card variant="elevated" hover className="h-full transition-all duration-300">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2">
                    <CardTitle className="text-lg sm:text-xl font-bold line-clamp-2 flex-1 text-gray-900 dark:text-gray-100">
                      {bid.project.title}
                    </CardTitle>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(bid.status)}`}>
                        {getStatusLabel(bid.status)}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getProjectStatusColor(bid.project.status)}`}>
                        {getProjectStatusLabel(bid.project.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-5 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                    {bid.project.description}
                  </p>
                  
                  {/* Bid Amount */}
                  <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>Teklif: {bid.amount.toLocaleString("tr-TR")} ₺</span>
                  </div>

                  {/* Bid Message Preview */}
                  {bid.message && (
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2 sm:p-3 rounded-lg">
                      <p className="font-medium mb-1">Mesajınız:</p>
                      <p className="line-clamp-2">{bid.message}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
                    {bid.project.budget && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">Bütçe: {bid.project.budget.toLocaleString("tr-TR")} ₺</span>
                      </div>
                    )}
                    {bid.project.deadline && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(bid.project.deadline).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="whitespace-nowrap">{new Date(bid.createdAt).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 break-words">
                      <span className="font-medium">Proje Sahibi:</span> {bid.project.creator.name || bid.project.creator.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

