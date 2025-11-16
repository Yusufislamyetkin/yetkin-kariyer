"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";

interface InterviewAttempt {
  id: string;
  aiScore: number | null;
  completedAt: string;
  interview: {
    id: string;
    title: string;
  };
}

export default function InterviewHistoryPage() {
  const [attempts, setAttempts] = useState<InterviewAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/interview/history");
      const data = await response.json();
      setAttempts(data.attempts || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Mülakat Geçmişi</h1>

      {attempts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Henüz mülakat kaydınız yok.</p>
          <Link
            href="/interview/practice"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            İlk Mülakatınızı Başlatın
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <Link
              key={attempt.id}
              href={`/interview/results/${attempt.id}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 transition border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{attempt.interview.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(attempt.completedAt).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {attempt.aiScore !== null && (
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {attempt.aiScore}%
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

