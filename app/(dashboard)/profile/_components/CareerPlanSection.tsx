"use client";

import { Target, Plus, CheckCircle, Clock, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";

interface CareerPlan {
  id: string;
  goals: any;
  roadmap: any;
  summary: string | null;
  createdAt: Date | string;
}

interface CareerPlanSectionProps {
  careerPlan: CareerPlan | null;
}

export function CareerPlanSection({ careerPlan }: CareerPlanSectionProps) {
  if (!careerPlan) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <CardContent className="py-12 text-center">
          <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Henüz kariyer planınız yok
          </p>
          <Link href="/career">
            <Button variant="gradient">
              <Plus className="w-4 h-4 mr-2" />
              Kariyer Planı Oluştur
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const goals = careerPlan.goals || {};
  const roadmap = careerPlan.roadmap || {};

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Kariyer Planı
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Oluşturulma: {new Date(careerPlan.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {careerPlan.summary && (
          <div className="mb-6 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {careerPlan.summary}
            </p>
          </div>
        )}

        {Object.keys(goals).length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Hedefler
            </h3>
            {Object.entries(goals).map(([key, value]: [string, any], index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {key}
                  </p>
                  {typeof value === "object" && value !== null ? (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {JSON.stringify(value)}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {String(value)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/career">
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              Kariyer Planını Düzenle
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

