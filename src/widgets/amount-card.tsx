import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { Input, RoundedLogo, View } from '~/components';
import { cn, formatNumbedecimalScale } from '~/lib/utils';

export const AmountCard: FC<{
  data: {
    value: number | string;
    desc: number | string;
    balance: number;
  };
  description: string;
  onChange?: (value: string) => void;
}> = ({ data, description, onChange }) => {
  const t = useTranslations('staking');
  const [focused, setFocused] = useState(false);
  return (
    <View
      className={cn('p-[1px] transition-all', {
        gradient: focused,
        'bg-[#22285E]': !focused,
      })}
      clipDirection='topRight-bottomLeft'
    >
      <View className='bg-[#22285E] p-4' clipDirection='topRight-bottomLeft'>
        <div className='flex items-center justify-between border-b border-border/20 py-4'>
          <div>
            <label className='text-sm font-medium text-white'>
              {t('amount')}
            </label>
            <div className='flex gap-2'>
              <Input.Number
                value={data.value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder='0.0'
                step={0.000001}
                maxDecimals={2}
                className={cn(
                  'flex-1 text-white text-xl md:text-2xl font-bold font-mono',
                  {
                    'caret-warning': focused,
                  }
                )}
              />
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <RoundedLogo />
            <span className='text-white font-mono'>OLY</span>
          </div>
        </div>
        <div className='flex items-center justify-between text-xs text-foreground/70 py-4'>
          <span className='font-mono'>
            ${formatNumbedecimalScale(data.desc, 2)}
          </span>
          <div className='flex items-center gap-2'>
            <span className='font-mono'>{description}</span>
            <span className='font-mono text-white'>
              {`${formatNumbedecimalScale(data.balance, 6)} OLY`}
            </span>
            <span
              className='font-mono text-gradient cursor-pointer text-gradient'
              onClick={() => {
                onChange?.(formatNumbedecimalScale(data.balance, 6));
              }}
            >
              {t('useMax')}
            </span>
          </div>
        </div>
      </View>
    </View>
  );
};
