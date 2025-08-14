// import { useTranslations } from "next-intl"
import { FC } from 'react';
import { View } from '~/components';
import { cn, formatCurrency } from '~/lib/utils';

interface coolMessItem {
  title: string;
  value: string;
  unit: string;
  usdValue: string;
}

interface Props {
  coolMessList: coolMessItem[];
}

export const CoolingPoolStats: FC<Props> = ({ coolMessList }) => {
  // const t = useTranslations("coolingPool")

  return (
    <View
      clipDirection='topRight-bottomLeft'
      clipSize={16}
      className='grid grid-cols-2 md:flex md:items-center justify-between flex-col md:flex-row items-start gap-2 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
    >
      {coolMessList.map((stat, index) => (
        <div
          key={index}
          className={cn(
            'px-6 py-2 font-mono',
            index === 2 && 'lg:text-right',
            index === 0 && 'col-span-2'
          )}
        >
          <div className='text-xs text-foreground/50'>{stat.title}</div>
          <div
            className={cn(
              'flex items-baseline gap-2 md:flex-row',
              index !== 0 && 'flex-col gap-0'
            )}
          >
            <span
              className={cn(
                'text-sm md:text-2xl font-bold text-white text-nowrap mt-2',
                index === 1 && 'text-base'
              )}
            >
              {stat.value} {stat.unit}
            </span>
            <span className={'text-sm text-foreground/50'}>
              {formatCurrency(Number(stat.usdValue))}
            </span>
          </div>
        </div>
      ))}
    </View>
  );
};
