"use client";

import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export type LeaderboardViewType =
  | "overall"
  | "topic"
  | "hackaton"
  | "test"
  | "liveCoding"
  | "bugFix";

interface FilterTabsProps {
  period: "daily" | "monthly";
  onPeriodChange: (period: "daily" | "monthly") => void;
  viewType: LeaderboardViewType;
  onViewTypeChange: (type: LeaderboardViewType) => void;
  trailingContent?: ReactNode;
  className?: string;
}

export const viewTypeLabels: Record<LeaderboardViewType, string> = {
  overall: "Genel",
  topic: "Konu",
  hackaton: "Hackaton",
  test: "Test",
  liveCoding: "Canlı Kodlama",
  bugFix: "Bug Fix",
};

export const viewAccentGradients: Record<LeaderboardViewType, string> = {
  overall: "from-blue-500 to-indigo-500",
  topic: "from-emerald-500 to-teal-500",
  hackaton: "from-amber-500 to-orange-500",
  test: "from-cyan-500 to-sky-500",
  liveCoding: "from-purple-500 to-fuchsia-500",
  bugFix: "from-rose-500 to-red-500",
};

const viewOrder: LeaderboardViewType[] = [
  "overall",
  "topic",
  "hackaton",
  "test",
  "liveCoding",
  "bugFix",
];

export function FilterTabs({
  period,
  onPeriodChange,
  viewType,
  onViewTypeChange,
  trailingContent,
  className,
}: FilterTabsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        <TabGroup>
          {viewOrder.map((type) => (
            <TabButton
              key={type}
              active={viewType === type}
              accentClass={viewAccentGradients[type]}
              onClick={() => onViewTypeChange(type)}
            >
              {viewTypeLabels[type]}
            </TabButton>
          ))}
        </TabGroup>

        <TabGroup>
          <TabButton
            active={period === "daily"}
            accentClass="from-blue-500 to-indigo-500"
            onClick={() => onPeriodChange("daily")}
          >
            Günlük
          </TabButton>
          <TabButton
            active={period === "monthly"}
            accentClass="from-blue-500 to-indigo-500"
            onClick={() => onPeriodChange("monthly")}
          >
            Aylık
          </TabButton>
        </TabGroup>
      </div>

      {trailingContent && (
        <div className="flex items-center gap-3">{trailingContent}</div>
      )}
    </div>
  );
}

interface TabGroupProps extends ComponentPropsWithoutRef<"div"> {}

function TabGroup({ className, ...props }: TabGroupProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 rounded-2xl border border-gray-200/70 bg-gray-50/80 p-1.5 dark:border-gray-800/70 dark:bg-gray-900/40",
        className
      )}
      {...props}
    />
  );
}

interface TabButtonProps extends ComponentPropsWithoutRef<"button"> {
  active?: boolean;
  accentClass?: string;
}

function TabButton({
  active,
  accentClass = "from-blue-500 to-indigo-500",
  className,
  ...props
}: TabButtonProps) {
  return (
    <button
      className={cn(
        "relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none",
        active
          ? "text-white shadow-sm"
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-0 -z-10 scale-0 rounded-xl bg-gradient-to-br opacity-0 transition-all duration-200",
          accentClass,
          active && "scale-100 opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute inset-0 -z-10 rounded-xl bg-white/90 backdrop-blur-sm transition-opacity dark:bg-gray-900/60",
          active && "opacity-0"
        )}
      />
      <span className="relative z-10">{props.children}</span>
    </button>
  );
}
