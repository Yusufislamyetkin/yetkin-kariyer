"use client";

import { useState, useEffect } from "react";
import { X, Linkedin, Loader2, Eye, Save, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface User {
  id: string;
  name: string | null;
  email: string;
  isBot: boolean;
  botCharacter: {
    id: string;
    name: string;
    persona: string;
    systemPrompt: string;
    expertise: string[] | null;
  } | null;
}

interface LinkedInPostGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  users?: User[];
}

export function LinkedInPostGenerator({
  isOpen,
  onClose,
  users = [],
}: LinkedInPostGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [postType, setPostType] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBotId, setSelectedBotId] = useState<string>("");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [saveAsPost, setSaveAsPost] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter bots from users
  const bots = users.filter((user) => user.isBot && user.botCharacter);

  useEffect(() => {
    if (isOpen && bots.length > 0 && !selectedBotId) {
      setSelectedBotId(bots[0].id);
    }
  }, [isOpen, bots, selectedBotId]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Lütfen bir konu girin");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedContent("");

    try {
      const response = await fetch("/api/admin/linkedin-post/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          postType,
          botId: selectedBotId || undefined,
          saveAsPost: false, // Don't save on generate, only on save
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Post oluşturulurken bir hata oluştu");
      }

      setGeneratedContent(data.content || "");
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedContent.trim()) {
      setError("Önce bir post oluşturun");
      return;
    }

    if (!selectedBotId) {
      setError("Post kaydetmek için bir bot seçmelisiniz");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/linkedin-post/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          postType,
          botId: selectedBotId,
          saveAsPost: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Post kaydedilirken bir hata oluştu");
      }

      // Reset form
      setGeneratedContent("");
      setTopic("");
      setSaveAsPost(false);
      
      // Close modal
      onClose();
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const postTypeOptions = [
    { value: 1, label: "Kişisel Hikaye/Tecrübe", description: "Samimi, öz eleştiri içeren, öğretici" },
    { value: 2, label: "Teknik Karşılaştırma/Trend", description: "Analitik, heyecanlı, karşılaştırmalı" },
    { value: 3, label: "Sektörel Eleştiri/Tavsiye", description: "Otoriter, çözüm odaklı" },
    { value: 4, label: "İlginç Teknoloji Haberi", description: "Merak uyandırıcı, hafif gizemli" },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                LinkedIn Post Oluşturucu
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Profesyonel LinkedIn gönderileri oluştur
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Konu *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Örn: Docker yerine Podman kullanımı"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Post konusunu girin
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Türü *
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={loading}
                >
                  {postTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bot Seçimi (Opsiyonel)
                </label>
                <select
                  value={selectedBotId}
                  onChange={(e) => setSelectedBotId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  disabled={loading || bots.length === 0}
                >
                  <option value="">Varsayılan Karakter</option>
                  {bots.map((bot) => (
                    <option key={bot.id} value={bot.id}>
                      {bot.name || bot.email} {bot.botCharacter?.name ? `(${bot.botCharacter.name})` : ""}
                    </option>
                  ))}
                </select>
                {bots.length === 0 && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Bot bulunamadı. Varsayılan karakter kullanılacak.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="saveAsPost"
                  checked={saveAsPost}
                  onChange={(e) => setSaveAsPost(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  disabled={loading || !selectedBotId}
                />
                <label htmlFor="saveAsPost" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Post&apos;u platforma kaydet (bot seçimi gerekli)
                </label>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Post Oluştur
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Önizleme
                </label>
                {generatedContent && (
                  <Button
                    onClick={handleSave}
                    disabled={saving || !selectedBotId}
                    variant="outline"
                    size="sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Kaydet
                      </>
                    )}
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 min-h-[400px]">
                {generatedContent ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-900 dark:text-gray-100 font-sans">
                      {generatedContent}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Post oluşturulduğunda burada görünecek</p>
                    </div>
                  </div>
                )}
              </div>

              {generatedContent && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Karakter sayısı: {generatedContent.length} / 2200
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <Button variant="outline" onClick={onClose} disabled={loading || saving}>
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}

