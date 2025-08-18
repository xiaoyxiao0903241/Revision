import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { RadioGroup } from '~/components';
import { useMock } from '~/hooks/useMock';
import { cn, formatDecimal } from '~/lib/utils';
import { useMockStore } from '~/store/mock';

export const BalanceCard: FC<{
  refreshSymbol?: string;
  balance: string;
  value?: string;
  symbol: string;
  closePer?: boolean;
  onChange?: (value: string) => void;
  refreshTokenBalance: () => void;
  onRefreshSymbol?: (value: string) => void;
}> = ({
  balance,
  value,
  onChange,
  symbol,
  refreshTokenBalance,
  closePer,
  onRefreshSymbol,
  refreshSymbol,
}) => {
  console.log(value);
  const t = useTranslations('swap');
  const { walletConnected: isLoading } = useMock();
  const [selectPer, setSelectPer] = useState('');
  const toggle = async () => {
    onRefreshSymbol?.(symbol);
    refreshTokenBalance();
    useMockStore.setState({
      walletConnected: true,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    useMockStore.setState({
      walletConnected: false,
    });
  };

  useEffect(() => {
    if (closePer) {
      setSelectPer('');
    }
  }, [closePer]);
  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-2'>
      <div className='text-sm text-gray-400 flex items-center gap-2'>
        <span>{t('myWallet')}</span>{' '}
        <span className='text-foreground'>
          {formatDecimal(Number(balance), 2)} {symbol}
        </span>
        <div className='cursor-pointer' onClick={toggle}>
          <Image
            src='/images/icon/refresh.png'
            alt='refresh'
            width={12}
            height={12}
            className={cn('w-3 h-3', {
              'animate-spin': isLoading && refreshSymbol === symbol,
            })}
          />
        </div>
      </div>
      {onChange && (
        <div className='flex space-x-2'>
          <RadioGroup
            options={[10, 25, 50, 100].map(item => ({
              label: `${item}%`,
              value: `${item}`,
            }))}
            value={selectPer}
            onChange={value => {
              onChange(`${(Number(value) / 100) * Number(balance)}`);
              setSelectPer(value);
            }}
          />
        </div>
      )}
    </div>
  );
};
