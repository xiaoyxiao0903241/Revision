import { FC, useState } from 'react';
import { Input, View } from '~/components';
import { cn, formatDecimal } from '~/lib/utils';

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
  const [focused, setFocused] = useState(false);
  return (
    <View
      className={cn('bg-[#22285E] font-mono p-[1px]', {
        gradient: focused,
      })}
    >
      <View className='bg-[#22285e]'>
        {/* Token Header */}
        <div className='flex items-center space-x-4 p-4 border-b border-border/20'>
          {data.icon}
          <div className='flex-1 flex flex-col gap-2 ml-[20px]'>
            <span className='font-semibold text-lg'>{data.symbol}</span>
            <span className='text-sm text-gray-400 font-chakrapetch'>
              {data.description}
            </span>
          </div>
          <div className='space-y-2 flex-1'>
            <Input.Number
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={data.type === 'destination'}
              placeholder='0.0'
              className='text-xl font-bold text-right disabled:opacity-100 caret-warning'
            />
            <div className='flex justify-end items-center text-sm text-gray-400'>
              <span>
                ~$
                {data.symbol === 'USDT'
                  ? formatDecimal(Number(data && data.value) || 0, 2)
                  : formatDecimal(
                      data &&
                        Number(data.value) * ((data && data.olyPrice) || 0),
                      2
                    )}
              </span>
              {data && data.symbol === 'USDT' && data.type === 'destination' ? (
                <>
                  <span
                    className={cn('ml-2', {
                      'text-destructive':
                        data.profit != null && data.profit < 0,
                      'text-success': data.profit != null && data.profit > 0,
                    })}
                  >
                    {/* ({`${formatDecimal(data.profit ?? 0)}%`}) */}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        {children}
      </View>
    </View>
  );
};
