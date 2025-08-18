import { Abi, formatUnits } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import { formatNumbedecimalScale } from '~/lib/utils';
import YielodLockAbi from '../../constants/YielodLockAbi.json';
import { yieldLocker as YieldLockerProxy } from '../../constants/tokens';

export interface periodItem {
  feeRate: bigint;
  feeRecipient: string;
  releasedBlocks: bigint;
  rate: string;
  day?: number;
}

export interface rewardItem {
  // rate: string;
  day?: number | string;
  periodIndex: number;
  // profit: string;
  // isActive: boolean,
  // lastBlocks: number;
  // lockedAmount: number | string,
  // releasedAmount: number | string,
  remainingRewards: string;
  claimable?: string;
  all: number;
}

//获取收益质押周期
export const getClaimPeriod = async () => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: YieldLockerProxy as `0x${string}`,
          abi: YielodLockAbi as Abi,
          functionName: 'getReleaseSchedules',
          args: [],
        },
      ],
    })) as { success: boolean; data: periodItem[] }[];
    if (res.length && res[0].data.length) {
      const list = res[0].data;
      list.map((it: periodItem) => {
        it['day'] = Number(it.releasedBlocks) / 115200;
        it['rate'] = Number(it.feeRate) / 100 + '%';
      });
      return list;
    }
    return [];
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};

//获取奖池列表
export const newRewardList = async ({ address }: { address: string }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: YieldLockerProxy as `0x${string}`,
          abi: YielodLockAbi as Abi,
          functionName: 'getReleaseSchedules',
          args: [],
        },
      ],
    })) as { success: boolean; data: periodItem[] }[];

    const rewardArr: rewardItem[] = [];
    let allClaimable = 0;
    let allPending = 0;
    console.log(res, '释放池的');
    if (res.length && res[0].data.length) {
      const list = res[0].data;
      for (let i = 0; i < list.length; i++) {
        const calls = [
          {
            //每个周期锁定的金额
            address: YieldLockerProxy as `0x${string}`,
            abi: YielodLockAbi as Abi,
            functionName: 'pendingForIndex',
            args: [address, i],
          },
          {
            //每个周期可领取的
            address: YieldLockerProxy as `0x${string}`,
            abi: YielodLockAbi as Abi,
            functionName: 'claimableForIndex',
            args: [address, i],
          },
        ];
        const res = await executeMulticall({
          calls: calls,
        });
        console.log(res, 'res000111');
        if (res && res.length) {
          const profit = formatUnits(res[1].data as bigint, 9);
          allClaimable += Number(formatUnits(res[1].data as bigint, 9));
          const pending = formatNumbedecimalScale(
            Number(formatUnits(res[0].data as bigint, 9)) - Number(profit),
            9
          );
          allPending += Number(pending);
          rewardArr.push({
            day: Number(list[i].releasedBlocks) / 57600,
            periodIndex: i,
            claimable: profit,
            remainingRewards: pending.toString(),
            all: Number(profit) + Number(pending),
          });
        }
      }
      console.log(rewardArr, 'rewardArr111');
      return {
        rewardArr: rewardArr,
        allClaimable: allClaimable,
        allPending: allPending,
      };
    }
    return null;
  } catch (err: unknown) {
    console.log(err);
    return null;
  }
};
