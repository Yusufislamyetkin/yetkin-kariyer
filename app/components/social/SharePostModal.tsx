"use client";

import { useState } from "react";
import { X, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface SharePostModalProps {
  postId: string;
  postUrl: string;
  onClose: () => void;
}

export function SharePostModal({ postId, postUrl, onClose }: SharePostModalProps) {
  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopyLink = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsCopying(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setIsCopying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-[#1d1d1d] rounded-lg w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Paylaş
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Bağlantıyı Kopyala
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={postUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <Button
                onClick={handleCopyLink}
                disabled={isCopying}
                variant="outline"
                size="sm"
                className="min-w-[100px]"
              >
                {isCopying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Bu gönderiyi paylaşmak için bağlantıyı kopyalayıp istediğiniz yerde kullanabilirsiniz.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={onClose}
            variant="primary"
            className="w-full bg-[#0a66c2] hover:bg-[#004182] text-white"
          >
            Kapat
          </Button>
        </div>
      </div>
    </div>
  );
}

