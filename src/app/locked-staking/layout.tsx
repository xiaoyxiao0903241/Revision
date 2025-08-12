'use client';

import { useTranslations } from 'next-intl';
// import { useUserAddress } from '~/contexts/UserAddressContext';
import { Navigator } from '~/widgets';

interface LockStakingLayoutProps {
  children: React.ReactNode;
}

export default function LockStakingLayout({
  children,
}: LockStakingLayoutProps) {
  const t = useTranslations('staking');
  // const { userAddress } = useUserAddress();
  const items = [
    { label: t('stake'), href: '/locked-staking' },
    { label: t('unstake'), href: '/locked-staking/unstake' },
    { label: t('claim'), href: '/locked-staking/claim' },
    { label: t('records'), href: '/locked-staking/records' },
    { label: t('calculator'), href: '/locked-staking/calculator' },
  ];

  // // oly单价
  // const { data: olyPrice } = useQuery({
  //   queryKey: ['olyPrice'],
  //   queryFn: getTokenPrice,
  //   enabled: true,
  //   retry: 1,
  //   retryDelay: 10000,
  // });

  // useEffect(() => {
  //   useLockStore.setState({
  //     olyPrice: Number(olyPrice),
  //   });
  // }, [olyPrice]);

  // //oly余额
  // const { data: balance } = useQuery({
  //   queryKey: ['olyBalance', userAddress],
  //   queryFn: () => getTokenBalance({ address: userAddress as `0x${string}` }),
  //   enabled: Boolean(userAddress),
  //   refetchInterval: 25000,
  // });

  // useEffect(() => {
  //   useLockStore.setState({
  //     olyBalance: Number(balance),
  //   });
  // }, [balance]);

  return (
    <div className='space-y-6'>
      {/* 次级导航栏 */}
      <Navigator items={items} />
      {/* 页面内容 */}
      {children}
    </div>
  );
}
