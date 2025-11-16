"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";

interface Post {
  id: string;
  imageUrl: string | null;
  likesCount: number;
  commentsCount: number;
}

interface ExploreGridProps {
  posts: Post[];
  onPostClick: (postId: string) => void;
}

export function ExploreGrid({ posts, onPostClick }: ExploreGridProps) {
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#8e8e8e]">Henüz gönderi yok</p>
      </div>
    );
  }

  // Filter posts with images only
  const postsWithImages = posts.filter((post) => post.imageUrl);

  if (postsWithImages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#8e8e8e]">Henüz görsel içeren gönderi yok</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2 max-w-[935px] mx-auto">
      {postsWithImages.map((post) => (
        <div
          key={post.id}
          className="relative aspect-square bg-gray-100 dark:bg-gray-900 cursor-pointer group overflow-hidden"
          onClick={() => onPostClick(post.id)}
          onMouseEnter={() => setHoveredPost(post.id)}
          onMouseLeave={() => setHoveredPost(null)}
          onTouchStart={() => setHoveredPost(post.id)}
        >
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt="Post"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
            />
          )}
          {/* Show on touch/hover - always visible on mobile with lower opacity */}
          <div className={`absolute inset-0 bg-black/20 sm:bg-black/40 flex items-center justify-center gap-2 sm:gap-6 transition-opacity ${
            hoveredPost === post.id 
              ? 'opacity-100' 
              : 'opacity-100 sm:opacity-0'
          } sm:group-hover:opacity-100`}>
            <div className="flex items-center gap-1 sm:gap-2 text-white drop-shadow-lg">
              <Heart className="w-3.5 h-3.5 sm:w-6 sm:h-6 fill-white" />
              <span className="text-[10px] sm:text-sm font-semibold">{post.likesCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-white drop-shadow-lg">
              <MessageCircle className="w-3.5 h-3.5 sm:w-6 sm:h-6 fill-white" />
              <span className="text-[10px] sm:text-sm font-semibold">{post.commentsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

