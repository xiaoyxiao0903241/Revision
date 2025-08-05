import { Abi, formatUnits } from 'viem';
import YielodLockAbi from '../../constants/YielodLockAbi.json';
import { yieldLocker as YieldLockerProxy } from '../../constants/tokens';
import { executeMulticall } from '~/lib/multicall';
import { formatNumbedecimalScale } from '~/lib/utils';

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
    console.log(res,'00000')
    if (res.length && res[0].data.length) {
      const list = res[0].data;
      list.map((it: periodItem) => {
        it['day'] = Number(it.releasedBlocks) / 57600;
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

// export const rewardList = async ({ address }: { address: string }) => {
//   try {
//     const res = (await executeMulticall({
//       calls: [
//         {
//           address: YieldLockerProxy as `0x${string}`,
//           abi: YielodLockAbi as Abi,
//           functionName: "getReleaseScheduleLength",
//           args: [],
//         },
//         // {
//         //   address: YieldLockerProxy as `0x${string}`,
//         //   abi: YielodLockAbi as Abi,
//         //   functionName: "claimableAll",
//         //   args: [address],
//         // },
//       ],
//     })) as { success: boolean; data: bigint }[];
//     console.log(res,'列表长度');
//     let allClaimable = "0";
//     // if (res.length && res[1].success) {
//     //   allClaimable = formatUnits(res[1].data, 9);
//     // }
//     if (res.length && res[0].success) {
//       const rewardLength = Number(res[0].data);
//       const rewardArr: rewardItem[] = [];

//       for (let i = 0; i < rewardLength; i++) {
//         const res = (await executeMulticall({
//           calls: [
//             {
//               //获取周期
//               address: YieldLockerProxy as `0x${string}`,
//               abi: YielodLockAbi as Abi,
//               functionName: "releases",
//               args: [i],
//             },
//           ],
//         })) as { success: boolean; data: [bigint, bigint, string] }[];
//         console.log(res,'获取周期');
//         if (res.length && res[0].data.length) {
//           console.log(i, "rewardLength");
//           const list = res[0].data;
//           console.log(Number(list[0]) / 43200,'dang')
//           //现在是[5,10,15,20]
//           const index =
//             Number(list[0]) / 43200 === 5
//               ? 0
//               : Number(list[0]) / 43200 === 10
//               ? 1
//               : Number(list[0]) / 43200 === 15
//               ? 2
//               : 3
//           const everyProfit = await executeMulticall({
//             calls: [
//               {
//                 //获取周期
//                 address: YieldLockerProxy as `0x${string}`,
//                 abi: YielodLockAbi as Abi,
//                 functionName: "claimable",
//                 args: [address, index],
//               },
//               {
//                 //获取区块高度
//                 address: YieldLockerProxy as `0x${string}`,
//                 abi: YielodLockAbi as Abi,
//                 functionName: "getLockers",
//                 args: [address, index],
//               },
//             ],
//           });
//           console.log(everyProfit,'everyProfit');
//           if (everyProfit.length) {
//             const data1 = everyProfit[0].data as bigint;
//             const data2 = everyProfit[1].data as {
//               isActive: boolean;
//               lastBlocks: bigint;
//               lockedAmount: bigint;
//               releasedAmount: bigint;
//             };
//             const profit = formatUnits(data1, 9);
//             rewardArr.push({
//               day: Number(list[0]) / 43200,
//               rate: Number(list[1]) / 100 + "%",
//               periodIndex: index,
//               profit: profit,
//               lastBlocks: Number(data2.lastBlocks),
//               remainingRewards: (
//                 Number(formatUnits(data2.lockedAmount, 9)) - Number(profit)
//               ).toString(),
//             });
//           }
//         }
//       }
//       console.log(rewardArr, "rewardArr");
//       return {
//         rewardArr,
//         allClaimable,
//       };
//     }
//     return null;
//   } catch (err: unknown) {
//     console.log(err);
//     return null;
//   }
// };

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
        if (res && res.length) {
          const profit = formatUnits(res[1].data as bigint, 9);
          allClaimable += Number(formatUnits(res[1].data as bigint, 9));

          const pending = formatNumbedecimalScale(
            Number(formatUnits(res[0].data as bigint, 9)) - Number(profit),
            9
          );
          allPending += Number(pending);
          rewardArr.push({
            day: Number(list[i].releasedBlocks) / 43200,
            periodIndex: i,
            claimable: profit,
            remainingRewards: pending.toString(),
          });
        }
      }
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
