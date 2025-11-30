"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  id: string;
  imageUrl: string | null;
  videoUrl: string | null;
  likesCount: number;
  commentsCount: number;
}

interface ProfileGridProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

export function ProfileGrid({ posts, onPostClick }: ProfileGridProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">Henüz gönderi yok</p>
      </div>
    );
  }

  // Filter posts with images or videos
  const postsWithMedia = posts.filter((post) => post.imageUrl || post.videoUrl);

  if (postsWithMedia.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">Henüz medya içeren gönderi yok</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-full mx-auto">
      {postsWithMedia.map((post) => (
        <div
          key={post.id}
          className="relative aspect-square bg-gray-100 dark:bg-gray-900 cursor-pointer group overflow-hidden rounded-lg"
          onClick={() => onPostClick(post.id)}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
        >
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt="Post"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          )}
          {post.videoUrl && !post.imageUrl && (
            <video
              src={post.videoUrl}
              className="w-full h-full object-cover"
              muted
              playsInline
              preload="metadata"
            />
          )}
          {post.videoUrl && (
            <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}
          {hoveredPost === post.id && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-6 transition-opacity">
              <div className="flex items-center gap-2 text-white">
                <Heart className="w-6 h-6 fill-white" />
                <span className="text-sm font-semibold">{post.likesCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="w-6 h-6 fill-white" />
                <span className="text-sm font-semibold">{post.commentsCount.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

