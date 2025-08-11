'use client';

import React from 'react';
import { Button } from '~/components/button';
import { useTranslations } from 'next-intl';
import { RoundedLogo } from '~/components';
import { CountdownDisplay } from '~/components/CountdownDisplay';

interface ClaimTickerProps {
  index: number;
  current: number;
  isDisabled: boolean;
  lockedAmount: number | string;
  usdValue: number | string;
  // endAt: bigint
  disabled?: boolean;
  onClaim: () => void;
  isLockOver: boolean;
  vestingTerm: number;
  currentBlock: number;
  lastBlock: number;
}

export function ClaimTicker({
  index,
  current,
  isDisabled,
  lockedAmount,
  usdValue,
  onClaim,
  disabled = false,
  isLockOver,
  vestingTerm,
  currentBlock,
  lastBlock,
}: ClaimTickerProps) {
  const t = useTranslations('turbine');
  const tStaking = useTranslations('staking');
  const t2 = useTranslations('common');

  const remainingBlocks = currentBlock
    ? BigInt(currentBlock) - BigInt(lastBlock)
    : BigInt(0);
  const time =
    remainingBlocks >= BigInt(vestingTerm)
      ? BigInt(0)
      : BigInt(vestingTerm) - remainingBlocks;
  let isClaim = false;
  if (currentBlock && BigInt(currentBlock) - BigInt(lastBlock) > 0) {
    const remainingBlocks = BigInt(currentBlock) - BigInt(lastBlock);
    if (remainingBlocks >= BigInt(vestingTerm) && isLockOver) {
      isClaim = true;
    } else {
      isClaim = false;
    }
  }
  console.log(disabled);
  return (
    <div className='relative px-4'>
      <div className='flex items-center justify-between'>
        {/* 左侧：锁定金额显示 */}
        <div className='flex flex-col'>
          {/* 标题 */}
          <div className='text-gray-400 text-xs font-mono uppercase tracking-wider'>
            {t('lockedAmount')}
          </div>

          <div className='flex items-center gap-3'>
            {/* ONE 图标 */}
            <RoundedLogo className='w-5 h-5' />
            {/* 金额显示 */}
            <div className='flex items-baseline gap-1'>
              <span className='text-white font-mono text-2xl font-bold'>
                {lockedAmount} OLY
              </span>
              <span className='text-foreground/50 text-xs'>${usdValue}</span>
            </div>
          </div>
        </div>

        {/* 右侧：领取按钮和倒计时 */}
        <div className='flex flex-col items-end space-y-2'>
          {/* 领取按钮 */}
          <Button
            variant='primary'
            size='md'
            clipDirection='topRight-bottomLeft'
            clipSize={8}
            onClick={onClaim}
            disabled={!isClaim || isDisabled}
            className='min-w-[100px] h-8'
          >
            {current == index ? tStaking('claiming') : tStaking('claim')}
          </Button>

          {/* 倒计时 */}
          <div className='text-gray-400 font-mono text-xs'>
            <span className='mr-1'>{t('unlockCountdown')}:</span>
            {isLockOver ? (
              <span>{t2('unlockOver')}</span>
            ) : (
              <CountdownDisplay
                blocks={time}
                isShowDay={false}
                isShowHour={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
