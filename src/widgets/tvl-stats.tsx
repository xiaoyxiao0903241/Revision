'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { Icon, IconFontName, View } from '~/components';
import { PieChart } from './small-chart';

// interface HistoricalData {
//   timestamp: number;
//   tokenMarketCap: number;
//   lpMarketCap: number;
//   treasuryMarketCap: number;
//   components: ComponentData[];
//   AllolyStakeNum: number;
//   AllLockOlyStakeNum: number;
// }

interface TVLDataSource {
  tokenMarketCap?: number;
  lpMarketCap?: number;
  treasuryMarketCap?: number;
  AllolyStakeNum?: number;
  AllLockOlyStakeNum?: number;
  TVL: number;
  flexibleStakedAmount: number;
  longStakedAmount: number;
}

// TVL统计组件
export const TVLStats: React.FC<{
  todayObj: TVLDataSource;
  yesterdayObj: TVLDataSource;
}> = ({ todayObj, yesterdayObj }) => {
  const t = useTranslations('analytics');
  const [showGraph, setShowGraph] = useState(false);

  // 计算变化值
  const calculateChange = (current: number, previous: number) => {
    return current - previous;
  };

  // 计算变化百分比
  const calculateChangePercent = (current: number, previous: number) => {
    if (previous === 0) return 0;
    console.log(current, previous, 'tttttttttttttttttttttttt');
    return ((current - previous) / previous) * 100;
  };

  // 初始化状态
  const [tvlData, setTvlData] = useState({
    currentTVL: 0,
    previousTVL: 0,
    change: 0,
    changePercent: 0,
    components: [] as {
      name: string;
      value: number;
      previousValue: number;
      change: number;
      changePercent: number;
      icon: IconFontName;
    }[],
  });

  // 处理数据更新
  useEffect(() => {
    // 根据todayObj和yesterdayObj计算当前和之前的值
    const currentTokenMarketCap = Math.floor(todayObj?.TVL || 0);
    const previousTokenMarketCap = Math.floor(yesterdayObj?.TVL || 0);

    const currentLpMarketCap = 0; // todayObj?.lpMarketCap || 0;
    const previousLpMarketCap = 0; // yesterdayObj?.lpMarketCap || 0;

    const currentTreasuryMarketCap = 0; // todayObj?.treasuryMarketCap || 0;
    const previousTreasuryMarketCap = 0; // yesterdayObj?.treasuryMarketCap || 0;

    const currentNoLockStaking = Math.floor(
      todayObj?.flexibleStakedAmount || 0
    );
    const previousNoLockStaking = Math.floor(
      yesterdayObj?.flexibleStakedAmount || 0
    );

    const currentLockedStaking = Math.floor(todayObj?.longStakedAmount || 0);
    const previousLockedStaking = Math.floor(
      yesterdayObj?.longStakedAmount || 0
    );

    // 计算TVL变化 (使用tokenMarketCap作为TVL)
    const currentTVL = currentTokenMarketCap;
    const previousTVL = previousTokenMarketCap;
    const tvlChange = calculateChange(currentTVL, previousTVL);
    const tvlChangePercent = calculateChangePercent(currentTVL, previousTVL);

    // 组件数据
    const components = [
      {
        name: t('no_lock_staking'),
        value: currentNoLockStaking,
        previousValue: previousNoLockStaking,
        change: calculateChange(currentNoLockStaking, previousNoLockStaking),
        changePercent: calculateChangePercent(
          currentNoLockStaking,
          previousNoLockStaking
        ),
        icon: 'staking' as IconFontName,
      },
      {
        name: t('locked_staking'),
        value: currentLockedStaking,
        previousValue: previousLockedStaking,
        change: calculateChange(currentLockedStaking, previousLockedStaking),
        changePercent: calculateChangePercent(
          currentLockedStaking,
          previousLockedStaking
        ),
        icon: 'locked-staking' as IconFontName,
      },
      {
        name: t('lp_bonds'),
        value: currentLpMarketCap,
        previousValue: previousLpMarketCap,
        change: calculateChange(currentLpMarketCap, previousLpMarketCap),
        changePercent: calculateChangePercent(
          currentLpMarketCap,
          previousLpMarketCap
        ),
        icon: 'lp-bonds' as IconFontName,
      },
      {
        name: t('treasury_bonds'),
        value: currentTreasuryMarketCap,
        previousValue: previousTreasuryMarketCap,
        change: calculateChange(
          currentTreasuryMarketCap,
          previousTreasuryMarketCap
        ),
        changePercent: calculateChangePercent(
          currentTreasuryMarketCap,
          previousTreasuryMarketCap
        ),
        icon: 'treasury-bonds' as IconFontName,
      },
    ];

    // 更新状态
    setTvlData({
      currentTVL,
      previousTVL,
      change: tvlChange,
      changePercent: tvlChangePercent,
      components,
    });

    // 保存当前数据作为下次的历史数据
    // saveHistoricalData(todayObj);
  }, [todayObj, yesterdayObj]);

  return (
    <div className='flex flex-col gap-4'>
      {/* 标题和切换按钮 */}
      <div
        className='absolute top-2 right-2 '
        onClick={() => setShowGraph(!showGraph)}
      >
        <View
          clipDirection='topLeft-bottomRight'
          border={true}
          clipSize={8}
          borderWidth={2}
          borderColor='#434c8c'
          className='flex px-4 py-1 cursor-pointer bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)]'
        >
          <span className='text-sm text-white'>{t('switch')}</span>
        </View>
      </div>
      {/* 当前TVL值 */}
      <div className='gap-2 flex flex-col items-center'>
        <h3 className='text-foreground/50'>{t('tvl')}</h3>
        <div className='text-5xl font-bold text-white text-nowrap text-ellipsis'>
          $ {tvlData.currentTVL.toLocaleString()}
        </div>
        <span className='text-sm text-foreground/50'>{t('tvl_changes')}</span>
        <span
          className={`text-2xl font-mono ${
            tvlData.change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          $ {Math.abs(tvlData.change).toLocaleString()}
        </span>
        <span
          className={`font-mono ${
            tvlData.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
          }`}
        >
          ({tvlData.changePercent >= 0 ? '+' : ''}
          {tvlData.changePercent.toFixed(2)}%)
        </span>
      </div>

      {/* TVL组件列表 */}
      {showGraph ? (
        <div className='h-[190px] mx-[-24px]'>
          <PieChart data={tvlData.components} />
        </div>
      ) : (
        <div className='space-y-3 p-4 border-foreground/20 border h-[190px]'>
          {tvlData.components.map((component, index) => (
            <div key={index} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Icon name={component.icon} size={20} />
                <span className='text-sm text-foreground/50'>
                  {component.name}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-foreground/50'>
                  ${component.value.toLocaleString()}
                </span>
                <span
                  className={`text-xs ${
                    component.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  ({component.change >= 0 ? '+' : ''}
                  {component.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
