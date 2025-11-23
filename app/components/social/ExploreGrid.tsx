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
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-400">Henüz gönderi yok</p>
      </div>
    );
  }

  // Filter posts with images only
  const postsWithImages = posts.filter((post) => post.imageUrl);

  if (postsWithImages.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 dark:text-gray-400">Henüz görsel içeren gönderi yok</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-full mx-auto">
      {postsWithImages.map((post) => (
        <div
          key={post.id}
          className="relative aspect-square bg-gray-100 dark:bg-gray-900 cursor-pointer group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          )}
          {/* Hover overlay with engagement stats */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end justify-center pb-4 gap-6 transition-opacity duration-300 ${
            hoveredPost === post.id 
              ? 'opacity-100' 
              : 'opacity-0 sm:opacity-0'
          } sm:group-hover:opacity-100`}>
            <div className="flex items-center gap-2 text-white drop-shadow-lg">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
              <span className="text-sm sm:text-base font-bold">{post.likesCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-white drop-shadow-lg">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
              <span className="text-sm sm:text-base font-bold">{post.commentsCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

