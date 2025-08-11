import { useUserAddress } from '~/contexts/UserAddressContext';
import { useQuery } from '@tanstack/react-query';
import { getClaimPeriod } from '~/wallet/lib/web3/claim';

export const usePeriods = () => {
  const { userAddress } = useUserAddress();
  const { data: periodList } = useQuery({
    queryKey: ['claimPeriod'],
    queryFn: () => getClaimPeriod(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000000,
  });

  return {
    periodList,
  };
};
