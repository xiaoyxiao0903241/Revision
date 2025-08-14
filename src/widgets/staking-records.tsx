import { useTranslations } from 'next-intl';
import { FC, ReactNode, useState } from 'react';
import { Button, Card, Icon, Tabs } from '~/components';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { cn, formatDecimal, formatHash } from '~/lib/utils';

// 事件颜色映射
const eventColors = {
  deposit: 'text-secondary',
  principal: 'text-destructive',
  rebase: 'text-success',
};

const Cell = ({
  children,
  className,
  title,
}: {
  className?: string;
  title: string;
  children: ReactNode;
}) => {
  return (
    <td
      className={cn(
        'py-3 px-4 gap-1 flex-1 flex flex-col justify-start text-sm',
        className
      )}
    >
      <div className='text-xs text-foreground/50'>{title}</div>
      <div className='flex flex-row items-center gap-2'>{children}</div>
    </td>
  );
};
interface recordType {
  id: string;
  amount: string;
  createdAt: string;
  hash: string;
  lockIndex: number;
  recordType: string;
}

export const StakingRecords: FC<{
  records: recordType[];
  changeTab: (type: string) => void;
  total: number;
}> = ({ records, changeTab, total = 0 }) => {
  const t = useTranslations('staking');
  const t2 = useTranslations('common');
  const [activeTab, setActiveTab] = useState(0);
  const { userAddress } = useUserAddress();
  // 标签页数据
  const tabData = [
    { label: t('allEvent'), href: '#', type: '' },
    { label: t('stake'), href: '#', type: 'deposit' },
    { label: t('unstake'), href: '#', type: 'principal' },
    { label: t('claim'), href: '#', type: 'rebase' },
  ];

  return (
    <Card>
      {/* 标签页 */}
      <div className='flex-1 flex md:hidden items-center justify-end'>
        <div className='text-base text-foreground'>
          {total} {t('recordsCount')}
        </div>
      </div>
      <Tabs
        data={tabData}
        activeIndex={activeTab}
        onChange={value => {
          changeTab(tabData[value].type);
          setActiveTab(value);
        }}
      >
        <div className='hidden flex-1 md:flex flex-col items-end justify-center'>
          <div className='text-base text-foreground'>
            {total} {t('recordsCount')}
          </div>
        </div>
      </Tabs>

      {/* 记录表格 */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <tbody className='flex flex-col gap-1'>
            {records?.length > 0 ? (
              records.map((record, index) => (
                <tr
                  key={index}
                  className='bg-foreground/5 mb-2 rounded-lg md:flex flex-row w-full grid grid-cols-2'
                >
                  <Cell
                    title={t('event')}
                    className={
                      eventColors[record.recordType as keyof typeof eventColors]
                    }
                  >
                    <Icon name='event' size={16} />
                    {record.recordType}
                  </Cell>
                  <Cell title={t('transactionHash')}>
                    <span
                      className='underline text-sm'
                      title={record.hash}
                      onClick={() => {
                        window.open(`https://bscscan.com/tx/${record.hash}`);
                      }}
                    >
                      {formatHash(record.hash)}
                    </span>
                  </Cell>
                  <Cell title={t('amount')}>
                    {formatDecimal(Number(record.amount), 2)}
                  </Cell>
                  <Cell title={t('dateTime')}>{record.createdAt}</Cell>
                </tr>
              ))
            ) : (
              <tr className='w-full'>
                <td
                  colSpan={5}
                  className='flex flex-col items-center justify-center text-foreground/50 bg-foreground/5 rounded-lg p-4 gap-2'
                >
                  {!userAddress ? (
                    <>
                      {t('walletNotConnected')}
                      <ConnectWalletButton />
                    </>
                  ) : (
                    <>
                      {t('noRecords')}
                      <Button
                        clipDirection='topRight-bottomLeft'
                        className='w-auto'
                      >
                        {t2('nodata')}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
