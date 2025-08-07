"use client"

import React, { useMemo } from "react"
import ReactECharts from "echarts-for-react"
import type { EChartsOption } from "echarts"
import { useChart } from "~/hooks/useChart"

// 生成TVL模拟数据
const generateTVLData = () => {
  const data = []
  let baseValue = 3000
  let momentum = 0

  for (let i = 0; i < 12; i++) {
    const month = i + 1
    const date = `2021-${month.toString().padStart(2, "0")}`

    // 模拟市场波动
    const trend = Math.sin(i * 0.5) * 0.3 // 长期趋势
    const volatility = (Math.random() - 0.5) * 0.4 // 随机波动
    const momentumEffect = momentum * 0.1 // 动量效应

    // 更新动量
    momentum = momentum * 0.8 + (Math.random() - 0.5) * 0.2

    // 计算新值
    const change = trend + volatility + momentumEffect
    baseValue = Math.max(1000, Math.min(6000, baseValue * (1 + change)))

    data.push([date, Math.round(baseValue)])
  }

  return data
}

// TVL图表组件
export const TVLChart: React.FC<{
  width?: string | number
  height?: string | number
  className?: string
}> = ({ className = "" }) => {
  const { chartRef } = useChart()
  const chartOption = useMemo<EChartsOption>(() => {
    const data = generateTVLData()

    return {
      backgroundColor: "transparent",
      animation: false,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          lineStyle: {
            color: "#376df4",
            width: 1,
            opacity: 1,
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        borderColor: "#333333",
        textStyle: {
          color: "#ffffff",
        },
        formatter: (params: unknown) => {
          const paramArray = params as Array<{
            axisValue: string
            value: [string, number]
          }>
          const data = paramArray[0]
          return `<div style="font-weight: bold; margin-bottom: 8px;">${data.axisValue}</div>
                  <div>TVL: <span style="color: #8B5CF6;">${data.value[1]}</span></div>`
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "15%",
        bottom: "15%",
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item[0]),
        axisLine: {
          lineStyle: {
            color: "#8392A5",
          },
        },
        axisLabel: {
          color: "#ffffff",
          formatter: (value: string) => {
            return value.split("-")[1] // 只显示月份
          },
        },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: 6000,
        interval: 1000,
        axisLine: {
          lineStyle: {
            color: "#8392A5",
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#2A2A2A",
            type: "dashed",
          },
        },
        axisLabel: {
          color: "#ffffff",
          formatter: (value: number) => {
            return value.toLocaleString()
          },
        },
      },
      series: [
        {
          type: "line",
          data: data,
          smooth: true,
          symbol: "none",
          lineStyle: {
            width: 1,
            color: "#8B5CF6",
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(139, 92, 246, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(139, 92, 246, 0.05)",
                },
              ],
            },
          },
        },
      ],
    }
  }, [])

  return (
    <div className={`tvl-chart w-full h-full ${className}`}>
      <ReactECharts
        option={chartOption}
        ref={chartRef}
        style={{ width: "100%", height: "100%" }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  )
}
