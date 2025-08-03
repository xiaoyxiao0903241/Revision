import { executeMulticall } from '@/lib/multicall';
import { Abi, formatUnits } from 'viem';
import TurbineAbi from '@/src/constants/TurbineAbi.json';
import { turbine as TurbineProxy } from '@/src/constants/tokens';

export const receiveList = async ({ address }: { address: string }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        //获取reciveList 长度
        {
          address: TurbineProxy as `0x${string}`,
          abi: TurbineAbi as Abi,
          functionName: 'silenceClaimInfoLength',
          args: [address],
        },
      ],
    })) as { success: boolean; data: bigint }[];
    const arr = [];
    if (res.length && res[0].success) {
      const listLength = Number(res[0].data);
      if (listLength) {
        for (let i = 0; i < listLength; i++) {
          const res = (await executeMulticall({
            calls: [
              {
                address: TurbineProxy as `0x${string}`,
                abi: TurbineAbi as Abi,
                functionName: 'getClaimInfo',
                args: [address, i],
              },
              {
                address: TurbineProxy as `0x${string}`,
                abi: TurbineAbi as Abi,
                functionName: 'percentVestedFor',
                args: [address, i],
              },
              {
                address: TurbineProxy as `0x${string}`,
                abi: TurbineAbi as Abi,
                functionName: 'vestingTerm',
                args: [],
              },
            ],
          })) as { success: boolean; data: [bigint, bigint, bigint, bigint] }[];
          if (res.length && res[0].success && res[1].success) {
            arr.push({
              isLockOver: Boolean(res[1].data),
              amount: formatUnits(res[0].data[1], 9),
              lastBlock: Number(res[0].data[3]),
              index: i,
              vestingTerm: Number(res[2].data),
            });
          }
        }
      }
    }

    return arr;
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};

export const getStakeNum = async ({ address }: { address: string }) => {
  try {
    //涡轮中锁定的数量
    const res = (await executeMulticall({
      calls: [
        {
          address: TurbineProxy as `0x${string}`,
          abi: TurbineAbi as Abi,
          functionName: 'turbineBal',
          args: [address],
        },
      ],
    })) as { success: boolean; data: bigint }[];

    if (res.length && res[0].success) {
      const stakeAmount = formatUnits(res[0].data, 9);
      return Number(stakeAmount);
    }
    return 0;
  } catch (err: unknown) {
    console.log(err);
    return 0;
  }
};
