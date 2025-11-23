"use client";

import { CheckCircle2, Clock } from "lucide-react";

type RoadmapStep = {
  number: number;
  title: string;
  status: "pending" | "in_progress" | "completed";
};

type RoadmapDisplayProps = {
  roadmap: string;
  progress?: { step: number; status: "pending" | "in_progress" | "completed" };
};

export function RoadmapDisplay({ roadmap, progress }: RoadmapDisplayProps) {
  // Parse roadmap string into steps
  const parseRoadmap = (roadmapText: string): RoadmapStep[] => {
    const steps: RoadmapStep[] = [];
    
    if (!roadmapText || !roadmapText.trim()) {
      return steps;
    }
    
    // Remove [ROADMAP: ...] wrapper if present
    let cleanedText = roadmapText.trim();
    const roadmapWrapperMatch = cleanedText.match(/\[ROADMAP:\s*([^\]]+)\]/i);
    if (roadmapWrapperMatch) {
      cleanedText = roadmapWrapperMatch[1].trim();
    }
    
    // Normalize the roadmap text - preserve newlines but normalize whitespace
    const normalized = cleanedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    // Try multiple parsing strategies
    let parsedSteps: Array<{ number: number; title: string }> = [];
    
    // Strategy 1: Split by newlines first (most reliable)
    const lines = normalized.split('\n').filter(line => line.trim());
    
    if (lines.length > 1) {
      // Multiple lines - parse each line with various patterns
    lines.forEach((line, index) => {
        let match: RegExpMatchArray | null = null;
        let stepNumber: number | undefined;
        let title: string | undefined;
        
        // Pattern 1: "1. Title" or "1) Title" or "Step 1: Title"
        match = line.match(/^(?:Step\s+)?(\d+)[\.\)]\s*(.+?)(?:\s*:)?\s*$/i);
        if (match) {
          stepNumber = parseInt(match[1], 10);
          title = match[2].trim();
        } else {
          // Pattern 2: "- 1. Title" or "* 1. Title"
          match = line.match(/^[-*]\s*(\d+)[\.\)]\s*(.+?)(?:\s*:)?\s*$/i);
          if (match) {
            stepNumber = parseInt(match[1], 10);
            title = match[2].trim();
          } else {
            // Pattern 3: Just number and text "1 Title"
            match = line.match(/^(\d+)\s+(.+)$/);
            if (match) {
              stepNumber = parseInt(match[1], 10);
              title = match[2].trim();
            } else {
              // Pattern 4: Bullet points "• Title" or "• 1. Title" or "- Title" or "* Title"
              match = line.match(/^[•\-\*]\s*(?:(\d+)[\.\)]\s*)?(.+?)(?:\s*:)?\s*$/);
      if (match) {
                stepNumber = match[1] ? parseInt(match[1], 10) : index + 1;
                title = match[2].trim();
              }
            }
          }
        }
        
        if (match && title && title.length > 0 && stepNumber && stepNumber > 0) {
          parsedSteps.push({ number: stepNumber, title });
        }
      });
    } else {
      // Single line - try to split by number pattern or bullet points
      const singleLine = normalized;
      
      // Pattern 1: "1. Title 2. Title 3. Title" or "1. Title, 2. Title, 3. Title"
      let stepPattern = /(\d+)[\.\)]\s+([^0-9]+?)(?=\s*\d+[\.\)]|$)/g;
      let matches = Array.from(singleLine.matchAll(stepPattern));
      
      if (matches.length > 0) {
        parsedSteps = matches.map(m => ({
          number: parseInt(m[1], 10),
          title: m[2].trim().replace(/[,;]\s*$/, ''), // Remove trailing comma/semicolon
        }));
      } else {
        // Pattern 2: "Step 1: Title Step 2: Title"
        stepPattern = /Step\s+(\d+):\s*([^S]+?)(?=Step\s+\d+:|$)/gi;
        matches = Array.from(singleLine.matchAll(stepPattern));
        if (matches.length > 0) {
          parsedSteps = matches.map(m => ({
            number: parseInt(m[1], 10),
            title: m[2].trim(),
          }));
        } else {
          // Pattern 3: Bullet points "• Title1 • Title2 • Title3"
          stepPattern = /[•\-\*]\s*([^•\-\*]+?)(?=\s*[•\-\*]|$)/g;
          matches = Array.from(singleLine.matchAll(stepPattern));
          if (matches.length > 0) {
            parsedSteps = matches.map((m, idx) => ({
              number: idx + 1,
              title: m[1].trim().replace(/[,;]\s*$/, ''),
            }));
          } else {
            // Pattern 4: Any numbered pattern with dot or parenthesis
            stepPattern = /(\d+)[\.\)]\s*([^0-9]+)/g;
            matches = Array.from(singleLine.matchAll(stepPattern));
            if (matches.length > 0) {
              parsedSteps = matches.map(m => ({
                number: parseInt(m[1], 10),
                title: m[2].trim().replace(/[,;]\s*$/, ''),
              }));
            }
          }
        }
      }
    }
    
    // Remove only true duplicates (same step number), but preserve OpenAI's numbering
    // We don't renumber gaps - OpenAI may intentionally skip numbers
    const stepMap = new Map<number, { number: number; title: string }>();
    
    parsedSteps.forEach((step) => {
      const existing = stepMap.get(step.number);
      if (!existing) {
        stepMap.set(step.number, step);
      } else {
        // Duplicate step number found - keep the one with longer/more descriptive title
        if (step.title.length > existing.title.length || 
            (step.title.length === existing.title.length && step.title !== existing.title)) {
          stepMap.set(step.number, step);
        }
      }
    });
    
    // Convert to array and sort by step number
    // IMPORTANT: We preserve OpenAI's original numbering, even if there are gaps
    // This ensures progress tracking works correctly
    const uniqueSteps = Array.from(stepMap.values());
    uniqueSteps.sort((a, b) => a.number - b.number);
    
    // Only log if we removed duplicates (for debugging)
    if (parsedSteps.length > uniqueSteps.length) {
      console.log("[RoadmapDisplay] Removed duplicate steps, preserved original numbering");
    }
    
    // Determine status for each step
    uniqueSteps.forEach((step) => {
        let status: "pending" | "in_progress" | "completed" = "pending";
        
      if (progress) {
        // If current step matches progress step, use progress status
        if (progress.step === step.number) {
          status = progress.status;
        } 
        // If progress step is greater than current step, 
        // it means we've moved past this step, so it should be completed
        else if (progress.step > step.number) {
          status = "completed";
        }
        // If progress step is less than current step, current step is still pending
        else {
          status = "pending";
        }
      } else if (step.number === 1) {
        // No progress yet, first step is in progress
          status = "in_progress";
        }
        
      steps.push({ number: step.number, title: step.title, status });
    });
    
    return steps;
  };

  const steps = parseRoadmap(roadmap);

  if (steps.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📋</span>
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Ders Aşamaları
        </h3>
      </div>
        <div className="space-y-2">
        {steps.map((step, index) => (
            <div
              key={step.number}
            className={`relative flex items-start gap-3 p-3 rounded-lg border transition-all ${
                step.status === "completed"
                ? "bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800/50"
                  : step.status === "in_progress"
                ? "bg-blue-100/80 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700/50 shadow-sm"
                : "bg-white/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700/50"
            }`}
          >
            {/* Step Number Badge */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              step.status === "completed"
                ? "bg-green-500 text-white"
                : step.status === "in_progress"
                ? "bg-blue-500 text-white animate-pulse"
                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}>
              {step.status === "completed" ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                step.number
              )}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-start gap-2">
                {step.status === "in_progress" && (
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
                )}
                <span className={`text-sm font-medium leading-relaxed ${
                  step.status === "completed"
                    ? "text-green-700 dark:text-green-300 line-through"
                    : step.status === "in_progress"
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {step.title}
                </span>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`absolute left-[19px] top-12 w-0.5 h-4 ${
                step.status === "completed"
                  ? "bg-green-300 dark:bg-green-700"
                  : "bg-gray-200 dark:bg-gray-700"
              }`} />
            )}
            </div>
          ))}
        </div>
    </div>
  );
}

