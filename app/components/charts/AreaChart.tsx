"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useTheme } from "@/app/contexts/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AreaChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
    }[];
  };
  title?: string;
  height?: number;
}

export default function AreaChart({ data, title, height = 300 }: AreaChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset, index) => {
      const defaultColors = isDark
        ? [
            { border: "#3b82f6", fill: "rgba(59, 130, 246, 0.2)" },
            { border: "#06b6d4", fill: "rgba(6, 182, 212, 0.2)" },
            { border: "#10b981", fill: "rgba(16, 185, 129, 0.2)" },
          ]
        : [
            { border: "#2563eb", fill: "rgba(37, 99, 235, 0.2)" },
            { border: "#0891b2", fill: "rgba(8, 145, 178, 0.2)" },
            { border: "#059669", fill: "rgba(5, 150, 105, 0.2)" },
          ];
      const color = defaultColors[index % defaultColors.length];
      return {
        ...dataset,
        borderColor: dataset.borderColor || color.border,
        backgroundColor: dataset.backgroundColor || color.fill,
        tension: dataset.tension ?? 0.4,
        fill: true,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: dataset.borderColor || color.border,
      };
    }),
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

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

