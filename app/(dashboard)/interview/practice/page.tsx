/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

interface Interview {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  difficulty: string | null;
  duration: number | null;
}

export default function InterviewPracticePage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [difficulty, setDifficulty] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, [type, difficulty]);

  const fetchInterviews = async () => {
    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (difficulty) params.append("difficulty", difficulty);

      const response = await fetch(`/api/interview?${params.toString()}`);
      const data = await response.json();
      setInterviews(data.interviews || []);
    } catch (error) {
      console.error("Error fetching interviews:", error);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mülakat Pratikleri</h1>
        <Link
          href="/interview/history"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-purple-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <ClipboardList className="h-5 w-5" />
          <span>Mülakat Geçmişim</span>
        </Link>
      </div>

      <div className="mb-6 flex gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">Tüm Türler</option>
          <option value="technical">Teknik</option>
          <option value="behavioral">Davranışsal</option>
          <option value="case">Vaka Çalışması</option>
        </select>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        >
          <option value="">Tüm Seviyeler</option>
          <option value="beginner">Başlangıç</option>
          <option value="intermediate">Orta</option>
          <option value="advanced">İleri</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interviews.map((interview) => (
          <Link
            key={interview.id}
            href={`/interview/practice/${interview.id}`}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 transition border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{interview.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{interview.description}</p>
            <div className="flex gap-2 mb-4 flex-wrap">
              {interview.type && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded">
                  {interview.type}
                </span>
              )}
              {interview.difficulty && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded">
                  {interview.difficulty}
                </span>
              )}
              {interview.duration && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded">
                  {interview.duration} dk
                </span>
              )}
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition">
              Mülakata Başla
            </button>
          </Link>
        ))}
      </div>

      {interviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Mülakat bulunamadı</p>
        </div>
      )}
    </div>
  );
}

