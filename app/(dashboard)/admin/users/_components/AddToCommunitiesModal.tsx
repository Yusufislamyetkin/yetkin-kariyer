"use client";

import { useState, useEffect } from "react";
import { X, Users, Loader2, CheckSquare, Square, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface Community {
  id: string;
  name: string;
  slug: string;
}

interface AddToCommunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: string[];
  onSuccess: () => void;
}

export function AddToCommunitiesModal({
  isOpen,
  onClose,
  userIds,
  onSuccess,
}: AddToCommunitiesModalProps) {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCommunityIds, setSelectedCommunityIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCommunities();
      setSelectedCommunityIds(new Set());
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/groups?category=community");
      if (!response.ok) {
        throw new Error("Topluluklar alınırken bir hata oluştu");
      }
      const data = await response.json();
      setCommunities(data.groups || []);
    } catch (err: any) {
      setError(err.message || "Topluluklar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCommunity = (communityId: string) => {
    const newSelected = new Set(selectedCommunityIds);
    if (newSelected.has(communityId)) {
      newSelected.delete(communityId);
    } else {
      newSelected.add(communityId);
    }
    setSelectedCommunityIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCommunityIds.size === communities.length) {
      setSelectedCommunityIds(new Set());
    } else {
      setSelectedCommunityIds(new Set(communities.map((c) => c.id)));
    }
  };

  const handleSubmit = async () => {
    if (selectedCommunityIds.size === 0) {
      setError("Lütfen en az bir topluluk seçin");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/users/add-to-communities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds: Array.from(userIds),
          communityIds: Array.from(selectedCommunityIds),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Kullanıcılar topluluklara eklenirken bir hata oluştu");
      }

      setSuccess(data.message || "Kullanıcılar başarıyla topluluklara eklendi");
      
      // Close modal after a short delay
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Topluluklara Ekle
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {userIds.length} kullanıcıyı seçili topluluklara ekleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : error && !success ? (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2 text-red-600 dark:text-red-300">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{error}</div>
              </div>
            </div>
          ) : success ? (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-2 text-green-600 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm font-medium">{success}</div>
              </div>
            </div>
          ) : (
            <>
              {/* Select All Button */}
              <div className="mb-4">
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  {selectedCommunityIds.size === communities.length ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Tümünü Kaldır
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Tümünü Seç
                    </>
                  )}
                </Button>
                {selectedCommunityIds.size > 0 && (
                  <span className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    {selectedCommunityIds.size} topluluk seçili
                  </span>
                )}
              </div>

              {/* Communities List */}
              {communities.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Topluluk bulunamadı
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {communities.map((community) => (
                    <button
                      key={community.id}
                      onClick={() => handleToggleCommunity(community.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCommunityIds.has(community.id)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 ${
                            selectedCommunityIds.has(community.id)
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400"
                          }`}
                        >
                          {selectedCommunityIds.has(community.id) ? (
                            <CheckSquare className="h-5 w-5" />
                          ) : (
                            <Square className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {community.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {community.slug}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !success && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
            <Button onClick={onClose} variant="outline" disabled={submitting}>
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || selectedCommunityIds.size === 0}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Ekle ({selectedCommunityIds.size})
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

