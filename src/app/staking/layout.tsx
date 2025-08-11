'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Navigator } from '~/widgets';
import { useNolockStore } from '~/store/noLock';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { demandStakHis } from '~/services/auth/stake';
import { formatTimeToLocal } from '~/lib/utils';
import dayjs from 'dayjs';
import { getTokenPrice, getTokenBalance } from '~/wallet/lib/web3/bond';
import { getCurrentBlock } from '~/lib/multicall';
import {
  getEnchBlock,
  getBalanceToken,
  getAllnetReabalseNum,
  demandAfterHot,
  demandProfit,
  demandInfo,
} from '~/wallet/lib/web3/stake';
import { OLY, staking } from '~/wallet/constants/tokens';

interface StakingLayoutProps {
  children: React.ReactNode;
}
interface HistoryItem {
  amount: string;
  createdAt: string;
  hash: string;
  recordType: string;
}
export default function StakingLayout({ children }: StakingLayoutProps) {
  const t = useTranslations('staking');
  const [page] = useState<number>(1);
  const { userAddress } = useUserAddress();
  // const [lastStakeTimestamp, setLastStakeTimestamp] = useState(0);
  // const [time,setTime] = useState("");

  const { data: hisData100 } = useQuery({
    queryKey: ['demandStakHisData100', page, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await demandStakHis(
        userAddress,
        page,
        200,
        userAddress,
        ''
      );

      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 300000,
  });

  // oly单价
  const { data: olyPrice } = useQuery({
    queryKey: ['olyPrice'],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 100000,
  });

  // 获取当前块高度
  const { data: getCureentBlock } = useQuery({
    queryKey: ['currentBlock'],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  // 获取下个块高度
  const { data: nextBlock } = useQuery({
    queryKey: ['enchBlock'],
    queryFn: () => getEnchBlock(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  //获取全网质押的的oly数量
  const { data: AllolyStakeNum } = useQuery({
    queryKey: ['AllolyStakeNum', userAddress],
    queryFn: () =>
      getBalanceToken({
        address: staking as `0x${string}`,
        TOKEN_ADDRESSES: OLY,
        decimal: 9,
      }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 600000,
  });

  // 获取全网oly的rebase数量
  const { data: allnetReabalseNum } = useQuery({
    queryKey: ['allnetReabalseNum'],
    queryFn: () => getAllnetReabalseNum(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 600000,
  });

  //oly余额
  const { data: balance } = useQuery({
    queryKey: ['olyBalance', userAddress],
    queryFn: () => getTokenBalance({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    refetchInterval: 25000,
  });

  //热身期后的数据
  const { data: afterHotData } = useQuery({
    queryKey: ['DemandAfterHot', userAddress],
    queryFn: () => demandAfterHot({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 41000,
  });

  //获取静态收益
  const { data: demandProfitInfo } = useQuery({
    queryKey: ['UserDemandProfit', userAddress],
    queryFn: () => demandProfit({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 42000,
  });

  console.log(demandProfitInfo, 'demandProfitInfo222222');

  //热身期的数据
  const { data: hotData } = useQuery({
    queryKey: ['UserDemandInfo', userAddress],
    queryFn: () => demandInfo({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 400000,
  });

  useEffect(() => {
    useNolockStore.setState({
      hotDataStakeNum: Number(hotData?.stakNum),
    });
  }, [hotData]);

  useEffect(() => {
    useNolockStore.setState({
      demandProfitInfo: {
        rebalseProfit: demandProfitInfo?.rebalseProfit || 0,
        normalProfit: demandProfitInfo?.normalProfit || 0,
        allProfit: demandProfitInfo?.allProfit || 0,
        isClaim: demandProfitInfo?.isClaim || false,
      },
    });
  }, [demandProfitInfo]);

  useEffect(() => {
    useNolockStore.setState({
      afterHotData: {
        principal: afterHotData?.principal || 0,
      },
    });
  }, [afterHotData]);

  useEffect(() => {
    useNolockStore.setState({
      olyBalance: Number(balance),
    });
  }, [balance]);

  useEffect(() => {
    useNolockStore.setState({
      allnetReabalseNum: Number(allnetReabalseNum),
    });
  }, [allnetReabalseNum]);

  useEffect(() => {
    useNolockStore.setState({
      AllolyStakeNum: Number(AllolyStakeNum),
    });
  }, [AllolyStakeNum]);

  useEffect(() => {
    useNolockStore.setState({
      nextBlock: nextBlock,
    });
  }, [nextBlock]);

  useEffect(() => {
    useNolockStore.setState({
      currentBlock: getCureentBlock,
    });
  }, [getCureentBlock]);

  useEffect(() => {
    useNolockStore.setState({
      olyPrice: Number(olyPrice),
    });
  }, [olyPrice]);

  const items = [
    { label: t('stake'), href: '/staking' },
    { label: t('unstake'), href: '/staking/unstake' },
    { label: t('claim'), href: '/staking/claim' },
    { label: t('records'), href: '/staking/records' },
    { label: t('calculator'), href: '/staking/calculator' },
  ];

  useEffect(() => {
    if (hisData100 && hisData100.history && hisData100.history.length > 0) {
      const firStake = hisData100.history.filter(
        (it: HistoryItem) => it.recordType === 'deposit'
      );
      if (firStake.length) {
        const time = formatTimeToLocal(firStake[0].createdAt);
        const target = dayjs(time, 'YYYY-MM-DD HH:mm:ss')
          .add(24, 'hour')
          .unix();
        const now = dayjs().unix();
        if (now - target >= 0) {
          // setLastStakeTimestamp(0)
        } else {
          const diff = Number(target - now);
          // setLastStakeTimestamp(diff);
          // setTime(time)
          console.log(diff, 'diff');
          useNolockStore.setState({
            time: time,
            lastStakeTimestamp: diff,
            nextBlock: 1,
          });
        }
      }
    }
  }, [hisData100]);

  return (
    <div className='space-y-6'>
      {/* 次级导航栏 */}
      <Navigator items={items} />
      {/* 页面内容 */}
      {children}
    </div>
  );
}
