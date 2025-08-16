'use client';
import { useQuery } from '@tanstack/react-query';
import { useSafeState } from 'ahooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GrayLogo from '~/assets/gray-logo.svg';
import { Button, Card, Statistics, View } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { getCurrentBlock } from '~/lib/multicall';
import { formatCurrency, formatNumbedecimalScale } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import { blocks as blocksNum } from '~/wallet/constants/tokens';
import type { StakingItem } from '~/wallet/lib/web3/stake';
import { getNodeStakes, getUserStakes } from '~/wallet/lib/web3/stake';
import { PositionDetails } from '~/widgets/position-details';
import { myMessDataType } from '../DashboardPage';

const Stake = ({ myMessInfo }: { myMessInfo: myMessDataType }) => {
  const safeMyMessInfo = myMessInfo || {};
  const t = useTranslations('dashboard');
  const t2 = useTranslations('tooltip');
  const router = useRouter();
  const [allStakeAmount, setAllStakeAmount] = useSafeState(0);
  const [rebalseProfit, setRebalseProfit] = useState<number>(0);
  // const [stakList, setstakList] = useState<StakingItem[]>([]);
  // 活期质押
  const { olyPrice, afterHotData, hotDataStakeNum, demandProfitInfo } =
    useNolockStore();
  const { userAddress } = useUserAddress();
  //质押列表
  const { data: myStakingList } = useQuery({
    queryKey: ['dashboardUserStakes', userAddress],
    queryFn: () => getUserStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    // retry: 1,
    refetchInterval: 20000,
  });

  //当前块
  const { data: currentBlock } = useQuery({
    queryKey: ['dashboarCurrentBlock'],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
  });

  //  节点质押
  const { data: myNodeStakingList } = useQuery({
    queryKey: ['dashboarUserNodeStakes', userAddress],
    queryFn: () => getNodeStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });

  // 获取长期质押时间最长的一条记录的剩余时间
  const getLongestStakingRemainingTime = () => {
    if (
      !myStakingList?.myStakingList ||
      myStakingList.myStakingList.length === 0
    ) {
      return 0;
    }

    // 过滤出长期质押记录并找出时间最长的一条
    const longestStaking = myStakingList.myStakingList.reduce(
      (prev, current) => {
        return parseInt(current.period) > parseInt(prev.period)
          ? current
          : prev;
      }
    );

    // 计算剩余时间
    const curBlock = Number(currentBlock);
    const time = String(
      Number(longestStaking.expiry) - curBlock < 0
        ? '0'
        : Number(longestStaking.expiry) - curBlock
    );

    // 转换为秒数
    const remainingSeconds = Number(time) * blocksNum;
    const days = Math.floor(remainingSeconds / (24 * 60 * 60));
    return days;
  };

  //获取质押总数量
  useEffect(() => {
    const updateList = async () => {
      let allStakeAmount =
        Number(hotDataStakeNum || 0) + Number(afterHotData?.principal || 0);
      let rebalseProfit = Number(demandProfitInfo?.rebalseProfit || 0);
      // let totalDays = 0;
      console.log(myStakingList, myNodeStakingList, '5555555');
      if (myStakingList?.myStakingList || myNodeStakingList?.length) {
        const list =
          (myStakingList?.myStakingList.length &&
            (myStakingList?.myStakingList as StakingItem[])) ||
          [];
        const nodeList = myNodeStakingList?.length
          ? (myNodeStakingList as StakingItem[])
          : [];
        const curBlock = Number(currentBlock);
        const allList = [...nodeList, ...list];
        const updatedList = allList.map(it => {
          allStakeAmount += it.pending;
          rebalseProfit += it.claimableBalance;
          const time = String(
            Number(it.expiry) - curBlock < 0
              ? '0'
              : Number(it.expiry) - curBlock
          );
          // const remainingSeconds = Number(time) * blocksNum;
          // const days = Math.floor(remainingSeconds / (24 * 60 * 60));
          // it.period
          // totalDays += Number(it.period || 0) - days;
          return {
            ...it,
            time,
            isShow: false,
          };
        });
        setRebalseProfit(rebalseProfit);
        console.log(updatedList, 'updatedList');
        // setstakList(updatedList);
        setAllStakeAmount(allStakeAmount);
      }
    };
    updateList();
  }, [
    myStakingList?.myStakingList,
    myStakingList,
    setAllStakeAmount,
    myNodeStakingList,
    afterHotData,
    currentBlock,
    demandProfitInfo,
  ]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
      {/* 质押仓位 */}
      <Card className='flex flex-col gap-4 relative'>
        <div className='grid grid-cols-2 gap-14'>
          <div className='flex flex-col gap-2 items-start'>
            <div className='w-6 h-6 rounded-full bg-foreground flex items-center justify-center'>
              <Image
                src='/images/widgets/logo.png'
                alt='oly'
                width={16}
                height={6}
              />
            </div>
            <span className='text-white'>{t('stakingPosition')}</span>
            <Button
              clipDirection='topLeft-bottomRight'
              clipSize={8}
              className='font-mono h-6 text-xs'
              onClick={() => {
                router.push('/swap');
              }}
            >
              {t('getOlyToken')}
            </Button>
          </div>
          <View
            clipDirection='topRight-bottomLeft'
            className='p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
          >
            <Statistics
              title={t('pendingRewardsBalance')}
              value={`${formatNumbedecimalScale(rebalseProfit ?? 0, 6)} OLY`}
              desc={`${formatCurrency(olyPrice * Number(safeMyMessInfo?.claimableBonus ?? 0))}`}
              size='md'
            />
          </View>
        </div>
        <div className='border-t border-foreground/10 w-full'></div>
        <PositionDetails
          data={{
            myStakedAmount: `${formatNumbedecimalScale(allStakeAmount || 0, 6)} OLY`,
            lifetimeRewards: `${formatNumbedecimalScale(safeMyMessInfo?.stakedRewardAmount || 0, 6)} OLY`,
            timeInPool: `${getLongestStakingRemainingTime()} d`,
            olyPrice: olyPrice || 0,
            info1: t2('dash.life_rewards'),
            info2: t2('dash.stake_left_time'),
          }}
        />
        <GrayLogo className='w-[76px] absolute right-6 bottom-2' />
      </Card>
      {/* 债券仓位 */}
      <Card className='flex flex-col gap-4 relative'>
        <div className='grid grid-cols-2 gap-14'>
          <div className='flex flex-col gap-2 items-start'>
            <div className='flex items-center'>
              <span className="bg-[url('/images/icon/usdt.png')] bg-cover bg-center w-6 h-6"></span>
              <span className="bg-[url('/images/icon/one.png')] bg-cover bg-center w-6 h-6 -translate-x-2"></span>
            </div>
            <span className='text-white'>{t('bondsPosition')}</span>
            <View
              clipDirection='topLeft-bottomRight'
              border={true}
              clipSize={8}
              borderWidth={2}
              borderColor='#434c8c'
              className='px-6 h-5 flex bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer'
            >
              <span className='text-xs text-white'>{t('getBonds')}</span>
            </View>
          </div>
          <View
            clipDirection='topRight-bottomLeft'
            className='p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
          >
            <Statistics
              title={t('pendingRewardsBalance')}
              value={`${formatNumbedecimalScale(safeMyMessInfo?.bondRewardAmount ?? 0, 6)} OLY`}
              desc='$0.00'
              size='md'
            />
          </View>
        </div>
        <div className='border-t border-foreground/10 w-full'></div>

        <PositionDetails
          data={{
            myStakedAmount: '0.00 OLY',
            lifetimeRewards: `${formatNumbedecimalScale(safeMyMessInfo?.bondRewardAmount || 0, 6)} OLY`,
            timeInPool: '0 d',
            olyPrice: olyPrice || 0,
            info1: t2('dash.bond_rewards'),
            info2: t2('dash.bonds_nleft_time'),
          }}
        />
      </Card>
    </div>
  );
};

export default Stake;
