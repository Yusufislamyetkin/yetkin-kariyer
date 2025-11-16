"use client";

import { useState, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Send,
  MoreHorizontal,
} from "lucide-react";
import { SharePostModal } from "./SharePostModal";
import { SendPostModal } from "./SendPostModal";

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    content: string | null;
    imageUrl: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
      profileImage: string | null;
    };
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isSaved: boolean;
    comments?: Array<{
      id: string;
      userId: string;
      content: string;
      createdAt: string;
      user: {
        id: string;
        name: string | null;
        profileImage: string | null;
      };
    }>;
  };
  onLike?: (postId: string) => Promise<void>;
  onSave?: (postId: string) => Promise<void>;
  onCommentClick?: (postId: string) => void;
  currentUserId: string;
}

export const PostCard = memo(function PostCard({
  post,
  onLike,
  onSave,
  onCommentClick,
  currentUserId,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const handleLike = async () => {
    if (isLiking || !onLike) return;
    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(previousLiked ? likesCount - 1 : likesCount + 1);

    try {
      await onLike(post.id);
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1d1d1d] border border-gray-200 dark:border-gray-800 rounded-lg mb-3 max-w-[800px] w-full mx-auto overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.userId}`} className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              {post.user.profileImage ? (
                <Image
                  src={post.user.profileImage}
                  alt={post.user.name || post.user.email}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized={post.user.profileImage?.includes('blob.vercel-storage.com')}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#0a66c2] to-[#0073b1] flex items-center justify-center text-white text-sm font-semibold">
                  {(post.user.name || post.user.email)[0].toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.userId}`}
              className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#0a66c2] dark:hover:text-[#70b5f9] transition-colors"
            >
              {post.user.name || post.user.email.split("@")[0]}
            </Link>
          </div>
        </div>
        <button 
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Daha fazla seçenek"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
            {post.content}
          </p>
        </div>
      )}

      {/* Image - Only show if imageUrl exists */}
      {post.imageUrl && (
        <div className="relative w-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
          <div className="relative w-full max-h-[600px] sm:max-h-[700px] flex items-center justify-center">
            <Image
              src={post.imageUrl}
              alt={post.content || "Post image"}
              width={800}
              height={600}
              className="w-full h-auto max-h-[600px] sm:max-h-[700px] object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority={false}
              unoptimized={post.imageUrl.includes('blob.vercel-storage.com')}
              onError={(e) => {
                console.error("Image load error:", post.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-2 sm:px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-around sm:justify-between gap-1 sm:gap-0">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-center"
            aria-label={isLiked ? "Beğenmekten vazgeç" : "Beğen"}
          >
            <ThumbsUp className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'text-[#0a66c2] dark:text-[#70b5f9] fill-[#0a66c2] dark:fill-[#70b5f9]' : ''}`} />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Beğen</span>
          </button>
          <button
            onClick={() => onCommentClick?.(post.id)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-center"
            aria-label="Yorum yap"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Yorum</span>
          </button>
          <button 
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-center"
            aria-label="Paylaş"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Paylaş</span>
          </button>
          <button 
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-700 dark:text-gray-300 flex-1 sm:flex-initial justify-center"
            aria-label="Gönder"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline">Gönder</span>
          </button>
        </div>

        {/* Engagement stats */}
        {(likesCount > 0 || post.commentsCount > 0) && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
            {likesCount > 0 && (
              <button
                onClick={() => onCommentClick?.(post.id)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                {likesCount.toLocaleString()} beğeni
              </button>
            )}
            {likesCount > 0 && post.commentsCount > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400 mx-1">·</span>
            )}
            {post.commentsCount > 0 && (
              <button
                onClick={() => onCommentClick?.(post.id)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
              >
                {post.commentsCount} yorum
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showShareModal && (
        <SharePostModal
          postId={post.id}
          postUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/social/posts/${post.id}`}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSendModal && (
        <SendPostModal
          postId={post.id}
          postContent={post.content}
          postImageUrl={post.imageUrl}
          onClose={() => setShowSendModal(false)}
        />
      )}
    </div>
  );
});

