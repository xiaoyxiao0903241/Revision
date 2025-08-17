import _ from 'lodash';
import { useTranslations } from 'next-intl';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Card, CardContent, Icon, Tabs } from '~/components';
import ProTable, { ProTableColumn } from '~/components/ProTable';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { usePeriods } from '~/hooks/userPeriod';
import { formatNumbedecimalScale } from '~/lib/utils';
import { rewardHistoryList, rewardList } from '~/services/auth/dao';

type DaoRecordsParams = {
  currentPage: number;
  pageSizeProp: number;
  userAddress: string;
  type: string;
};

type DaoRecordItem = {
  event?: string;
  hash?: string;
  amount?: string;
  lockIndex?: number;
  lockIndex_n?: number;
  createdAt?: string;
  actBonus?: string;
  unlockNum?: number;
  stakeAmount?: string;
  lossBonus?: string;
  createTime?: string;
  sourceNum?: number;
  benefitLevel?: number;
  market?: string;
  smallMarket?: string;
  fromAddress?: string;
  interest?: string;
  recipient?: string;
  sendAmount?: string;
};

export type DaoRecordsRef = {
  handleManualRefresh: () => void;
};

const DaoRecords = forwardRef<DaoRecordsRef, { type: string }>(
  ({ type }, ref) => {
    const t = useTranslations('dao');
    const tStaking = useTranslations('staking');
    const tTurbine = useTranslations('turbine');
    const [activeTab, setActiveTab] = useState(0);
    const { userAddress } = useUserAddress();
    const [total, setTotal] = useState<number>(0);
    const [columns, setColumns] = useState<ProTableColumn<DaoRecordItem>[]>([]);
    const proTableRef = useRef<(() => void) | undefined>(undefined);
    const periodListData = usePeriods();

    const lockIndexDataSource = [
      {
        value: 0,
        label: `5 ${tStaking('days')}`,
        number: 5,
      },
      {
        value: 1,
        label: `10 ${tStaking('days')}`,
        number: 10,
      },
      {
        value: 2,
        label: `15 ${tStaking('days')}`,
        number: 15,
      },
      {
        value: 3,
        label: `20 ${tStaking('days')}`,
        number: 20,
      },
    ];

    // 标签页数据
    const tabData = [
      { label: t('bonus_record'), href: '#' },
      { label: t('claim_record'), href: '#' },
    ];

    const evnetColumn: ProTableColumn<DaoRecordItem> = {
      title: t('event'),
      dataIndex: 'event',
      key: 'event',
      render: () => {
        return (
          <span className='text-secondary'>
            <Icon name='event' size={16} className='mr-2' />
            {t('bonus_event_type')}
          </span>
        );
      },
    };
    const historyColumns: ProTableColumn<DaoRecordItem>[] = [
      {
        title: t('event'),
        dataIndex: 'event',
        key: 'event',
        render: () => {
          return (
            <span className='text-secondary'>
              <Icon name='event' size={16} className='mr-2' />
              {tStaking('claim')}
            </span>
          );
        },
      },
      {
        title: t('quantity_claimed'),
        dataIndex: 'amount',
        key: 'amount',
        render: (value: string | number | boolean | undefined) => {
          return <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>;
        },
      },
      {
        title: t('lockingCycle'),
        dataIndex: 'lockIndex',
        key: 'lockIndex',
        render: (value: string | number | boolean | undefined) => {
          const item = _.find(lockIndexDataSource, { value: Number(value) });
          return <>{item?.label}</>;
        },
      },
      {
        title: tStaking('taxRate'),
        dataIndex: 'lockIndex',
        key: 'lockIndex',
        render: (value: string | number | boolean | undefined) => {
          const number = _.find(lockIndexDataSource, {
            value: Number(value),
          })?.number;
          const periodItem = _.find(periodListData?.periodList || [], {
            day: Number(number),
          });
          if (periodItem?.rate) {
            return periodItem.rate;
          }
          return <>0 %</>;
        },
      },
      {
        title: tTurbine('amountToSend'),
        dataIndex: 'sendAmount',
        key: 'sendAmount',
        render: (value: string | number | boolean | undefined, _record) => {
          const number = _.find(lockIndexDataSource, {
            value: Number(_record?.lockIndex),
          })?.number;
          const periodItem = _.find(periodListData?.periodList || [], {
            day: Number(number),
          });
          const currentRate = Number(periodItem?.rate?.split('%')[0]);
          if (periodItem?.rate) {
            return (
              <>
                {formatNumbedecimalScale(
                  Number(_record?.amount || 0) * ((100 - currentRate) / 100),
                  6
                )}{' '}
                OLY
              </>
            );
          }
          return <>0.000000 OLY</>;
        },
      },
      {
        title: t('transaction_hash'),
        dataIndex: 'hash',
        key: 'hash',
        render: {
          link: true,
          href: (value: string | number | boolean | undefined) =>
            `https://bscscan.com/address/${value}`,
          target: '_blank',
          valueType: 'hash',
        },
      },

      {
        title: t('date_time'),
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: {
          valueType: 'dateTime',
        },
      },
    ];

    const switchColumns = (type: string) => {
      let list: ProTableColumn<DaoRecordItem>[] = [];
      switch (type) {
        case 'matrix':
          list = [
            evnetColumn,
            {
              title: t('unlock_layers_label'),
              dataIndex: 'unlockNum',
              key: 'unlockNum',
            },
            {
              title: t('net_position_quantity'),
              dataIndex: 'stakeAmount',
              key: 'stakeAmount',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('bonus_amount'),
              dataIndex: 'actBonus',
              key: 'actBonus',
              render: (value: string | number | boolean | undefined) => {
                return <>{value} OLY</>;
              },
            },

            {
              title: t('loss_bonus_amount'),
              dataIndex: 'lossBonus',
              key: 'lossBonus',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('date_time'),
              dataIndex: 'createTime',
              key: 'createTime',
              render: {
                valueType: 'dateTime',
              },
            },
          ];
          break;
        case 'promotion':
          list = [
            evnetColumn,
            {
              title: t('community_level'),
              dataIndex: 'benefitLevel',
              key: 'benefitLevel',
            },
            {
              title: t('small_team_performance'),
              dataIndex: 'smallMarket',
              key: 'smallMarket',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('total_performance'),
              dataIndex: 'market',
              key: 'market',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },

            {
              title: t('bonus_amount'),
              dataIndex: 'actBonus',
              key: 'actBonus',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('date_time'),
              dataIndex: 'createTime',
              key: 'createTime',
              render: {
                valueType: 'dateTime',
              },
            },
          ];
          break;
        case 'lead':
          list = [
            evnetColumn,
            {
              title: t('unlock_number_of_preaching_members'), // t('v_level_members_within_10_layers'),
              dataIndex: 'sourceNum',
              key: 'sourceNum',
            },
            {
              title: t('bonus_amount'),
              dataIndex: 'actBonus',
              key: 'actBonus',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },

            {
              title: t('date_time'),
              dataIndex: 'createTime',
              key: 'createTime',
              render: {
                valueType: 'dateTime',
              },
            },
          ];
          break;
        case 'service':
          list = [
            evnetColumn,
            {
              title: t('source_address'),
              dataIndex: 'fromAddress',
              key: 'fromAddress',
              render: {
                link: true,
                href: value => `https://bscscan.com/address/${value}`,
                target: '_blank',
                valueType: 'hash',
              },
            },
            {
              title: t('source_address_transaction_amount'),
              dataIndex: 'interest',
              key: 'interest',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('bonus_amount'),
              dataIndex: 'actBonus',
              key: 'actBonus',
              render: (value: string | number | boolean | undefined) => {
                return (
                  <>{formatNumbedecimalScale(Number(value || 0), 6)} OLY</>
                );
              },
            },
            {
              title: t('transaction_hash'),
              dataIndex: 'hash',
              key: 'hash',
              render: {
                link: true,
                href: (value: string | number | boolean | undefined) =>
                  `https://bscscan.com/address/${value}`,
                target: '_blank',
                valueType: 'hash',
              },
            },
            {
              title: t('date_time'),
              dataIndex: 'createTime',
              key: 'createTime',
              render: {
                valueType: 'dateTime',
              },
            },
          ];
          break;
      }
      setColumns(list);
    };

    const handleManualRefresh = () => {
      if (proTableRef.current) {
        proTableRef.current();
      }
    };

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      handleManualRefresh,
    }));

    useEffect(() => {
      switchColumns(type);
    }, [activeTab, type]);

    return (
      <Card>
        <CardContent className='space-y-6 px-0 md:px-6'>
          {/* 标签页 */}
          <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
            <div className='flex-1 flex flex-col justify-center items-end'>
              <div className='text-base text-foreground'>
                {total} {tStaking('records')}
              </div>
              <div className='text-xs text-foreground/50'></div>
            </div>
          </Tabs>

          {activeTab === 0 && (
            <div className='overflow-x-auto'>
              <ProTable
                onRefreshRef={proTableRef}
                columns={activeTab === 0 ? columns : historyColumns}
                queryFn={params => {
                  const { currentPage, pageSizeProp, type } =
                    params as DaoRecordsParams;
                  return rewardList(
                    currentPage,
                    pageSizeProp,
                    userAddress as string,
                    type
                  );
                }}
                params={{ userAddress, type }}
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
            </div>
          )}
          {activeTab === 1 && (
            <div className='overflow-x-auto'>
              <ProTable
                onRefreshRef={proTableRef}
                columns={historyColumns}
                queryFn={params => {
                  const { currentPage, pageSizeProp, type } =
                    params as DaoRecordsParams;
                  return rewardHistoryList(
                    currentPage,
                    pageSizeProp,
                    userAddress as string,
                    type
                  );
                }}
                params={{ userAddress, type }}
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
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
DaoRecords.displayName = 'DaoRecords';
export default DaoRecords;
