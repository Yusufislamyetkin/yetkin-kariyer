"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/app/components/ui/Textarea";
import { Button } from "@/app/components/ui/Button";

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

interface CommentSectionProps {
  comments: Comment[];
  currentUserId: string;
  onComment?: (content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  isLoading?: boolean;
  showForm?: boolean;
}

export function CommentSection({
  comments,
  currentUserId,
  onComment,
  onDeleteComment,
  isLoading = false,
  showForm = true,
}: CommentSectionProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || isSubmitting || !onComment) return;

    setIsSubmitting(true);
    try {
      await onComment(comment.trim());
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Comments list */}
      <div className={`${showForm ? 'flex-1 overflow-y-auto' : ''} space-y-4`}>
        {comments.length === 0 ? (
          <p className="text-sm text-[#8e8e8e] text-center py-8">
            Henüz yorum yok. İlk yorumu sen yap!
          </p>
        ) : (
          comments.map((comment) => {
            const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: tr,
            });
            const canDelete = comment.userId === currentUserId && onDeleteComment;

            return (
              <div key={comment.id} className="flex items-start gap-3">
                <Link href={`/profile/${comment.userId}`}>
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    {comment.user.profileImage ? (
                      <Image
                        src={comment.user.profileImage}
                        alt={comment.user.name || "User"}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                        {(comment.user.name || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="inline-block bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-2 max-w-full">
                    <Link
                      href={`/profile/${comment.userId}`}
                      className="text-sm font-semibold text-[#262626] dark:text-[#fafafa] hover:opacity-70 transition-opacity mr-2"
                    >
                      {comment.user.name || "Kullanıcı"}
                    </Link>
                    <span className="text-sm text-[#262626] dark:text-[#fafafa] break-words">
                      {comment.content}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 ml-4">
                    <span className="text-xs text-[#8e8e8e]">{timeAgo}</span>
                    {canDelete && (
                      <button
                        onClick={() => onDeleteComment?.(comment.id)}
                        className="text-xs text-[#8e8e8e] hover:text-red-500 transition-colors"
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Comment form */}
      {showForm && onComment && (
        <form onSubmit={handleSubmit} className="border-t border-[#dbdbdb] dark:border-[#383838] p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Yorum ekle..."
              className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-transparent border-0 focus:ring-0 px-0 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={isSubmitting || isLoading}
              maxLength={1000}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={!comment.trim() || isSubmitting || isLoading}
              className="text-[#0095f6] hover:text-[#0095f6] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Gönderiliyor..." : "Paylaş"}
            </Button>
          </div>
          <p className="text-xs text-[#8e8e8e] mt-1 text-right">
            {comment.length}/1000
          </p>
        </form>
      )}
    </div>
  );
}

