"use client"

import React, { useMemo } from "react"
import ReactECharts from "echarts-for-react"
import type { EChartsOption } from "echarts"

// 蜡烛图数据类型定义
export interface CandlestickData {
  time: string
  open: number
  close: number
  low: number
  high: number
  volume?: number
}

// 蜡烛图组件 Props
export interface CandlestickChartProps {
  data?: CandlestickData[]
  width?: string | number
  height?: string | number
  theme?: "light" | "dark"
  showVolume?: boolean
  showMA?: boolean
  className?: string
}

// 生成模拟数据的函数
export const generateMockCandlestickData = (
  days: number = 100
): CandlestickData[] => {
  const data: CandlestickData[] = []
  let basePrice = 100
  let momentum = 0 // 价格动量

  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i - 1))

    // 动态波动率 - 模拟不同市场环境
    const baseVolatility = 0.015 // 基础波动率
    const marketStress = Math.sin(i * 0.03) * 0.01 // 市场压力周期
    const volatility = Math.max(
      0.005,
      Math.min(0.05, baseVolatility + marketStress + Math.random() * 0.01)
    )

    // 价格趋势和动量
    const longTermTrend = Math.sin(i * 0.02) * 0.008 // 长期趋势
    const shortTermTrend = Math.sin(i * 0.1) * 0.005 // 短期趋势

    // 更新动量
    momentum = momentum * 0.7 + (Math.random() - 0.5) * 0.02
    momentum = Math.max(-0.03, Math.min(0.03, momentum))

    // 生成开盘价
    const openGap = (Math.random() - 0.5) * volatility * 2
    const open = basePrice * (1 + openGap)

    // 生成收盘价 - 考虑趋势、动量和随机性
    const priceChange =
      longTermTrend +
      shortTermTrend +
      momentum +
      (Math.random() - 0.5) * volatility
    const close = open * (1 + priceChange)

    // 生成最高价和最低价 - 增加多样性
    const priceRange = Math.abs(close - open)
    const minRange = basePrice * volatility * 0.5 // 最小波动范围

    // 随机决定蜡烛形状
    const candleType = Math.random()
    let high, low

    if (candleType < 0.3) {
      // 30% 概率：长上影线（锤子线）
      high = Math.max(open, close) + Math.random() * priceRange * 3 + minRange
      low = Math.min(open, close) - Math.random() * priceRange * 0.5
    } else if (candleType < 0.6) {
      // 30% 概率：长下影线（上吊线）
      high = Math.max(open, close) + Math.random() * priceRange * 0.5
      low = Math.min(open, close) - Math.random() * priceRange * 3 - minRange
    } else if (candleType < 0.8) {
      // 20% 概率：十字星
      high = Math.max(open, close) + Math.random() * priceRange * 2
      low = Math.min(open, close) - Math.random() * priceRange * 2
    } else {
      // 20% 概率：实体蜡烛
      high = Math.max(open, close) + Math.random() * priceRange * 1.5
      low = Math.min(open, close) - Math.random() * priceRange * 1.5
    }

    // 确保价格合理性
    const finalHigh = Math.max(high, Math.max(open, close) * 1.001)
    const finalLow = Math.min(low, Math.min(open, close) * 0.999)

    // 生成成交量 - 与价格波动相关
    const priceVolatility = Math.abs(close - open) / open
    const baseVolume = 800000
    const volumeMultiplier = 1 + priceVolatility * 8 + Math.random() * 1.5
    const volume = Math.floor(baseVolume * volumeMultiplier)

    data.push({
      time: date.toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      close: Number(close.toFixed(2)),
      low: Number(finalLow.toFixed(2)),
      high: Number(finalHigh.toFixed(2)),
      volume,
    })

    basePrice = close
  }

  return data
}

// 计算移动平均线
const calculateMA = (
  dayCount: number,
  data: number[][]
): (number | string)[] => {
  const result: (number | string)[] = []

  for (let i = 0, len = data.length; i < len; i++) {
    if (i < dayCount - 1) {
      result.push("-")
      continue
    }

    let sum = 0
    for (let j = 0; j < dayCount; j++) {
      sum += data[i - j][1] // 收盘价
    }
    result.push(Number((sum / dayCount).toFixed(2)))
  }

  return result
}

// 蜡烛图组件
export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data = generateMockCandlestickData(100),
  width = "100%",
  height = 500,
  theme = "dark",
  showVolume = false,
  showMA = true,
  className = "",
}) => {
  const chartOption = useMemo<EChartsOption>(() => {
    // 处理数据格式
    const dates = data.map((item) => item.time)
    const candlestickData = data.map((item) => [
      item.open,
      item.close,
      item.low,
      item.high,
    ])

    const volumeData = showVolume ? data.map((item) => item.volume || 0) : []

    const option: EChartsOption = {
      backgroundColor: "transparent",
      animation: false,
      legend: {
        data: ["日K", "MA5", "MA10", "MA20", "MA30"],
        inactiveColor: theme === "dark" ? "#777" : "#999",
        textStyle: {
          color: theme === "dark" ? "#ffffff" : "#333333",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          animation: false,
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
            data: number[] | number
            axisValue: string
            seriesName: string
          }>
          const candlestickParam = paramArray.find(
            (p) => p.seriesName === "日K"
          )

          if (!candlestickParam?.data || !Array.isArray(candlestickParam.data))
            return ""

          const [open, close, low, high] = candlestickParam.data
          const date = candlestickParam.axisValue || ""

          let html = `<div style="font-weight: bold; margin-bottom: 8px;">${date}</div>`
          html += `<div>开盘: <span style="color: #ff6b6b;">${open}</span></div>`
          html += `<div>收盘: <span style="color: #4ecdc4;">${close}</span></div>`
          html += `<div>最低: <span style="color: #45b7d1;">${low}</span></div>`
          html += `<div>最高: <span style="color: #96ceb4;">${high}</span></div>`

          // 添加移动平均线信息
          paramArray.forEach((param) => {
            if (
              param.seriesName.startsWith("MA") &&
              typeof param.data === "number"
            ) {
              html += `<div>${param.seriesName}: <span style="color: #feca57;">${param.data}</span></div>`
            }
          })

          return html
        },
      },
      grid: [
        {
          left: "10%",
          right: "10%",
          height: showVolume ? "60%" : "80%",
          top: "10%",
        },
        ...(showVolume
          ? [
              {
                left: "10%",
                right: "10%",
                top: "75%",
                height: "15%",
              },
            ]
          : []),
      ],
      xAxis: [
        {
          type: "category",
          data: dates,
          axisLine: {
            lineStyle: {
              color: theme === "dark" ? "#8392A5" : "#666666",
            },
          },
          axisLabel: {
            color: theme === "dark" ? "#ffffff" : "#333333",
            formatter: (value: string) => {
              const date = new Date(value)
              return `${date.getMonth() + 1}/${date.getDate()}`
            },
          },
        },
        ...(showVolume
          ? [
              {
                type: "category" as const,
                gridIndex: 1,
                data: dates,
                axisLine: {
                  lineStyle: {
                    color: theme === "dark" ? "#8392A5" : "#666666",
                  },
                },
                axisLabel: { show: false },
              },
            ]
          : []),
      ],
      yAxis: [
        {
          scale: true,
          axisLine: {
            lineStyle: {
              color: theme === "dark" ? "#8392A5" : "#666666",
            },
          },
          splitLine: { show: false },
          axisLabel: {
            color: theme === "dark" ? "#ffffff" : "#333333",
          },
        },
        ...(showVolume
          ? [
              {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
              },
            ]
          : []),
      ],
      dataZoom: [
        {
          textStyle: {
            color: theme === "dark" ? "#8392A5" : "#666666",
          },
          handleIcon:
            "path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
          dataBackground: {
            areaStyle: {
              color: theme === "dark" ? "#8392A5" : "#666666",
            },
            lineStyle: {
              opacity: 0.8,
              color: theme === "dark" ? "#8392A5" : "#666666",
            },
          },
          brushSelect: true,
        },
        {
          type: "inside",
        },
      ],
      series: [
        {
          type: "candlestick",
          name: "日K",
          data: candlestickData,
          barWidth: 4,
          itemStyle: {
            color: "#FD1050",
            color0: "#0CF49B",
            borderColor: "#FD1050",
            borderColor0: "#0CF49B",
          },
        },
        ...(showMA
          ? [
              {
                name: "MA5",
                type: "line" as const,
                data: calculateMA(5, candlestickData),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                  color: "#FF9800",
                },
              },
              {
                name: "MA10",
                type: "line" as const,
                data: calculateMA(10, candlestickData),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                  color: "#2196F3",
                },
              },
              {
                name: "MA20",
                type: "line" as const,
                data: calculateMA(20, candlestickData),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                  color: "#9C27B0",
                },
              },
              {
                name: "MA30",
                type: "line" as const,
                data: calculateMA(30, candlestickData),
                smooth: true,
                showSymbol: false,
                lineStyle: {
                  width: 1,
                  color: "#4CAF50",
                },
              },
            ]
          : []),
        ...(showVolume
          ? [
              {
                name: "成交量",
                type: "bar" as const,
                xAxisIndex: 1,
                yAxisIndex: 1,
                data: volumeData,
                barWidth: 4,
                itemStyle: {
                  color: (params: { dataIndex: number }) => {
                    const currentCandlestickData =
                      candlestickData[params.dataIndex]
                    if (!currentCandlestickData) return "#999"
                    return currentCandlestickData[1] > currentCandlestickData[0]
                      ? "#FD1050"
                      : "#0CF49B"
                  },
                },
              },
            ]
          : []),
      ],
    }

    return option
  }, [data, theme, showVolume, showMA])

  return (
    <div className={`candlestick-chart ${className}`}>
      <ReactECharts
        option={chartOption}
        style={{ width, height }}
        opts={{ renderer: "canvas" }}
      />
    </div>
  )
}

// 默认导出
export default CandlestickChart
