import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Alert } from '~/components';
import { Pager } from '~/components/pagination';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { demandStakHis } from '~/services/auth/stake';
import { StakingRecords } from '~/widgets/staking-records';
import StakingLayout from '../layout';

export default function RecordsPage() {
  const t = useTranslations('staking');
  const [page, setPage] = useState<number>(1);
  const { userAddress } = useUserAddress();
  const [hisList, setHisList] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [recordType, setRecordType] = useState('');
  const { data: hisData } = useQuery({
    queryKey: ['demandStakHisData', page, userAddress, recordType],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await demandStakHis(
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
    retryDelay: 30000,
  });
  useEffect(() => {
    setHisList(hisData?.history);
    const pages = Math.ceil(hisData?.total / 10);
    setPages(pages);
    setTotal(hisData?.total);
  }, [hisData]);

  useEffect(() => {
    setPage(1);
  }, [recordType]);
  return (
    <StakingLayout>
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
    </StakingLayout>
  );
}
