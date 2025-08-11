import { Countdown, List } from '~/components';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

export const StakingSummary: FC<{
  data: {
    rebaseRewardRate: string;
    rebaseBoost?: string;
    nextRebaseRewardRate?: string;
    endAt?: Date;
  };
}> = ({ data }) => {
  const t = useTranslations('staking');
  return (
    <List>
      <List.Item>
        <List.Label>{t('rebaseRewardRate')}</List.Label>
        <List.Value className='font-mono'>{data.rebaseRewardRate}</List.Value>
      </List.Item>
      {data.rebaseBoost && (
        <List.Item>
          <List.Label>{t('rebaseBoost')}</List.Label>
          <List.Value className='font-mono'>{data.rebaseBoost}</List.Value>
        </List.Item>
      )}
      {data.nextRebaseRewardRate && (
        <List.Item>
          <List.Label>{t('nextRebaseRewardRate')}</List.Label>
          <List.Value className='text-secondary font-mono'>
            {data.nextRebaseRewardRate}
          </List.Value>
        </List.Item>
      )}
      {data.endAt && (
        <List.Item>
          <List.Label>{t('countdownToNextRebase')}</List.Label>
          <List.Value className='font-mono'>
            <Countdown endAt={data.endAt} />
          </List.Value>
        </List.Item>
      )}
    </List>
  );
};
