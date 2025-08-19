import { useTranslations } from 'next-intl';
import { useState } from 'react';
import List from '~/assets/list.svg';
import { Card, CardTitle } from '~/components';
import ProTable, { ProTableColumn } from '~/components/ProTable';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { formatNumbedecimalScale } from '~/lib/utils';
import { inviteHisList } from '~/services/auth/invite';

// interface InviteDataSource {
//   address: string;
//   createdAt: string;
//   performance: string;
//   stakedAmount: string;
// }
type InviteDataParams = {
  currentPage: number;
  pageSizeProp: number;
  userAddress: string;
};
const InviteRecord = () => {
  const t = useTranslations('community');
  const [total, setTotal] = useState<number>(0);
  const { userAddress } = useUserAddress();

  const formatText = (value: string) => {
    return (
      <span>
        {formatNumbedecimalScale(Number(value || 0), 6)}{' '}
        <span className='text-gradient'> OLY</span>
      </span>
    );
  };

  const columns: ProTableColumn<Record<string, any>>[] = [
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
      render: {
        link: true,
        href: value => `https://bscscan.com/address/${value}`,
        target: '_blank',
        valueType: 'hash',
        // render: (value: string) => value, // 自定义渲染
      },
    },
    {
      title: t('netHolding'),
      dataIndex: 'stakedAmount',
      key: 'stakedAmount',
      render: value => formatText(value as string),
    },
    {
      title: t('totalCommunityPerformance'),
      dataIndex: 'performance',
      key: 'performance',
      render: value => formatText(value as string),
    },
    {
      title: t('joinTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: {
        valueType: 'dateTime', // 自动格式化为日期时间
      },
    },
  ];

  return (
    <Card>
      <div className='flex justify-between items-center'>
        <CardTitle className='text-xl font-bold text-white flex items-center gap-2'>
          <List className='w-6 h-6' />
          {t('referralList')}
        </CardTitle>
        <div className='flex flex-col gap-1 text-right'>
          <span className='text-white'>
            {total} {t('records')}
          </span>
          {/* <span className="text-xs text-foreground/50">
            {dayjs().fromNow()}
          </span> */}
        </div>
      </div>

      <ProTable
        columns={columns}
        queryFn={(params: Record<string, unknown>) => {
          const { currentPage, pageSizeProp, userAddress } =
            params as InviteDataParams;
          // 请求数据
          return inviteHisList(currentPage, pageSizeProp, userAddress);
        }}
        notDataText={t('notData')}
        params={{ userAddress }}
        formatResult={data => {
          const total = data?.total || 0;
          return {
            dataSource: data?.records || [],
            total,
          };
        }}
        onSuccess={data => {
          setTotal(data?.total || 0);
        }}
      />
    </Card>
  );
};

export default InviteRecord;
