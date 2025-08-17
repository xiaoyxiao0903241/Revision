import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { InfoPopover, List } from '~/components';
import { infoItems } from '~/hooks/useMock';
import { formatCurrency, formatNumbedecimalScale } from '~/lib/utils';

export const ClaimSummary: FC<{
  data: {
    amount: number;
    taxRate: number;
    incomeTax: number;
  };
  incomeList?: Array<{ label: string; value: string }>;
}> = ({ data, incomeList }) => {
  const t = useTranslations('staking');
  return (
    <List>
      <List.Item>
        <List.Label className='flex items-center gap-1'>
          {t('youWillReceive')}
          <InfoPopover className='w-56'>
            <div className='flex flex-col space-y-2'>
              {(incomeList?.length ? incomeList : infoItems).map(item => (
                <div key={item.label} className='flex justify-between'>
                  <span className='text-foreground/50'>{item.label}</span>
                  <span className='text-secondary'>{item.value}</span>
                </div>
              ))}
            </div>
          </InfoPopover>
        </List.Label>
        <List.Value className='text-xl font-mono'>
          {formatNumbedecimalScale(data.amount || 0, 6)} OLY
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
          {formatNumbedecimalScale(data.incomeTax || 0, 6)} OLY
        </List.Value>
      </List.Item>
    </List>
  );
};
