"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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

interface StoryViewerProps {
  storyGroup: StoriesGroup;
  onClose: () => void;
}

export function StoryViewer({ storyGroup, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewMarkedRef = useRef(false);

  const currentStory = storyGroup.stories[currentStoryIndex];
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    if (!isPaused && currentStory) {
      // Mark as viewed
      if (!viewMarkedRef.current && !currentStory.isViewed) {
        fetch(`/api/stories/${currentStory.id}/view`, { method: "POST" });
        viewMarkedRef.current = true;
      }

      // Progress bar
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / STORY_DURATION) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          handleNext();
        }
      }, 50);
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentStoryIndex, isPaused, currentStory]);

  const handleNext = () => {
    if (currentStoryIndex < storyGroup.stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
      viewMarkedRef.current = false;
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
      viewMarkedRef.current = false;
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  if (!currentStory) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex gap-1">
          {storyGroup.stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden"
            >
              <div
                className={`h-full ${
                  index < currentStoryIndex
                    ? "bg-white"
                    : index === currentStoryIndex
                    ? "bg-white"
                    : "bg-gray-600"
                } transition-all duration-75`}
                style={{
                  width:
                    index === currentStoryIndex
                      ? `${progress}%`
                      : index < currentStoryIndex
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-12 left-0 right-0 p-4 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {storyGroup.user.profileImage ? (
              <Image
                src={storyGroup.user.profileImage}
                alt={storyGroup.user.name || storyGroup.user.email}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {(storyGroup.user.name || storyGroup.user.email)[0].toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-white font-semibold text-sm">
            {storyGroup.user.name || storyGroup.user.email.split("@")[0]}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:opacity-70 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Story Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Image
          src={currentStory.imageUrl}
          alt="Story"
          fill
          className="object-contain"
          priority
          onMouseDown={handlePause}
          onMouseUp={handleResume}
          onTouchStart={handlePause}
          onTouchEnd={handleResume}
        />
      </div>

      {/* Navigation */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-10"
        disabled={currentStoryIndex === 0}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:opacity-70 transition-opacity z-10"
        disabled={currentStoryIndex === storyGroup.stories.length - 1}
      >
        <ChevronRight className="w-8 h-8" />
      </button>
    </div>
  );
}

