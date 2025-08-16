import { useTranslations } from 'next-intl';
import { FC } from 'react';
import { InfoPopover, List } from '~/components';
import { infoItems } from '~/hooks/useMock';
import { formatCurrency, formatDecimal } from '~/lib/utils';

export const ClaimSummary: FC<{
  data: {
    amount: number;
    taxRate: number;
    incomeTax: number;
  };
}> = ({ data }) => {
  const t = useTranslations('staking');
  return (
    <List>
      <List.Item>
        <List.Label className='flex items-center gap-1'>
          {t('youWillReceive')}
          <InfoPopover>
            <div className='flex flex-col space-y-2'>
              {infoItems.map(item => (
                <div key={item.label} className='flex justify-between'>
                  <span className='text-foreground/50'>{item.label}</span>
                  <span className='text-secondary'>{item.value}</span>
                </div>
              ))}
            </div>
          </InfoPopover>
        </List.Label>
        <List.Value className='text-xl font-mono'>
          {formatDecimal(data.amount, 6)} OLY
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
          {formatDecimal(data.incomeTax, 6)} OLY
        </List.Value>
      </List.Item>
    </List>
  );
};
