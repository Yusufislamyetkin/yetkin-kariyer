"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Input } from "@/app/components/ui/Input";
import { ChevronDown } from "lucide-react";

interface CascadingFilterProps {
  onFilterChange: (filters: {
    expertise: string | null;
    topic: string | null;
    content: string | null;
  }) => void;
}

export function CascadingFilter({ onFilterChange }: CascadingFilterProps) {
  const [expertises, setExpertises] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [contents, setContents] = useState<string[]>([]);
  
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  
  const [loading, setLoading] = useState({
    expertises: true,
    topics: false,
    contents: false,
  });

  // Fetch expertises on mount
  useEffect(() => {
    fetchExpertises();
  }, []);

  // Fetch topics when expertise changes
  useEffect(() => {
    if (selectedExpertise) {
      fetchTopics(selectedExpertise);
      setSelectedTopic("");
      setSelectedContent("");
      setContents([]);
    } else {
      setTopics([]);
      setContents([]);
      setSelectedTopic("");
      setSelectedContent("");
    }
  }, [selectedExpertise]);

  // Fetch contents when topic changes
  useEffect(() => {
    if (selectedExpertise && selectedTopic) {
      fetchContents(selectedExpertise, selectedTopic);
      setSelectedContent("");
    } else {
      setContents([]);
      setSelectedContent("");
    }
  }, [selectedExpertise, selectedTopic]);

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange({
      expertise: selectedExpertise || null,
      topic: selectedTopic || null,
      content: selectedContent || null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpertise, selectedTopic, selectedContent]);

  const fetchExpertises = async () => {
    try {
      setLoading((prev) => ({ ...prev, expertises: true }));
      const response = await fetch("/api/education/expertises");
      const data = await response.json();
      setExpertises(data.expertises || []);
    } catch (error) {
      console.error("Error fetching expertises:", error);
    } finally {
      setLoading((prev) => ({ ...prev, expertises: false }));
    }
  };

  const fetchTopics = async (expertise: string) => {
    try {
      setLoading((prev) => ({ ...prev, topics: true }));
      const response = await fetch(`/api/education/topics?expertise=${encodeURIComponent(expertise)}`);
      const data = await response.json();
      setTopics(data.topics || []);
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading((prev) => ({ ...prev, topics: false }));
    }
  };

  const fetchContents = async (expertise: string, topic: string) => {
    try {
      setLoading((prev) => ({ ...prev, contents: true }));
      const response = await fetch(
        `/api/education/contents?expertise=${encodeURIComponent(expertise)}&topic=${encodeURIComponent(topic)}`
      );
      const data = await response.json();
      setContents(data.contents || []);
    } catch (error) {
      console.error("Error fetching contents:", error);
    } finally {
      setLoading((prev) => ({ ...prev, contents: false }));
    }
  };

  return (
    <Card variant="elevated" className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Uzmanlık Seçimi */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Uzmanlık
            </label>
            <div className="relative">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                disabled={loading.expertises}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Tüm Uzmanlıklar</option>
                {expertises.map((expertise) => (
                  <option key={expertise} value={expertise}>
                    {expertise}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Konu Seçimi */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Konu
            </label>
            <div className="relative">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                disabled={!selectedExpertise || loading.topics}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Tüm Konular</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Konu İçeriği Seçimi */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Konu İçeriği
            </label>
            <div className="relative">
              <select
                value={selectedContent}
                onChange={(e) => setSelectedContent(e.target.value)}
                disabled={!selectedTopic || loading.contents}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Tüm İçerikler</option>
                {contents.map((content) => (
                  <option key={content} value={content}>
                    {content}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

