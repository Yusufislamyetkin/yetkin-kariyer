"use client";

import type { ChartOptions } from "chart.js";
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

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
      tension?: number;
      fill?: boolean;
      yAxisID?: string;
      hidden?: boolean;
    }[];
  };
  title?: string;
  height?: number;
  options?: ChartOptions<"line">;
}

export default function LineChart({ data, title, height = 300, options: optionsOverride }: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

  const chartData = {
    ...data,
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      borderColor: dataset.borderColor || (isDark ? "#3b82f6" : "#2563eb"),
      backgroundColor: dataset.backgroundColor || (isDark ? "rgba(59, 130, 246, 0.1)" : "rgba(37, 99, 235, 0.1)"),
      tension: dataset.tension ?? 0.4,
      fill: dataset.fill ?? false,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.borderColor || (isDark ? "#3b82f6" : "#2563eb"),
    })),
  };

  const options: ChartOptions<"line"> = {
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
  } as ChartOptions<"line">;

  return (
    <div style={{ height: `${height}px` }}>
      <Line data={chartData} options={mergedOptions} />
    </div>
  );
}

