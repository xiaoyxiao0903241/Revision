import { AddToWallet } from './addToWallet';
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
  // const tStaking = useTranslations('staking');
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
        {onClick && <AddToWallet></AddToWallet>}
      </div>
    </div>
  );
}
