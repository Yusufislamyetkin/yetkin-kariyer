"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
  profileImage: string | null;
  likedAt: string;
}

interface PostLikesModalProps {
  postId: string;
  onClose: () => void;
}

export function PostLikesModal({ postId, onClose }: PostLikesModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/posts/${postId}/likes`);
        
        if (!response.ok) {
          throw new Error("Beğenenler yüklenirken bir hata oluştu");
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err.message || "Beğenenler yüklenirken bir hata oluştu");
        console.error("Error fetching likes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [postId]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white dark:bg-[#1d1d1d] rounded-lg sm:rounded-xl w-full max-w-md max-h-[90vh] sm:max-h-[85vh] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            Beğenenler
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm sm:text-base text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Henüz beğeni yok
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700">
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={user.name || "User"}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-base sm:text-lg font-bold">
                        {(user.name || "K")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {user.name || "Kullanıcı"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold bg-[#0095f6] hover:bg-[#1877f2] text-white rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

