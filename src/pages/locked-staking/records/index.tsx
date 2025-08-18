import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Alert } from '~/components';
import { Pager } from '~/components/pagination';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { longStakHis } from '~/services/auth/stake';
import { StakingRecords } from '~/widgets/staking-records';
import LockStakingLayout from '../layout';

export default function RecordsPage() {
  const t = useTranslations('staking');
  const [hisList, setHisList] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const { userAddress } = useUserAddress();
  const [recordType, setRecordType] = useState('');
  const [pages, setPages] = useState(0);

  const { data: hisData } = useQuery({
    queryKey: ['longStakHisData', page, userAddress, recordType],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await longStakHis(
        userAddress,
        page,
        10,
        userAddress,
        recordType
      );

      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 1000,
  });
  useEffect(() => {
    if (hisData) {
      setHisList(hisData.history);
      setTotal(hisData.total);
      const pages = Math.ceil(hisData?.total / 10);
      setPages(pages);
    }
  }, [hisData]);

  useEffect(() => {
    setPage(1);
  }, [recordType]);
  return (
    <LockStakingLayout>
      <div className='space-y-6'>
        <Alert
          icon='record'
          title={t('records')}
          description={t('recordsDescription')}
        />
        <StakingRecords
          records={hisList}
          changeTab={setRecordType}
          total={total}
        />
        {pages > 0 && (
          <Pager
            currentPage={page}
            totalPages={pages}
            onPageChange={setPage}
          ></Pager>
        )}
      </div>
    </LockStakingLayout>
  );
}
