import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FC, ReactNode, useEffect, useState } from 'react';
import { Card, Icon, Pager, Tabs } from '~/components';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { cn, formatDecimal, formatHash, formatTimeToLocal } from '~/lib/utils';
import { turbineRecord } from '~/services/auth/turbine';

// 事件颜色映射
const eventColors = {
  redeemed: 'text-secondary',
  received: 'text-success',
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
        'py-3 px-4 gap-1 flex flex-col flex-1 justify-start text-sm',
        className
      )}
    >
      <div className='text-xs text-foreground/50'>{title}</div>
      <div className='flex flex-row items-center gap-2'>{children}</div>
    </td>
  );
};

interface TurbineRecord {
  hash: string;
  turbineType: string;
  event: string;
  amount: number;
  createdAt: string;
}

export const TurbineRecords: FC = () => {
  const t = useTranslations('turbine');
  const [activeTab, setActiveTab] = useState(0);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const [history, setHistory] = useState<TurbineRecord[]>([]);
  const { userAddress } = useUserAddress();
  const [recordType, setRecordType] = useState('');

  //获取记录
  const { data: recordList } = useQuery({
    queryKey: ['getTurbineRecord', page, userAddress, recordType],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await turbineRecord(
        page,
        pageSize,
        userAddress,
        recordType
      );
      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 1000,
    refetchInterval: 30000,
  });
  useEffect(() => {
    if (recordList && recordList.history.length) {
      setHistory(recordList.history);
      setTotal(recordList.total);
      const pages = Math.ceil(recordList?.total / 10);
      setPages(pages);
    }
  }, [recordList]);

  useEffect(() => {
    setPage(1);
  }, [recordType]);
  // 标签页数据
  const tabData = [
    { label: t('allEvent'), href: '#', type: '' },
    { label: t('receive'), href: '#', type: 'received' },
    { label: t('claimEvent'), href: '#', type: 'redeemed' },
  ];

  return (
    <Card>
      {/* 标签页 */}
      <Tabs
        data={tabData}
        activeIndex={activeTab}
        onChange={value => {
          setRecordType(tabData[value].type);
          setActiveTab(value);
        }}
      >
        <div className='hidden flex-1 md:flex flex-col items-end justify-center'>
          <div className='text-base text-foreground'>
            {total} {t('records')}
          </div>
        </div>
        {/* <div className="text-xs text-foreground/50">
            {dayjs(dayjs().subtract(20, "seconds")).fromNow()}
          </div>
        </div> */}
      </Tabs>

      {/* 记录表格 */}
      <div className='md:overflow-x-auto'>
        <table className='w-full'>
          <tbody className='flex flex-col gap-1'>
            {history?.length > 0 ? (
              history.map(record => (
                <tr
                  key={record.hash}
                  className='bg-foreground/5 mb-2 rounded-lg md:flex flex-row w-full grid grid-cols-2'
                >
                  <Cell
                    title={t('event')}
                    className={
                      eventColors[
                        record.turbineType as keyof typeof eventColors
                      ]
                    }
                  >
                    <Icon
                      name={record.event === 'claim' ? 'event' : 'record'}
                      size={16}
                    />
                    {record.turbineType === 'claim'
                      ? t('claimEvent')
                      : t('receive')}
                  </Cell>
                  <Cell title={t('amount')}>
                    {formatDecimal(record.amount, 2)} OLY
                  </Cell>
                  <Cell title={t('transactionHash')}>
                    <a
                      href='#'
                      className='underline text-sm'
                      onClick={() => {
                        window.open(`https://bscscan.com/tx/${record.hash}`);
                      }}
                    >
                      {formatHash(record.hash)}
                    </a>
                  </Cell>
                  <Cell title={t('dateTime')}>
                    {formatTimeToLocal(record.createdAt)}
                  </Cell>
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
                    <>{t('noRecords')}</>
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
