"use client";

import { useState, useEffect } from "react";
import { Loader2, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { RoadmapStepNode } from "./RoadmapStepNode";
import type {
  CareerPathRoadmap,
  RoadmapStep,
} from "@/lib/services/career/roadmap-steps";
import { canStartStep } from "@/lib/services/career/roadmap-steps";

interface StepProgress {
  stepId: string;
  completed: boolean;
  progress?: number;
  details?: any;
}

interface RoadmapTreeProps {
  roadmap: CareerPathRoadmap;
  progress?: {
    steps: StepProgress[];
    overallProgress: number;
  };
  loading?: boolean;
}

export function RoadmapTree({
  roadmap,
  progress,
  loading = false,
}: RoadmapTreeProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [completedStepIds, setCompletedStepIds] = useState<Set<string>>(
    new Set()
  );

  // Update completed steps from progress
  useEffect(() => {
    if (progress?.steps) {
      const completed = new Set<string>();
      progress.steps.forEach((sp) => {
        if (sp.completed) {
          completed.add(sp.stepId);
        }
      });
      setCompletedStepIds(completed);
    }
  }, [progress]);

  // Get progress for a specific step
  const getStepProgress = (stepId: string): StepProgress | undefined => {
    return progress?.steps.find((sp) => sp.stepId === stepId);
  };

  // Toggle step expansion
  const toggleStep = (stepId: string) => {
    setExpandedSteps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  // Check if step is expanded
  const isStepExpanded = (stepId: string): boolean => {
    return expandedSteps.has(stepId);
  };

  // Get dependent steps for a given step
  const getDependentSteps = (step: RoadmapStep): RoadmapStep[] => {
    if (!step.dependsOn || step.dependsOn.length === 0) {
      return [];
    }
    return roadmap.steps.filter((s) => step.dependsOn?.includes(s.id));
  };

  // Render step with its children (dependent steps)
  const renderStep = (step: RoadmapStep, level: number = 0): JSX.Element => {
    const stepProgress = getStepProgress(step.id);
    const dependentSteps = getDependentSteps(step);
    const hasChildren = dependentSteps.length > 0;
    const isExpanded = isStepExpanded(step.id);
    const canStart = canStartStep(step, completedStepIds);

    // Don't show locked steps as children - they're shown in main flow
    // Only show dependent steps if they're completed and this step is expanded
    const showChildren = hasChildren && isExpanded && canStart;

    return (
      <div key={step.id} className="space-y-2">
        <RoadmapStepNode
          step={step}
          progress={stepProgress}
          level={level}
          hasChildren={hasChildren}
          isExpanded={isExpanded}
          onToggle={() => toggleStep(step.id)}
        />

        {/* Render dependent steps as children */}
        {showChildren &&
          dependentSteps.map((childStep) => renderStep(childStep, level + 1))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              İlerleme yükleniyor...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallProgress = progress?.overallProgress ?? 0;
  const completedSteps = progress?.steps.filter((sp) => sp.completed).length ?? 0;
  const totalSteps = roadmap.steps.length;

  return (
    <div className="space-y-6">
      {/* Overall Progress Card */}
      <Card variant="elevated" className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            {roadmap.name} - Genel İlerleme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {completedSteps} / {totalSteps} adım tamamlandı
              </span>
            </div>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              %{overallProgress}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Steps Tree */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Kariyer Yol Haritası</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {roadmap.steps.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Henüz adım tanımlanmamış.
            </div>
          ) : (
            <div className="space-y-3">
              {roadmap.steps.map((step) => renderStep(step, 0))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

