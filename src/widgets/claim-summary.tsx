import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { InfoPopover, List } from '~/components';
import { formatCurrency, formatNumbedecimalScale } from '~/lib/utils';

export const ClaimSummary: FC<{
  data: {
    amount: number;
    taxRate: number;
    incomeTax: number;
  };
  incomeList?: Array<{ label: string; value: string }>;
}> = ({ data }) => {
  const t = useTranslations('staking');
  const t2 = useTranslations('tooltip');
  return (
    <List>
      <List.Item>
        <List.Label className='flex items-center gap-1'>
          {t('youWillReceive')}
          <InfoPopover className='w-56'>
            <div className='flex flex-col space-y-2'>{t2('stake.receive')}</div>
          </InfoPopover>
        </List.Label>
        <List.Value className='text-xl font-mono'>
          {data.amount ? formatNumbedecimalScale(data.amount || 0, 4) : '0.00'}{' '}
          OLY
        </List.Value>
      </List.Item>
      <List.Item>
        <List.Label>{t('taxRate')}</List.Label>
        <List.Value className='text-secondary font-mono'>
          {formatCurrency(data.taxRate, false)}%
        </List.Value>
      </List.Item>
      <List.Item>
        <List.Label>{t('incomeTax')}</List.Label>
        <List.Value className='font-mono'>
          {data.incomeTax
            ? formatNumbedecimalScale(data.incomeTax || 0, 4)
            : '0.00'}{' '}
          OLY
        </List.Value>
      </List.Item>
    </List>
  );
};
