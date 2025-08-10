"use client";

import type { EChartsOption } from "echarts";
import ReactECharts from "echarts-for-react";
import React, { useMemo } from "react";
import { useChart } from "~/hooks/useChart";
import { useTranslations } from "next-intl";

interface PerformanceData {
  date: string;
  totalPerformance: number;
  smallTeamPerformance: number;
}

interface PerformanceChartProps {
  data?: PerformanceData[];
  width?: string | number;
  height?: string | number;
  theme?: "light" | "dark";
  className?: string;
}

// 生成模拟数据
const generateMockPerformanceData = (days: number = 30): PerformanceData[] => {
  const data: PerformanceData[] = [];
  let totalBase = 120000;
  let smallTeamBase = 130000;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));

    // 添加随机波动
    const totalChange = (Math.random() - 0.5) * 0.1;
    const smallTeamChange = (Math.random() - 0.5) * 0.08;

    totalBase = totalBase * (1 + totalChange);
    smallTeamBase = smallTeamBase * (1 + smallTeamChange);

    data.push({
      date: date.toISOString().split("T")[0],
      totalPerformance: Math.round(totalBase),
      smallTeamPerformance: Math.round(smallTeamBase),
    });
  }

  return data;
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data = generateMockPerformanceData(30),
  theme = "dark",
  className = "",
}) => {
  const t = useTranslations("dashboard");
  const { chartRef } = useChart();
  const chartOption = useMemo<EChartsOption>(() => {
    const dates = data.map((item) => item.date);
    const totalPerformanceData = data.map((item) => item.totalPerformance);
    const smallTeamPerformanceData = data.map(
      (item) => item.smallTeamPerformance,
    );

    const option: EChartsOption = {
      backgroundColor: "transparent",
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          lineStyle: {
            color: "#376df4",
            width: 2,
            opacity: 1,
          },
        },
        backgroundColor:
          theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
        borderColor: theme === "dark" ? "#333333" : "#e0e0e0",
        textStyle: {
          color: theme === "dark" ? "#ffffff" : "#333333",
        },
        formatter: (params: unknown) => {
          const paramArray = params as Array<{
            data: number;
            axisValue: string;
            seriesName: string;
          }>;

          let html = `<div style="font-weight: bold; margin-bottom: 8px;">${
            paramArray[0]?.axisValue || ""
          }</div>`;

          paramArray.forEach((param) => {
            const color = param.seriesName === "总业绩" ? "#B408D7" : "#FF6B35";
            html += `<div>${
              param.seriesName
            }: <span style="color: ${color};">${param.data.toLocaleString()} OLY</span></div>`;
          });

          return html;
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "10%",
        bottom: "10%",
      },
      xAxis: {
        type: "category",
        data: dates,
        axisLine: {
          lineStyle: {
            color: theme === "dark" ? "#8392A5" : "#666666",
          },
        },
        axisLabel: {
          show: false,
          color: theme === "dark" ? "#ffffff" : "#333333",
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: theme === "dark" ? "#8392A5" : "#666666",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: theme === "dark" ? "#333333" : "#e0e0e0",
            opacity: 0.3,
          },
        },
        axisLabel: {
          show: false,
          color: theme === "dark" ? "#ffffff" : "#333333",
          formatter: (value: number) => {
            return `${(value / 1000).toFixed(0)}K`;
          },
        },
      },
      series: [
        {
          name: t("totalPerformance"),
          type: "line",
          data: totalPerformanceData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: "#B408D7",
          },
        },
        {
          name: t("smallTeamPerformance"),
          type: "line",
          data: smallTeamPerformanceData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: "#FF6B35",
          },
        },
      ],
    };

    return option;
  }, [data, theme]);

  return (
    <div className={`performance-chart ${className}`}>
      <ReactECharts
        option={chartOption}
        ref={chartRef}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  );
};

export default PerformanceChart;
