import { FC } from 'react';
import { Input, View } from '~/components';
import { cn, formatDecimal, formatNumbedecimalScale } from '~/lib/utils';

export interface Balance {
  symbol: 'USDT' | 'OLY';
  description: string;
  icon: React.ReactNode;
  value?: string;
  profit?: number;
  address: string;
  olyPrice?: number;
}

export const SwapCard: FC<{
  data: Balance & {
    type: 'source' | 'destination';
  };
  onChange: (value: string) => void;
  children?: React.ReactNode;
}> = ({ data, onChange, children }) => {
  const { value } = data;
  return (
    <View className='bg-[#22285E] font-mono'>
      {/* Token Header */}
      <div className='flex items-center space-x-2 p-4 border-b border-border/20'>
        {data.icon}
        <div className='flex-1 flex flex-col gap-2'>
          <span className='font-semibold text-lg'>{data.symbol}</span>
          <span className='text-sm text-gray-400 font-chakrapetch'>
            {data.description}
          </span>
        </div>
        <div className='space-y-2 flex-1'>
          <Input.Number
            value={value}
            onChange={onChange}
            disabled={data.type === 'destination'}
            placeholder='0.0'
            className='text-xl font-bold text-right disabled:opacity-100'
          />
          <div className='flex justify-end items-center text-sm text-gray-400'>
            <span>
              ≈
              {data.symbol === 'USDT'
                ? formatNumbedecimalScale((data && data.value) || 0, 2)
                : formatNumbedecimalScale(
                    data && Number(data.value) * ((data && data.olyPrice) || 0),
                    2
                  )}
            </span>
            {data && data.symbol === 'USDT' && data.type === 'destination' ? (
              <>
                <span
                  className={cn('ml-2', {
                    'text-destructive': data.profit != null && data.profit < 0,
                    'text-success': data.profit != null && data.profit > 0,
                  })}
                >
                  ({`${formatDecimal(data.profit ?? 0)}%`})
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      {children}
    </View>
  );
};
