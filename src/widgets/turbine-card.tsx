'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '~/components/button';
interface ClaimTickerProps {
  lockedAmount: number | string;
  usdValue: number | string;
  title: string;
  onClick?: () => void;
}

export function TurbineCard({
  lockedAmount,
  title,
  usdValue,
  onClick,
}: ClaimTickerProps) {
  const tStaking = useTranslations('staking');
  return (
    <div className='relative px-4'>
      <div className='flex items-center justify-between'>
        {/* 左侧：锁定金额显示 */}
        <div className='flex flex-col'>
          {/* 标题 */}
          <div className='text-gray-400 text-xs font-mono uppercase tracking-wider'>
            {title}
          </div>
          {/* 金额显示 */}
          <div className='flex items-baseline gap-1'>
            <span className='text-white font-mono text-2xl font-bold'>
              {lockedAmount} OLY
            </span>
            <span className='text-foreground/50 text-xs'>${usdValue}</span>
          </div>
        </div>

        {/* 右侧：按钮 */}
        {onClick && (
          <div className='flex flex-col items-end space-y-2'>
            {/* 领取按钮 */}
            <Button
              variant='accent'
              size='sm'
              clipSize={8}
              className='gap-2'
              clipDirection='topLeft-bottomRight'
            >
              <div className='w-4 h-4 rounded-full bg-white flex items-center justify-center'>
                <Image
                  src='/images/widgets/logo.png'
                  alt='logo'
                  width={16}
                  height={16}
                />
              </div>
              <span className='text-black'>{tStaking('addToMetaMask')}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
