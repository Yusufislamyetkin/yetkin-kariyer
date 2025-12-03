"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { BottomSheet } from "@/app/components/ui/BottomSheet";
import { CommentSection } from "@/app/components/social/CommentSection";
import { Loader2, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

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
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    profileImage: string | null;
  };
}

interface CommentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

export function CommentBottomSheet({
  isOpen,
  onClose,
  postId,
  onCommentAdded,
  onCommentDeleted,
}: CommentBottomSheetProps) {
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Fetch post and comments when sheet opens
  useEffect(() => {
    if (isOpen && postId) {
      fetchPostAndComments();
    } else {
      // Reset state when closed
      setPost(null);
      setComments([]);
      setError(null);
    }
  }, [isOpen, postId]);

  // Scroll to bottom when new comment is added
  useEffect(() => {
    if (comments.length > 0 && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length]);

  const fetchPostAndComments = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}`);

      if (!response.ok) {
        throw new Error("Gönderi yüklenirken bir hata oluştu");
      }

      const data = await response.json();
      setPost(data);
      setComments(data.comments || []);
    } catch (error: any) {
      setError(error.message || "Gönderi yüklenirken bir hata oluştu");
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const handleComment = useCallback(
    async (content: string) => {
      if (isCommenting || !post) return;
      setIsCommenting(true);

      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const optimisticComment: Comment = {
        id: tempId,
        userId: session?.user?.id || "",
        content: content.trim(),
        createdAt: new Date().toISOString(),
        user: {
          id: session?.user?.id || "",
          name: session?.user?.name || null,
          profileImage: session?.user?.image || null,
        },
      };
      setComments((prev) => [optimisticComment, ...prev]);
      setPost((prev) =>
        prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null
      );

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
        setPost((prev) =>
          prev
            ? { ...prev, commentsCount: data.commentsCount }
            : null
        );

        onCommentAdded?.();
      } catch (error) {
        // Revert on error
        setComments((prev) => prev.filter((c) => c.id !== tempId));
        setPost((prev) =>
          prev
            ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }
            : null
        );
        console.error("Error commenting:", error);
        alert("Yorum eklenirken bir hata oluştu");
      } finally {
        setIsCommenting(false);
      }
    },
    [postId, isCommenting, post, session, onCommentAdded]
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
        setPost((prev) =>
          prev
            ? { ...prev, commentsCount: data.commentsCount }
            : null
        );

        onCommentDeleted?.();
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Yorum silinirken bir hata oluştu");
      }
    },
    [postId, onCommentDeleted]
  );

  const timeAgo = post
    ? formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: tr,
      })
    : "";

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="!p-0">
      <div className="flex flex-col h-full" style={{ maxHeight: "85vh" }}>
        {/* Post Preview Header */}
        {post && (
          <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-800 px-6 pt-4 pb-4">
            <div className="flex items-start gap-3">
              <Link href={`/profile/${post.userId}`}>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                  {post.user.profileImage ? (
                    <Image
                      src={post.user.profileImage}
                      alt={post.user.name || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {(post.user.name || "K")[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    href={`/profile/${post.userId}`}
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity"
                  >
                    {post.user.name || "Kullanıcı"}
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {timeAgo}
                  </span>
                </div>
                {post.content && (
                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 break-words">
                    {post.content}
                  </p>
                )}
                {(post.imageUrl || post.videoUrl) && (
                  <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt="Post"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs">Video</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchPostAndComments}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        {!isLoading && !error && post && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <CommentSection
                comments={comments}
                currentUserId={session?.user?.id || ""}
                onComment={handleComment}
                onDeleteComment={handleDeleteComment}
                isLoading={isCommenting}
                showForm={false}
              />
              <div ref={commentsEndRef} />
            </div>

            {/* Comment Form - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 pt-4 pb-6">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const content = formData.get("comment") as string;
                  if (!content?.trim() || isCommenting) return;

                  const commentText = content.trim();
                  e.currentTarget.reset();

                  // Reset textarea height
                  const textarea = e.currentTarget.querySelector("textarea");
                  if (textarea) {
                    textarea.style.height = "auto";
                  }

                  await handleComment(commentText);
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
                      target.style.height = `${Math.min(
                        target.scrollHeight,
                        120
                      )}px`;
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCommenting}
                  className="text-sm font-semibold text-[#0095f6] hover:text-[#1877f2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 py-1"
                >
                  {isCommenting ? "Gönderiliyor..." : "Paylaş"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}

