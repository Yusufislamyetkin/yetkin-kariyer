"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Plus } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { StoryCreate } from "./StoryCreate";

interface StoryUser {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
}

interface Story {
  id: string;
  imageUrl: string;
  videoUrl: string | null;
  expiresAt: string;
  createdAt: string;
  isViewed: boolean;
}

interface StoriesGroup {
  user: StoryUser;
  stories: Story[];
}

export function StoriesBar() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<StoriesGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<StoriesGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchStories();
    }
  }, [session?.user?.id]);

  const fetchStories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/stories");
      if (response.ok) {
        const data = await response.json();
        setStories(data.stories || []);
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoryClick = (storyGroup: StoriesGroup) => {
    setSelectedStoryGroup(storyGroup);
  };

  const handleStoryClose = () => {
    setSelectedStoryGroup(null);
    fetchStories(); // Refresh to update viewed status
  };

  const handleStoryCreated = () => {
    setShowCreateModal(false);
    fetchStories();
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-lg mb-6">
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="w-[72px] h-[72px] rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
              <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-lg overflow-hidden">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {/* Create Story Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-600 group-hover:border-gray-400 dark:group-hover:border-gray-500 transition-colors shadow-md">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[72px] font-semibold">
              Hikayen
            </span>
          </button>

          {/* User Stories */}
          {stories.map((storyGroup) => {
            const hasUnviewed = storyGroup.stories.some((s) => !s.isViewed);

            return (
              <button
                key={storyGroup.user.id}
                onClick={() => handleStoryClick(storyGroup)}
                className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`relative w-[72px] h-[72px] rounded-full ${
                    hasUnviewed
                      ? "p-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 shadow-lg"
                      : "border-2 border-gray-300 dark:border-gray-600 shadow-md"
                  }`}
                >
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-900">
                    {storyGroup.user.profileImage ? (
                      <Image
                        src={storyGroup.user.profileImage}
                        alt={storyGroup.user.name || storyGroup.user.email}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                        {(storyGroup.user.name || storyGroup.user.email)[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[72px] font-semibold">
                  {storyGroup.user.name || storyGroup.user.email.split("@")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedStoryGroup && (
        <StoryViewer
          storyGroup={selectedStoryGroup}
          onClose={handleStoryClose}
        />
      )}

      {showCreateModal && (
        <StoryCreate
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleStoryCreated}
        />
      )}
    </>
  );
}

