'use client';

import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { useTranslations } from 'next-intl';
import { useChart } from '~/hooks/useChart';

// 小型图表组件
export const SmallChart: React.FC<{
  title: string;
  className?: string;
  dataSource?: { dates: string[]; data: number[] };
}> = ({ title, className = '', dataSource = { dates: [], data: [] } }) => {
  const { chartRef } = useChart();
  const chartOption = useMemo<EChartsOption>(() => {
    const { dates, data } = dataSource;
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
          fontSize: 12,
        },
        formatter: (params: unknown) => {
          const paramArray = params as Array<{
            axisValue: string;
            value: number;
          }>;
          const data = paramArray[0];
          return `<div style="font-weight: bold; margin-bottom: 4px;">${data.axisValue}</div>
                  <div>${title}: <span style="color: #10B981;">${data.value}</span></div>`;
        },
      },
      grid: {
        left: '12%',
        right: '5%',
        top: '15%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#8392A5',
          },
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: 10,
          // formatter: (value: string) => {
          //   return value.split("-")[1] // 只显示月份
          // },
        },
      },
      yAxis: {
        type: 'value',
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
          // show: false,
          color: '#ffffff',
          formatter: (value: number) => {
            if (value >= 1000000000) {
              return `${(value / 1000000000).toFixed(0)}B`;
            } else if (value >= 1000000) {
              return `${(value / 1000000).toFixed(0)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`;
            } else {
              return value.toString();
            }
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
            width: 0.5,
            color: '#10B981',
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
                  color: 'rgba(16, 185, 129, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(16, 185, 129, 0.05)',
                },
              ],
            },
          },
        },
      ],
    };
  }, [title, dataSource]);

  return (
    <div className={`small-chart ${className}`}>
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

// 圆环图组件
export const PieChart: React.FC<{
  className?: string;
  data: { value: number; name: string }[];
}> = ({ className = '', data }) => {
  const t = useTranslations('analytics');
  const { chartRef } = useChart();
  const chartOption = useMemo<EChartsOption>(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: '#333333',
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
        },
        formatter: '{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        textStyle: {
          color: '#ffffff',
          fontSize: 12,
        },
        itemWidth: 10,
        itemHeight: 10,
        borderWidth: 0,
      },
      series: [
        {
          type: 'pie',
          radius: ['70%', '90%'],
          center: ['35%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: () => {
              const total = data.reduce((sum, item) => sum + item.value, 0);
              return `{number|${total}}\n{text|${t('total')}}`;
            },
            rich: {
              number: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#ffffff',
                lineHeight: 30,
              },
              text: {
                fontSize: 14,
                color: '#8392A5',
                lineHeight: 20,
              },
            },
          },

          labelLine: {
            show: false,
          },
          data: data,
          itemStyle: {
            borderWidth: 0,
          },
        },
      ],
    };
  }, [data, t]);

  return (
    <div className={`pie-chart ${className} h-[180px]`}>
      <ReactECharts
        option={chartOption}
        ref={chartRef}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};
