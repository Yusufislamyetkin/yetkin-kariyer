"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { useTheme } from "@/app/contexts/ThemeContext";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string;
      borderColor?: string;
    }[];
  };
  title?: string;
  height?: number;
}

export default function RadarChart({ data, title, height = 400 }: RadarChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const defaultColors = isDark
    ? ["rgba(59, 130, 246, 0.2)", "rgba(6, 182, 212, 0.2)", "rgba(16, 185, 129, 0.2)"]
    : ["rgba(37, 99, 235, 0.2)", "rgba(8, 145, 178, 0.2)", "rgba(5, 150, 105, 0.2)"];

  const defaultBorderColors = isDark
    ? ["#3b82f6", "#06b6d4", "#10b981"]
    : ["#2563eb", "#0891b2", "#059669"];

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: dataset.backgroundColor || defaultColors[index % defaultColors.length],
      borderColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
      borderWidth: 2,
      pointBackgroundColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
      pointBorderColor: isDark ? "#1f2937" : "#ffffff",
      pointHoverBackgroundColor: dataset.borderColor || defaultBorderColors[index % defaultBorderColors.length],
      pointHoverBorderColor: isDark ? "#1f2937" : "#ffffff",
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const options = {
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
      r: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
          backdropColor: isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)",
        },
        pointLabels: {
          color: textColor,
        },
      },
    },
  };

  return (
    <div style={{ height: `${height}px` }}>
      <Radar data={chartData} options={options} />
    </div>
  );
}

