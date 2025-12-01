"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { BookOpen, Calendar, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Yazılım Geliştirmede En İyi Pratikler",
      excerpt: "Modern yazılım geliştirme süreçlerinde dikkat edilmesi gereken önemli noktalar ve best practice'ler.",
      author: "Ahmet Yılmaz",
      date: "15 Ocak 2024",
      category: "Geliştirme",
    },
    {
      id: 2,
      title: "AI Destekli Öğrenme ile Kariyerinizi Geliştirin",
      excerpt: "Yapay zeka teknolojilerinin eğitim ve kariyer gelişiminde nasıl kullanılabileceğini keşfedin.",
      author: "Ayşe Demir",
      date: "10 Ocak 2024",
      category: "Kariyer",
    },
    {
      id: 3,
      title: "Hackathon'lara Katılmak İçin 5 Neden",
      excerpt: "Hackathon'ların kariyerinize ve teknik becerilerinize katkılarını öğrenin.",
      author: "Mehmet Kaya",
      date: "5 Ocak 2024",
      category: "Etkinlikler",
    },
    {
      id: 4,
      title: "Full Stack Developer Olmak İçin Yol Haritası",
      excerpt: "Full stack developer olmak için izlemeniz gereken adımlar ve öğrenmeniz gereken teknolojiler.",
      author: "Zeynep Öz",
      date: "1 Ocak 2024",
      category: "Eğitim",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            <BookOpen className="w-10 h-10" />
            Blog
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Yazılım geliştirme, kariyer ve teknoloji hakkında güncel içerikler
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                >
                  Devamını Oku
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Blog Yazarlarımıza Katılın
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Deneyimlerinizi paylaşmak ve topluluğa katkıda bulunmak ister misiniz?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              İletişime Geç
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

