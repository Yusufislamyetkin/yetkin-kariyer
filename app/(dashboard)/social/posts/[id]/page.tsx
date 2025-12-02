"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Loader2, Heart, Bookmark, MoreHorizontal, Trash2, Flag } from "lucide-react";
import { CommentSection } from "@/app/components/social/CommentSection";
import { Button } from "@/app/components/ui/Button";

interface Post {
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
  comments: Array<{
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
}

export default function PostDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Post["comments"]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isOwner = post ? post.userId === session?.user?.id : false;

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
    if (!post || !confirm("Bu gönderiyi silmek istediğinize emin misiniz?")) {
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

      router.back();
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

  const fetchPost = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}`);

      if (!response.ok) {
        throw new Error("Gönderi yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setPost(data);
      setIsLiked(data.isLiked);
      setIsSaved(data.isSaved);
      setLikesCount(data.likesCount);
      setComments(data.comments || []);
      setCommentsCount(data.commentsCount);
    } catch (error: any) {
      setError(error.message || "Gönderi yüklenirken bir hata oluştu");
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId, session, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchPost();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, fetchPost, router]);

  const handleLike = useCallback(async () => {
    if (isLiking || !post) return;
    setIsLiking(true);
    const previousLiked = isLiked;
    const previousCount = likesCount;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(previousLiked ? likesCount - 1 : likesCount + 1);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Beğeni işlemi başarısız");
      }

      const data = await response.json();
      setIsLiked(data.liked);
      setLikesCount(data.likesCount);
    } catch (error) {
      // Revert on error
      setIsLiked(previousLiked);
      setLikesCount(previousCount);
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  }, [postId, isLiked, likesCount, isLiking, post]);

  const handleSave = useCallback(async () => {
    if (isSaving || !post) return;
    setIsSaving(true);
    const previousSaved = isSaved;

    // Optimistic update
    setIsSaved(!isSaved);

    try {
      const response = await fetch(`/api/posts/${postId}/save`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Kaydetme işlemi başarısız");
      }

      const data = await response.json();
      setIsSaved(data.saved);
    } catch (error) {
      // Revert on error
      setIsSaved(previousSaved);
      console.error("Error saving post:", error);
    } finally {
      setIsSaving(false);
    }
  }, [postId, isSaved, isSaving, post]);

  const handleComment = useCallback(
    async (content: string) => {
      if (isCommenting || !post) return;
      setIsCommenting(true);

      try {
        const response = await fetch(`/api/posts/${postId}/comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        });

        if (!response.ok) {
          throw new Error("Yorum oluşturulurken bir hata oluştu");
        }

        const data = await response.json();
        // Replace temp comment with real one
        setComments((prev) => {
          const withoutTemp = prev.filter((c) => !c.id.startsWith("temp-"));
          return [data.comment, ...withoutTemp];
        });
        setCommentsCount(data.commentsCount);
      } catch (error) {
        console.error("Error commenting:", error);
        throw error;
      } finally {
        setIsCommenting(false);
      }
    },
    [postId, isCommenting, post]
  );

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        const response = await fetch(
          `/api/posts/${postId}/comments/${commentId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Yorum silinirken bir hata oluştu");
        }

        const data = await response.json();
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setCommentsCount(data.commentsCount);
      } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
      }
    },
    [postId]
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa] dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#0095f6]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-500 mb-4">
            {error || "Gönderi bulunamadı"}
          </p>
          <Button onClick={() => router.back()} variant="outline">
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black pt-[72px] lg:pt-0">
      {/* Mobile: Full page, Desktop: Modal-like */}
      <div className="lg:fixed lg:inset-0 lg:flex lg:items-center lg:justify-center lg:bg-black/50 lg:p-4 lg:z-40">
        <div className={`bg-white dark:bg-black lg:rounded-lg ${(post.imageUrl || post.videoUrl) ? 'lg:max-w-5xl' : 'lg:max-w-3xl'} lg:max-h-[90vh] lg:w-full lg:overflow-hidden lg:flex`}>
          {/* Close button - Desktop */}
          <button
            onClick={() => router.back()}
            className="hidden lg:block absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Mobile header */}
          <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-[#dbdbdb] dark:border-[#383838]">
            <button onClick={() => router.back()}>
              <X className="w-6 h-6 text-[#262626] dark:text-[#fafafa]" />
            </button>
            <h2 className="text-lg font-semibold text-[#262626] dark:text-[#fafafa]">
              Gönderi
            </h2>
            <div className="w-6" />
          </div>

          {/* Video - Reels Style */}
          {post.videoUrl && (
            <div className="lg:w-1/2 lg:flex-shrink-0 relative aspect-[9/16] lg:aspect-[9/16] lg:h-[90vh] bg-black flex items-center justify-center">
              <video
                src={post.videoUrl}
                controls
                className="w-full h-full object-contain"
                loop
                muted
                playsInline
              />
            </div>
          )}

          {/* Image - Left side (Desktop) or top (Mobile) - Only show if imageUrl exists and no video */}
          {post.imageUrl && !post.videoUrl && (
            <div className="lg:w-1/2 lg:flex-shrink-0 relative aspect-square lg:aspect-auto lg:h-[90vh] bg-gray-100 dark:bg-gray-900">
              <Image
                src={post.imageUrl}
                alt={post.content || "Post image"}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          )}

          {/* Content - Right side (Desktop) or bottom (Mobile) */}
          <div className={`${(post.imageUrl || post.videoUrl) ? 'lg:w-1/2' : 'lg:w-full'} lg:flex lg:flex-col lg:h-[90vh]`}>
            {/* User info */}
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-[#dbdbdb] dark:border-[#383838]">
              <div className="flex items-center gap-3">
                <Link href={`/profile/${post.userId}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    {post.user.profileImage ? (
                      <Image
                        src={post.user.profileImage}
                        alt={post.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {(post.user.name || "K")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <Link
                  href={`/profile/${post.userId}`}
                  className="text-sm font-semibold text-[#262626] dark:text-[#fafafa] hover:opacity-70 transition-opacity"
                >
                  {post.user.name || "Kullanıcı"}
                </Link>
              </div>
              <div className="relative">
                <button
                  ref={buttonRef}
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:opacity-70 transition-opacity"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="w-5 h-5 text-[#262626] dark:text-[#fafafa]" />
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
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        {isDeleting ? "Siliniyor..." : "Sil"}
                      </button>
                    ) : (
                      <button
                        onClick={handleReport}
                        className="w-full px-4 py-3 text-left text-sm font-semibold text-[#262626] dark:text-[#fafafa] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                      >
                        <Flag className="w-4 h-4" />
                        Şikayet Et
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Comments section - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
                {/* Caption */}
                {post.content && (
                  <div className="mb-4">
                    <Link
                      href={`/profile/${post.userId}`}
                      className="text-sm font-semibold text-[#262626] dark:text-[#fafafa] hover:opacity-70 transition-opacity mr-2"
                    >
                      {post.user.name || "Kullanıcı"}
                    </Link>
                    <span className="text-sm text-[#262626] dark:text-[#fafafa] whitespace-pre-wrap break-words">
                      {post.content}
                    </span>
                  </div>
                )}

                {/* Actions - Like and Save buttons */}
                <div className="mb-3 pb-3 border-b border-[#dbdbdb] dark:border-[#383838]">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className="p-0 hover:opacity-70 transition-opacity disabled:opacity-50"
                      >
                        {isLiked ? (
                          <Heart className="w-6 h-6 text-[#ed4956] fill-[#ed4956]" />
                        ) : (
                          <Heart className="w-6 h-6 text-[#262626] dark:text-[#fafafa]" />
                        )}
                      </button>
                      {likesCount > 0 && (
                        <span className="text-sm font-semibold text-[#262626] dark:text-[#fafafa]">
                          {likesCount.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1" />
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="p-0 hover:opacity-70 transition-opacity disabled:opacity-50"
                    >
                      {isSaved ? (
                        <Bookmark className="w-6 h-6 text-[#262626] dark:text-[#fafafa] fill-[#262626] dark:fill-[#fafafa]" />
                      ) : (
                        <Bookmark className="w-6 h-6 text-[#262626] dark:text-[#fafafa]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Comments - Using CommentSection component (list only) */}
                <CommentSection
                  comments={comments}
                  currentUserId={session?.user?.id || ""}
                  onDeleteComment={handleDeleteComment}
                  isLoading={isCommenting}
                  showForm={false}
                />
              </div>
            </div>

            {/* Comment form - Fixed at bottom */}
            <div className="border-t border-[#dbdbdb] dark:border-[#383838] bg-white dark:bg-black">
              <div className="px-3 sm:px-4 py-2.5 sm:py-3">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const content = formData.get("comment") as string;
                    if (!content?.trim() || isCommenting) return;
                    
                    const commentText = content.trim();
                    e.currentTarget.reset();
                    
                    // Reset textarea height
                    const textarea = e.currentTarget.querySelector('textarea');
                    if (textarea) {
                      textarea.style.height = 'auto';
                    }
                    
                    // Optimistic update
                    const tempId = `temp-${Date.now()}`;
                    const optimisticComment = {
                      id: tempId,
                      userId: session?.user?.id || "",
                      content: commentText,
                      createdAt: new Date().toISOString(),
                      user: {
                        id: session?.user?.id || "",
                        name: session?.user?.name || null,
                        profileImage: session?.user?.image || null,
                      },
                    };
                    setComments((prev) => [optimisticComment, ...prev]);
                    setCommentsCount((prev) => prev + 1);
                    
                    try {
                      await handleComment(commentText);
                    } catch (error) {
                      // Revert on error
                      setComments((prev) => prev.filter((c) => c.id !== tempId));
                      setCommentsCount((prev) => prev - 1);
                    }
                  }}
                  className="flex items-end gap-2 sm:gap-3"
                >
                  <div className="flex-1 min-w-0 flex items-end gap-2">
                    <textarea
                      name="comment"
                      placeholder="Yorum ekle..."
                      className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-transparent border-0 focus:ring-0 focus:outline-none px-0 py-2.5 text-sm sm:text-base text-[#262626] dark:text-[#fafafa] placeholder:text-[#8e8e8e] dark:placeholder:text-[#8e8e8e] leading-relaxed"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.form?.requestSubmit();
                        }
                      }}
                      disabled={isCommenting}
                      maxLength={1000}
                      rows={1}
                      style={{
                        height: "auto",
                        minHeight: "44px",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isCommenting}
                    className="text-sm sm:text-base font-semibold text-[#0095f6] hover:text-[#0085e5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 sm:px-3 py-1.5 sm:py-2 whitespace-nowrap flex-shrink-0"
                  >
                    {isCommenting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">Gönderiliyor...</span>
                      </span>
                    ) : (
                      "Paylaş"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

