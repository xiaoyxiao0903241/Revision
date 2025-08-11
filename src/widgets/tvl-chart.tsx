'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useChart } from '~/hooks/useChart';

// TVL图表组件
export const TVLChart: React.FC<{
  width?: string | number;
  height?: string | number;
  className?: string;
  dataSource: Array<[string, number]>;
}> = ({ dataSource, className = '' }) => {
  const { chartRef } = useChart();
  const chartOption = useMemo<EChartsOption>(() => {
    const data = dataSource || [];
    return {
      backgroundColor: 'transparent',
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#376df4',
            width: 1,
            opacity: 1,
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#333333',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (params: unknown) => {
          const paramArray = params as Array<{
            axisValue: string;
            value: [string, number];
          }>;
          const data = paramArray[0];
          return `<div style="font-weight: bold; margin-bottom: 8px;">${data.axisValue}</div>
                  <div>TVL: <span style="color: #8B5CF6;">${data.value[1]}</span></div>`;
        },
      },
      grid: {
        left: '10%',
        right: '10%',
        top: '15%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item[0]),
        axisLine: {
          lineStyle: {
            color: '#8392A5',
          },
        },
        axisLabel: {
          color: '#ffffff',
          // formatter: (value: string) => {
          //   return value.split("-")[1] // 只显示月份
          // },
        },
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 6000,
        interval: 1000,
        axisLine: {
          lineStyle: {
            color: '#8392A5',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#2A2A2A',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#ffffff',
          formatter: (value: number) => {
            return value.toLocaleString();
          },
        },
      },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 1,
            color: '#8B5CF6',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(139, 92, 246, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(139, 92, 246, 0.05)',
                },
              ],
            },
          },
        },
      ],
    };
  }, [dataSource]);

  return (
    <div className={`tvl-chart w-full h-full ${className}`}>
      <ReactECharts
        option={chartOption}
        ref={chartRef}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
