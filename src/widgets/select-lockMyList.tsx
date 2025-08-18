import { useTranslations } from 'next-intl';
import { FC } from 'react';
import {
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { formatCurrency } from '~/lib/utils';
import type { periodItem } from '~/wallet/lib/web3/claim';
import type { StakingItem } from '~/wallet/lib/web3/stake';

export const DurationSelect: FC<{
  options: StakingItem[];
  value?: number | '';
  onChange: (value: number) => void;
  placeholder?: string;
}> = ({ options, value, onChange, placeholder }) => {
  const t = useTranslations('staking');
  const selectedOption = options.find((it, index) => index === value);
  const { userAddress } = useUserAddress();

  return (
    <Select
      value={value?.toString()}
      onValueChange={value => {
        // const index = options.findIndex(
        //   it => Number(it.time) === Number(value)
        // );
        onChange(Number(value));
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={placeholder || t('selectDurationPlaceholder')}
        >
          <div className='flex  gap-2 w-[100%] justify-between'>
            <div className='flex items-center flex-1'>
              <RoundedLogo className='w-5 h-5' />
              <span className='flex-1 font-semibold text-sm ml-2'>
                {selectedOption && selectedOption.pending} OLY
              </span>
            </div>
            <span className='ml-3'>
              {selectedOption
                ? `${selectedOption.period} ${t('days')}`
                : placeholder || t('selectDurationPlaceholder')}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className='px-2 h-[200px] overflow-y-scroll overflow-x-hidden'>
        {userAddress &&
          (options.length > 0 ? (
            options.map((it, index) => (
              <SelectItem key={index} value={index.toString() || ''}>
                <div className='w-full flex justify-between'>
                  <div className='flex items-center'>
                    <RoundedLogo className='w-5 h-5' />
                    <span className='flex-1 font-semibold  ml-2'>
                      {it.pending} OLY
                    </span>
                  </div>
                  <span>
                    {it
                      ? `${it.period} ${t('days')}`
                      : placeholder || t('selectDurationPlaceholder')}
                  </span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className='text-center'>{t('noData')}</div>
          ))}
      </SelectContent>
    </Select>
  );
};

export const LockAmountSelect: FC<{
  options: { value: number; desc: string }[];
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}> = ({ options, value, onChange, placeholder }) => {
  const t = useTranslations('staking');
  const selectedOption = options.find(it => it.value === value);
  return (
    <Select
      value={value?.toString()}
      onValueChange={value => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder || t('selectStakingAmount')}>
          {selectedOption && (
            <div className='flex flex-row gap-2 w-full'>
              <RoundedLogo className='w-5 h-5' />
              <span className='flex-1 font-semibold text-sm'>
                {formatCurrency(selectedOption.value)}
              </span>
              <span>{selectedOption.desc}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(item => (
          <SelectItem key={item.value} value={item.value.toString()}>
            <div className='flex flex-row gap-2 w-full'>
              <RoundedLogo className='w-5 h-5' />
              <span className='flex-1 font-semibold text-sm'>
                {formatCurrency(item.value, false)}
              </span>
              <span>{item.desc}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const ClaimSelect: FC<{
  options: periodItem[];
  value?: number;
  onChange: (value: number) => void;
  placeholder?: string;
}> = ({ options, value, onChange, placeholder }) => {
  const t = useTranslations('staking');
  const selectedOption = options.find((it, index) => index === value);
  const { userAddress } = useUserAddress();
  return (
    <Select
      value={value?.toString()}
      onValueChange={value => {
        const index = options.findIndex(it => Number(it.day) === Number(value));
        onChange(index);
      }}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={placeholder || t('selectDurationPlaceholder')}
        >
          {selectedOption
            ? `${selectedOption.day} ${t('days')}`
            : placeholder || t('selectDurationPlaceholder')}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {userAddress ? (
          options.map(it => (
            <SelectItem key={it.day} value={it.day?.toString() || ''}>
              <div className='flex justify-between w-full'>
                <span>
                  {' '}
                  {it.day} {t('days')}
                </span>
                <span>{it.rate}</span>
              </div>
            </SelectItem>
          ))
        ) : (
          <div className='text-center'>
            <ConnectWalletButton className='text-xl  cursor-pointer px-6 !text-white text-5  min-w-[160px]   mx-auto' />
          </div>
        )}
      </SelectContent>
    </Select>
  );
};
