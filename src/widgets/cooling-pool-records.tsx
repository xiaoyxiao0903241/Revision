import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Button, Card, Icon, Pager, Tabs } from '~/components';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { cn, formatHash, formatNumbedecimalScale } from '~/lib/utils';
import { rewardRecord } from '~/services/auth/claim';
import { getClaimPeriod } from '~/wallet/lib/web3/claim';

// 事件颜色映射
const eventColors = {
  locked: 'text-secondary',
  claimed: 'text-success',
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
        'py-3 px-4 gap-1 text-sm flex flex-col justify-start',
        className
      )}
    >
      <div className='text-xs text-foreground/50'>{title}</div>
      <div className='flex flex-row items-center gap-2'>{children}</div>
    </td>
  );
};
interface ReciveItem extends Record<string, unknown> {
  time: string;
  type: string;
  amount: string;
  hash: string;
  lockIndex: number;
  yieldType: string;
  createdAt: string;
  day?: string;
  roi?: string;
}

export const CoolingPoolRecords: FC = () => {
  const t = useTranslations('coolingPool');
  const t2 = useTranslations('common');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState<number>(1);
  const { userAddress } = useUserAddress();
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState<number>(0);
  const pageSize = 10;
  const [pages, setPages] = useState(0);

  // 标签页数据
  const tabData = [
    { label: t('allEvent'), href: '#' },
    { label: t('receive'), href: '#' },
    { label: t('claimEvent'), href: '#' },
  ];

  // 获取记录
  const { data: rewardHisInfo } = useQuery({
    queryKey: ['getRewardRecord', userAddress, page, pageSize, activeTab],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await rewardRecord(
        page,
        pageSize,
        userAddress,
        activeTab == 0 ? '' : activeTab == 1 ? 'locked' : 'claimed'
      );
      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 1000,
  });

  //获取锁定周期
  const { data: claimPeriodList } = useQuery({
    queryKey: ['claimPeriod'],
    queryFn: () => getClaimPeriod(),
    enabled: Boolean(userAddress),
    retry: 1,
  });
  useEffect(() => {
    if (rewardHisInfo && claimPeriodList?.length) {
      const list = rewardHisInfo.history;
      list.map((it: ReciveItem) => {
        it['day'] = claimPeriodList[it.lockIndex].day + ' ' + t('days');
        it['roi'] = claimPeriodList[it.lockIndex].rate;
      });
      console.log(list, 'list11');
      setHistory(list);
      setTotal(rewardHisInfo.total);
      const pages = Math.ceil(rewardHisInfo.total / 10);
      setPages(pages);
    }
  }, [rewardHisInfo, claimPeriodList, t]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);
  return (
    <Card>
      {/* 标签页 */}
      <div className='flex flex-1 md:hidden items-center justify-between'>
        <div className='text-base text-foreground'>
          {total} {t('recordsCount')}
        </div>
      </div>
      <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
        <div className='hidden flex-1 md:flex flex-col items-end justify-center'>
          <div className='text-base text-foreground'>
            {total} {t('recordsCount')}
          </div>
        </div>
      </Tabs>

      {/* 记录表格 */}
      <div className='md:overflow-x-auto'>
        <table className='w-full'>
          <tbody className='flex flex-col gap-1'>
            {history.length > 0 ? (
              history.map((record: ReciveItem) => (
                <tr
                  key={record.hash}
                  className='bg-foreground/5 mb-2 rounded-lg w-full grid grid-cols-2 md:grid-cols-6'
                >
                  <Cell
                    title={t('event')}
                    className={
                      eventColors[record.yieldType as keyof typeof eventColors]
                    }
                  >
                    <Icon
                      name={record.yieldType === 'claimed' ? 'event' : 'record'}
                      size={16}
                    />
                    {record.yieldType === 'claimed'
                      ? t('claimEvent')
                      : t('receive')}
                  </Cell>
                  <Cell title={t('releaseNum')}>
                    {formatNumbedecimalScale(record.amount, 2)} OLY
                  </Cell>
                  <Cell title={t('releaseDay')}>{record.day as string}</Cell>
                  <Cell title={t('releaseRate')}>{record.roi as string}</Cell>
                  <Cell title={t('transactionHash')}>
                    <a
                      href='#'
                      className='underline text-sm'
                      title={record.hash}
                      onClick={() => {
                        window.open(`https://bscscan.com/tx/${record.hash}`);
                      }}
                    >
                      {formatHash(record.hash)}
                    </a>
                  </Cell>
                  <Cell title={t('dateTime')}>{record.createdAt}</Cell>
                </tr>
              ))
            ) : (
              <tr className='w-full'>
                <td
                  colSpan={4}
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
          {/* 分页 */}
          {pages > 0 && (
            <tfoot>
              <tr>
                <td colSpan={4} className='flex justify-center items-center'>
                  <Pager
                    currentPage={page}
                    totalPages={pages}
                    onPageChange={setPage}
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </Card>
  );
};
