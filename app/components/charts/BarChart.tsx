"use client";

import type { ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@/app/contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      yAxisID?: string;
    }[];
  };
  title?: string;
  height?: number;
  horizontal?: boolean;
  options?: ChartOptions<"bar">;
}

export default function BarChart({
  data,
  title,
  height = 300,
  horizontal = false,
  options: optionsOverride,
}: BarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const defaultColors = isDark
    ? ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]
    : ["#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626", "#7c3aed"];

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || (Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor : defaultColors[index % defaultColors.length]),
      borderColor: dataset.borderColor || (Array.isArray(dataset.borderColor) ? dataset.borderColor : defaultColors[index % defaultColors.length]),
      borderWidth: 1,
      borderRadius: 4,
    })),
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: textColor,
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: textColor,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(31, 41, 55, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
    },
  };

  const mergedOptions = {
    ...options,
    ...optionsOverride,
    plugins: {
      ...options.plugins,
      ...optionsOverride?.plugins,
      legend: {
        ...options.plugins?.legend,
        ...optionsOverride?.plugins?.legend,
      },
      title: {
        ...options.plugins?.title,
        ...optionsOverride?.plugins?.title,
      },
      tooltip: {
        ...options.plugins?.tooltip,
        ...optionsOverride?.plugins?.tooltip,
      },
    },
    scales: {
      ...options.scales,
      ...optionsOverride?.scales,
      x: {
        ...options.scales?.x,
        ...optionsOverride?.scales?.x,
      },
      y: {
        ...options.scales?.y,
        ...optionsOverride?.scales?.y,
      },
    },
  } as ChartOptions<"bar">;

  return (
    <div style={{ height: `${height}px` }}>
      <Bar data={chartData} options={mergedOptions} />
    </div>
  );
}

