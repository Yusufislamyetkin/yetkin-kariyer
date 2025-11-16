/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Candidate {
  id: string;
  status: string;
  score: number | null;
  appliedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  job: {
    id: string;
    title: string;
  };
  cv: {
    id: string;
    data: any;
  };
}

export default function EmployerCandidatesPage() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      if (jobId) params.append("jobId", jobId);

      const response = await fetch(`/api/employer/candidates?${params.toString()}`);
      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Adaylar</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate)}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer ${
                selectedCandidate?.id === candidate.id
                  ? "border-2 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {candidate.user.name || "İsimsiz"}
                  </h2>
                  <p className="text-gray-600 mb-2">{candidate.user.email}</p>
                  <p className="text-sm text-gray-500 mb-2">
                    {candidate.job.title}
                  </p>
                  {candidate.score !== null && (
                    <p className="text-sm font-semibold text-blue-600">
                      Skor: {candidate.score}%
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    candidate.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : candidate.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {candidate.status === "accepted"
                    ? "Kabul"
                    : candidate.status === "rejected"
                    ? "Red"
                    : "İnceleniyor"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {selectedCandidate ? (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {selectedCandidate.user.name || "İsimsiz"}
              </h2>
              <p className="text-gray-600 mb-4">{selectedCandidate.user.email}</p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">CV Bilgileri</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(selectedCandidate.cv.data, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Performans Skorları</h3>
                <div className="space-y-2">
                  <p>
                    <strong>İlan Skoru:</strong>{" "}
                    {selectedCandidate.score !== null
                      ? `${selectedCandidate.score}%`
                      : "Henüz hesaplanmadı"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Bir aday seçin</p>
          )}
        </div>
      </div>

      {candidates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aday bulunamadı</p>
        </div>
      )}
    </div>
  );
}

