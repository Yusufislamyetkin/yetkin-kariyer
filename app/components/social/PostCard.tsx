"use client";

import { useState, memo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreHorizontal,
  Bookmark,
  Trash2,
  Flag,
} from "lucide-react";
import { SharePostModal } from "./SharePostModal";
import { SendPostModal } from "./SendPostModal";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface PostCardProps {
  post: {
    id: string;
    userId: string;
    content: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
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
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const networkTypeRef = useRef<string>("4g");

  const isOwner = post.userId === currentUserId;

  // Detect network connection type
  useEffect(() => {
    if (typeof navigator !== "undefined" && "connection" in navigator) {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        networkTypeRef.current = connection.effectiveType || "4g";
        const handleConnectionChange = () => {
          networkTypeRef.current = connection.effectiveType || "4g";
        };
        connection.addEventListener("change", handleConnectionChange);
        return () => connection.removeEventListener("change", handleConnectionChange);
      }
    }
  }, []);

  // Intersection Observer for video lazy loading with network-aware optimization
  useEffect(() => {
    if (!post.videoUrl || !videoContainerRef.current) return;

    // Adjust rootMargin based on network speed
    const rootMargin = networkTypeRef.current === "slow-2g" || networkTypeRef.current === "2g" 
      ? "0px" // Don't preload on slow connections
      : networkTypeRef.current === "3g" 
      ? "25px" // Less aggressive preloading on 3g
      : "50px"; // Normal preloading on 4g

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            setVideoError(false);
            // Load and play video when visible
            if (videoRef.current) {
              setIsVideoLoading(true);
              videoRef.current.load();
              
              // Throttle play to avoid multiple rapid calls
              if (playTimeoutRef.current) {
                clearTimeout(playTimeoutRef.current);
              }
              playTimeoutRef.current = setTimeout(() => {
                if (videoRef.current && entry.isIntersecting) {
                  videoRef.current.play().catch(() => {
                    // Autoplay was prevented, user interaction required
                    setIsVideoLoading(false);
                  });
                }
              }, 100);
            }
          } else {
            setIsVideoVisible(false);
            setVideoCanPlay(false);
            // Pause and unload video when not visible to free memory
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.currentTime = 0;
              // Unload video source to free memory
              videoRef.current.src = "";
              videoRef.current.load();
            }
            if (playTimeoutRef.current) {
              clearTimeout(playTimeoutRef.current);
            }
          }
        });
      },
      {
        rootMargin,
        threshold: 0.1, // Trigger when 10% of video is visible
      }
    );

    observer.observe(videoContainerRef.current);

    return () => {
      observer.disconnect();
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, [post.videoUrl]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    if (!confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gönderi silinirken bir hata oluştu");
      }

      // Reload the page or remove the post from the list
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Gönderi silinirken bir hata oluştu");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleReport = () => {
    alert("Şikayet özelliği yakında eklenecek.");
    setShowMenu(false);
  };

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

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${post.userId}`} className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-100 dark:ring-gray-800">
              {post.user.profileImage ? (
                <Image
                  src={post.user.profileImage}
                  alt={post.user.name || post.user.email}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  sizes="48px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                  {(post.user.name || post.user.email)[0].toUpperCase()}
                </div>
              )}
            </div>
          </Link>
          <Link
            href={`/profile/${post.userId}`}
            className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity"
          >
            {post.user.name || post.user.email.split("@")[0]}
          </Link>
        </div>
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Daha fazla seçenek"
            disabled={isDeleting}
          >
            <MoreHorizontal className="w-7 h-7 text-gray-900 dark:text-gray-100" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {isOwner ? (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-4 py-3 text-left text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-5 h-5" />
                  {isDeleting ? "Siliniyor..." : "Sil"}
                </button>
              ) : (
                <button
                  onClick={handleReport}
                  className="w-full px-4 py-3 text-left text-base font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Flag className="w-5 h-5" />
                  Şikayet Et
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video - Reels Style */}
      {post.videoUrl && (
        <div className="relative w-full bg-black" ref={videoContainerRef}>
          <div className="relative w-full max-w-md mx-auto" style={{ aspectRatio: '9/16', maxHeight: '800px' }}>
            <video
              ref={videoRef}
              src={isVideoVisible ? post.videoUrl : undefined}
              className="w-full h-full object-contain"
              loop
              muted
              playsInline
              preload="none"
              onPlay={() => {
                setIsVideoPlaying(true);
                setIsVideoLoading(false);
              }}
              onPause={() => setIsVideoPlaying(false)}
              onWaiting={() => setIsVideoLoading(true)}
              onCanPlay={() => {
                setVideoCanPlay(true);
                setIsVideoLoading(false);
              }}
              onCanPlayThrough={() => {
                setVideoCanPlay(true);
                setIsVideoLoading(false);
              }}
              onLoadedMetadata={() => {
                setIsVideoLoading(false);
                // Auto-play when video is loaded and visible
                if (videoRef.current && isVideoVisible && !videoError) {
                  videoRef.current.play().catch(() => {
                    // Autoplay was prevented, user interaction required
                    setIsVideoLoading(false);
                  });
                }
              }}
              onLoadStart={() => setIsVideoLoading(true)}
              onError={(e) => {
                console.error("Video error:", e);
                setVideoError(true);
                setIsVideoLoading(false);
                // Retry loading after 2 seconds
                setTimeout(() => {
                  if (videoRef.current && isVideoVisible && !isVideoPlaying) {
                    setVideoError(false);
                    videoRef.current.load();
                  }
                }, 2000);
              }}
              onProgress={() => {
                // Check if enough data is buffered
                if (videoRef.current) {
                  const buffered = videoRef.current.buffered;
                  if (buffered.length > 0) {
                    const bufferedEnd = buffered.end(buffered.length - 1);
                    const currentTime = videoRef.current.currentTime;
                    const duration = videoRef.current.duration;
                    // If buffered enough (at least 2 seconds ahead or 10% of video), reduce loading state
                    if (bufferedEnd - currentTime > 2 || (duration > 0 && bufferedEnd / duration > 0.1)) {
                      setIsVideoLoading(false);
                    }
                  }
                }
              }}
            />
            
            {/* Loading Spinner */}
            {isVideoLoading && isVideoVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {/* Error State */}
            {videoError && isVideoVisible && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                <div className="text-center text-white px-4">
                  <p className="text-sm mb-2">Video yüklenirken bir hata oluştu</p>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      if (videoRef.current) {
                        videoRef.current.load();
                      }
                    }}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                  >
                    Tekrar Dene
                  </button>
                </div>
              </div>
            )}

            {/* Play/Pause Overlay */}
            <button
              onClick={() => {
                if (videoRef.current && !videoError) {
                  if (isVideoPlaying) {
                    videoRef.current.pause();
                  } else {
                    setIsVideoLoading(true);
                    videoRef.current.play().catch(() => {
                      setIsVideoLoading(false);
                    });
                  }
                }
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors z-10"
              aria-label={isVideoPlaying ? "Duraklat" : "Oynat"}
              disabled={videoError}
            >
              {!isVideoPlaying && !isVideoLoading && !videoError && (
                <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Image */}
      {post.imageUrl && !post.videoUrl && (
        <div className="relative w-full bg-gray-100 dark:bg-gray-950">
          <div className="relative w-full" style={{ height: '800px', minHeight: '500px', maxHeight: '1200px' }}>
            <Image
              src={post.imageUrl}
              alt={post.content || "Post image"}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 800px, 1200px"
              loading="lazy"
              priority={false}
            />
          </div>
        </div>
      )}

      {/* Content Only - LinkedIn Style */}
      {!post.imageUrl && !post.videoUrl && post.content && (
        <div className="px-6 py-6 bg-white dark:bg-gray-900">
          <div className="text-lg leading-relaxed text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words font-normal">
            {post.content}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-5">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className="hover:opacity-70 transition-opacity disabled:opacity-50 p-1"
              aria-label={isLiked ? "Beğenmekten vazgeç" : "Beğen"}
            >
              <Heart
                className={`w-7 h-7 ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              />
            </button>
            <button
              onClick={() => onCommentClick?.(post.id)}
              className="hover:opacity-70 transition-opacity p-1"
              aria-label="Yorum yap"
            >
              <MessageCircle className="w-7 h-7 text-gray-900 dark:text-gray-100" />
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="hover:opacity-70 transition-opacity p-1"
              aria-label="Paylaş"
            >
              <Share2 className="w-7 h-7 text-gray-900 dark:text-gray-100" />
            </button>
            <button
              onClick={() => setShowSendModal(true)}
              className="hover:opacity-70 transition-opacity p-1"
              aria-label="Gönder"
            >
              <Send className="w-7 h-7 text-gray-900 dark:text-gray-100" />
            </button>
          </div>
          <button
            onClick={() => onSave?.(post.id)}
            className="hover:opacity-70 transition-opacity p-1"
            aria-label={post.isSaved ? "Kaydettiklerinden çıkar" : "Kaydet"}
          >
            <Bookmark
              className={`w-7 h-7 ${
                post.isSaved
                  ? "fill-gray-900 dark:fill-gray-100 text-gray-900 dark:text-gray-100"
                  : "text-gray-900 dark:text-gray-100"
              }`}
            />
          </button>
        </div>

        {/* Likes count */}
        {likesCount > 0 && (
          <div className="mb-2">
            <button
              onClick={() => onCommentClick?.(post.id)}
              className="text-base font-semibold text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity"
            >
              {likesCount.toLocaleString()} beğeni
            </button>
          </div>
        )}

        {/* Caption - Only show if there's an image or video (for media posts) */}
        {(post.imageUrl || post.videoUrl) && post.content && (
          <div className="mb-2">
            <span className="text-base leading-relaxed">
              <Link
                href={`/profile/${post.userId}`}
                className="font-semibold text-gray-900 dark:text-gray-100 hover:opacity-70 mr-2 transition-opacity"
              >
                {post.user.name || post.user.email.split("@")[0]}
              </Link>
              <span className="text-gray-900 dark:text-gray-100">
                {post.content}
              </span>
            </span>
          </div>
        )}

        {/* View all comments */}
        {post.commentsCount > 0 && (
          <button
            onClick={() => onCommentClick?.(post.id)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2 transition-colors font-medium"
          >
            {post.commentsCount} yorumun tümünü gör
          </button>
        )}

        {/* Time ago */}
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium mt-3">
          {timeAgo}
        </div>
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
          postVideoUrl={post.videoUrl}
          onClose={() => setShowSendModal(false)}
        />
      )}
    </div>
  );
});

