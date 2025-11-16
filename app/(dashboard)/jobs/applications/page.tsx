"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Application {
  id: string;
  status: string;
  score: number | null;
  appliedAt: string;
  job: {
    id: string;
    title: string;
    location: string | null;
    salary: string | null;
    employer: {
      name: string | null;
    };
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/jobs/applications");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "reviewing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "accepted":
        return "Kabul Edildi";
      case "rejected":
        return "Reddedildi";
      case "reviewing":
        return "İnceleniyor";
      default:
        return "Beklemede";
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
      <h1 className="text-3xl font-bold mb-6">Başvurularım</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Henüz başvurunuz yok.</p>
          <Link
            href="/jobs/browse"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          >
            İlanlara Göz At
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Link
              key={application.id}
              href={`/jobs/${application.job.id}`}
              className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {application.job.title}
                  </h2>
                  <div className="flex gap-4 text-sm text-gray-600">
                    {application.job.location && (
                      <span>📍 {application.job.location}</span>
                    )}
                    {application.job.salary && (
                      <span>💰 {application.job.salary}</span>
                    )}
                    <span>👤 {application.job.employer.name || "İşveren"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusText(application.status)}
                  </span>
                  {application.score !== null && (
                    <p className="text-sm text-gray-600 mt-2">
                      Skor: {application.score}%
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Başvuru Tarihi:{" "}
                {new Date(application.appliedAt).toLocaleDateString("tr-TR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

