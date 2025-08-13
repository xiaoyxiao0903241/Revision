import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { Statistics } from '~/components';
import { formatCurrency } from '~/lib/utils';

export const PositionDetails: FC<{
  data: {
    myStakedAmount: string;
    lifetimeRewards: string;
    timeInPool: string;
    olyPrice: number;
    info1?: string;
    info2?: string;
  };
}> = ({ data }) => {
  const t = useTranslations('dashboard');
  return (
    <div className='space-y-3'>
      <div className='text-foreground/50 font-medium'>
        {t('positionDetails')}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-36 gap-y-6'>
        <Statistics
          title={t('myStakedAmount')}
          value={data.myStakedAmount}
          desc={`$${formatCurrency(data?.olyPrice * Number(data?.myStakedAmount))}`}
          size='sm'
        />
        <Statistics
          title={t('lifetimeRewards')}
          value={data.lifetimeRewards}
          desc='$0.00'
          size='sm'
          info={<span>{data.info1}</span>}
        />
        <Statistics
          title={t('timeInPool')}
          value={data.timeInPool}
          size='sm'
          info={<span>{data.info2}</span>}
        />
      </div>
    </div>
  );
};
