import { Address, Abi, formatUnits, erc20Abi } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import {
  longStaking5,
  // longStaking60,
  // longStaking90,
  longStaking180,
  longStaking360,
  staking,
  distributor,
  demandStaking,
  sOLY,
  OLY,
  nodeStaking,
} from '../../constants/tokens';
import LongStakingAbi from '../../constants/LongStakingAbi.json';
import StakingAbi from '../../constants/staking.json';
import DemandStakingAbi from '../../constants/DemandStakingAbi.json';
import DistributorAbi from '../../constants/DistributorAbi.json';
import NodeStakingAbi from '../../constants/NodeStaking.json';

interface ContractCall {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: (string | number | boolean | Address)[];
  bondIndex?: number;
  period?: string;
}

export interface periodlongItem extends Record<string, string | number | boolean> {
  token: string;
  day: string;
  period: string;
  rate: string;
  addition:string;
  tvl: number | string;
  balance: string;
  isApprove: boolean;
  amount: number;
}

export const depositDayList = [
  {
    token: longStaking5,
    day: '5',
  },
  // {
  //   token: longStaking60,
  //   day: "60 Day",
  // },
  // {
  //   token: longStaking90,
  //   day: '90',
  // },
  {
    token: longStaking180,
    day: '180',
  },
  {
    token: longStaking360,
    day: '360',
  },
];

//收益率 写死
export const roi = () => {
  return [
    {
      rate:"(0.3%-1%)",
      addition:"(0.02-0.04)"
    },
    {
      rate:"(0.3%-1%)",
      addition:"(0.02-0.08)"
    },
    {
      rate:"(0.3%-1%)",
      addition:"(0.02-0.09)"
    }
  ];
};
export interface StakingItem {
  pending: number;
  period: string;
  blockReward: number;
  interest: number;
  claimableBalance: number;
  time?: string;
  isShow?: boolean;
  index: number;
  type: string;
  [key: string]: string | number | boolean | undefined;
}

// 获取我的质押数据(长期质押)
export const getUserStakes = async ({ address }: { address: Address }) => {
  const calls: ContractCall[] = [];
  depositDayList.forEach(it => {
    calls.push({
      address: it.token as `0x${string}`,
      abi: LongStakingAbi as Abi,
      functionName: 'getUserStakesCount',
      args: [address],
    });
  });

  try {
    const res = await executeMulticall<[bigint]>({
      calls,
    });
    if (!res.length) return { myStakingList: [] };
    // 获取每条质押的详细信息
    const stakingItemCalls: ContractCall[] = [];
    const stakingCounts: number[] = [];
    res.forEach(result => {
      if (result.success) {
        const count = Number(result.data);
        stakingCounts.push(count);
        for (let i = 0; i < count; i++) {
          stakingItemCalls.push({
            address: depositDayList[stakingCounts.length - 1]
              .token as `0x${string}`,
            abi: LongStakingAbi as Abi,
            functionName: 'listStake',
            args: [address, i],
            bondIndex: i,
            period: depositDayList[stakingCounts.length - 1].day,
          });
        }
      }
    });
    if (stakingItemCalls.length === 0) return { myStakingList: [] };
    const stakingItemRes = await executeMulticall({
      calls: stakingItemCalls.map(item => ({
        address: item.address as `0x${string}`,
        abi: item.abi as Abi,
        functionName: item.functionName,
        args: item.args,
      })),
    });
    const stakeInfo: StakingItem[] = [];
    stakingItemRes.forEach((result, index) => {
      console.log(result, 'result111');
      if (result.success && result.data) {
        const stakeData = result.data as {
          pending: bigint;
          blockReward: bigint;
          extraInterest: bigint;
          claimableBalance: bigint;
          expiry: bigint;
        };

        stakeInfo.push({
          pending: Number(formatUnits(stakeData.pending, 9)),
          blockReward: Number(formatUnits(stakeData.blockReward, 9)),
          interest: Number(formatUnits(stakeData.extraInterest, 9)),
          expiry: Number(stakeData.expiry),
          claimableBalance: Number(formatUnits(stakeData.claimableBalance, 9)),
          index: stakingItemCalls[index].bondIndex || 0,
          period: stakingItemCalls[index].period || '',
          type: 'longStake',
        });
      }
    });
    return { myStakingList: stakeInfo };
  } catch (error) {
    console.log(error);
    return { myStakingList: [] };
  }
};

// 节点质押列表(就一条)
export const getNodeStakes = async ({ address }: { address: Address }) => {
  try {
    const nodeStakeses = await executeMulticall({
      calls: [
        {
          address: nodeStaking,
          abi: NodeStakingAbi as Abi,
          functionName: 'listStake',
          args: [address],
        },
      ],
    });
    console.log(nodeStakeses, 'nodeStakeses');
    if (nodeStakeses.length) {
      const stakeData = nodeStakeses[0].data as {
        blockReward: bigint;
        claimableBalance: bigint;
        expiry: bigint;
        extraInterest: bigint;
        pending: bigint;
      };
      if (Number(formatUnits(stakeData.pending, 9)) === 0) {
        return [];
      }
      const list = [
        {
          pending: Number(formatUnits(stakeData.pending, 9)),
          blockReward: Number(formatUnits(stakeData.blockReward, 9)),
          interest: Number(formatUnits(stakeData.extraInterest, 9)),
          expiry: Number(stakeData.expiry),
          claimableBalance: Number(formatUnits(stakeData.claimableBalance, 9)),
          index: 10000, //在质押列表里的最后
          period: 'LP-360',
          type: 'nodeStake',
        },
      ];
      return list;
    }
    return [];
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};
//获取块
export const getEnchBlock = async () => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: staking as `0x${string}`,
          abi: StakingAbi as Abi,
          functionName: 'epoch',
        },
      ],
    })) as { success: boolean; data: [bigint, bigint, bigint] }[];
    if (res.length && res[0].data.length) {
      const nextBlock = Number(res[0].data[2]);
      return nextBlock;
    }
    return 0;
  } catch (err: unknown) {
    console.log(err);
    return 0;
  }
};



//活期质押数据(热身期)
export const demandInfo = async ({ address }: { address: Address }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: demandStaking as `0x${string}`,
          abi: DemandStakingAbi as Abi,
          functionName: 'warmupStakes',
          args: [address],
        },
      ],
    })) as { success: boolean; data: [bigint, bigint, bigint] }[];
    if (res.length && res[0].data.length) {
      const info = {
        stakNum:
          (res[0].data[0] && Number(formatUnits(res[0].data[0], 9))) || 0,
      };
      return info;
    }
  } catch (err: unknown) {
    console.log(err);
  }
};

//热身期之后的质押数据
export const demandAfterHot = async ({ address }: { address: Address }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: demandStaking as `0x${string}`,
          abi: DemandStakingAbi as Abi,
          functionName: 'stakes',
          args: [address],
        },
      ],
    })) as {
      success: boolean;
      data: [bigint, bigint, bigint, bigint, boolean];
    }[];

    if (res.length && res[0].data.length) {
      const info = {
        principal:
          (res[0].data[0] && Number(formatUnits(res[0].data[0], 9))) || 0,
        isTrue: res[0].data.length && res[0].data[4],
      };
      return info;
    }
    return {
      principal: 0,
      isTrue: false,
    };
  } catch (err: unknown) {
    console.log(err);
    return {
      principal: 0,
      isTrue: false,
    };
  }
};

//活期质押收益
export const demandProfit = async ({ address }: { address: Address }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: demandStaking as `0x${string}`,
          abi: DemandStakingAbi as Abi,
          functionName: 'getRebaseRewards',
          args: [address],
        },
        // 是否热身期结束,可以claim了
        {
          address: demandStaking as `0x${string}`,
          abi: DemandStakingAbi as Abi,
          functionName: 'IsWarmupExpired',
          args: [address],
        },
      ],
    })) as { success: boolean; data: [bigint, bigint] }[];

    if (res.length) {
      //静态收益 热身期收益
      const rebalseProfit = Number(formatUnits(res[0].data[0], 9)) || 0;
      const normalProfit = Number(formatUnits(res[0].data[1], 9)) || 0;
      const allProfit = rebalseProfit + normalProfit;
      //是否可以claim
      const isClaim = Boolean(res[1].data);
      return {
        allProfit,
        normalProfit,
        isClaim,
        rebalseProfit
      };
    }
  } catch (err: unknown) {
    console.log(err);
    return null;
  }
};
//查询余额
export const getBalanceToken = async ({
  address,
  TOKEN_ADDRESSES,
  decimal,
}: {
  address: Address;
  TOKEN_ADDRESSES: string;
  decimal: number;
}) => {
  const res = (await executeMulticall({
    calls: [
      {
        address: TOKEN_ADDRESSES as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
    ],
  })) as { success: boolean; data: bigint }[];
  
  if (res.length) {
    const balance = Number(formatUnits(res[0].data, decimal));
    return balance || 0;
  }
  return 0;
};

//获取oly总数量
export const getTotalSupply = async ({
  TOKEN_ADDRESSES,
  decimal,
}: {
  TOKEN_ADDRESSES: string;
  decimal: number;
}) => {
  const res = (await executeMulticall({
    calls: [
      {
        address: TOKEN_ADDRESSES as `0x${string}`,
        abi: erc20Abi,
        functionName: 'totalSupply',
        args: [],
      },
    ],
  })) as { success: boolean; data: bigint }[];
  
  if (res.length) {
    const balance = Number(formatUnits(res[0].data, decimal));
    return balance || 0;
  }
  return 0;
};



//获取apy(收益率),全网rebalse数量
export const getAllnetReabalseNum = async () => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: distributor as `0x${string}`,
          abi: DistributorAbi as Abi,
          functionName: 'info',
          args: [0],
        },
      ],
    })) as { success: boolean; data: [bigint, string] }[];

    const resN = (await executeMulticall({
      calls: [
        {
          address: distributor as `0x${string}`,
          abi: DistributorAbi as Abi,
          functionName: 'nextRewardAt',
          args: [res[0].data[0]],
        },
      ],
    })) as { success: boolean; data: bigint }[];

    if (res.length && resN.length) {
      const allReabalseNum = Number(formatUnits(resN[0].data, 9));
      return allReabalseNum;
    }
    return 0;
  } catch (err: unknown) {
    console.log(err);
  }
};

//获取授权的长度

export const getAllowance = async ({
  address,
  fromAddress,
  toAddress,
  decimal = 9,
}: {
  address: Address;
  fromAddress: Address;
  toAddress: Address;
  decimal: number;
}) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: fromAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, toAddress],
        },
      ],
    })) as { success: boolean; data: bigint }[];
    console.log(res,"res11")
    if (res.length && res[0].success) {
      const rate = formatUnits(res[0].data, decimal);
      return rate;
    }
    return 0;
  } catch (err: unknown) {
    console.log(err);
    return 0;
  }
};

//查询长期质押列表
export const longStakList = async () => {
  try {
    const callList: {
      address: `0x${string}`;
      abi: Abi;
      functionName: string;
      args: string[];
    }[] = [];
    depositDayList.map(async it => {
      callList.push({
        address: sOLY,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [it.token],
      });
    });

    const res = await executeMulticall({
      calls: callList,
    });

    if (res && res.length === depositDayList.length) {
      const mergedList = depositDayList.map((item, index) => ({
        ...item,
        amount: Number(formatUnits(res[index].data as bigint, 9)),
      }));
      console.log(mergedList, 'mergedList');
      return mergedList;
    }
    return [];
  } catch (err: unknown) {
    console.log(err);
  }
};

//查询长期质押列表开启状态

export const longStakStatus = async () => {
  try {
    const callList: {
      address: `0x${string}`;
      abi: Abi;
      functionName: string;
      args: [];
    }[] = [];
    depositDayList.map(async it => {
      callList.push({
        address: it.token as `0x${string}`,
        abi: LongStakingAbi as Abi,
        functionName: 'status',
        args: [],
      });
    });
    const res = await executeMulticall({
      calls: callList,
    });

    if (res && res.length) {
      const satusList: { status: boolean }[] = [];
      res.forEach(it => {
        satusList.push({
          status: Boolean(it.data),
        });
      });
      return satusList;
    }

    return [];
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};

//获取列表授权的长度

export const longAllowance = async ({ address }: { address: string }) => {
  const callList: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: string[];
  }[] = [];
  depositDayList.map(async it => {
    callList.push({
      address: OLY as `0x${string}`,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [address, it.token],
    });
  });
  try {
    const res = (await executeMulticall({
      calls: callList,
    })) as { success: boolean; data: bigint }[];

    const allowanceList: { allowanceNum: number }[] = [];
    if (res.length && res.length) {
      res.forEach(it => {
        allowanceList.push({
          allowanceNum: Number(formatUnits(it.data as bigint, 9)),
        });
      });
      return allowanceList;
    }
    return [];
  } catch (err: unknown) {
    console.log(err);
    return [];
  }
};

//查询结束块

export const endBlock = async ({ address }: { address: string }) => {
  try {
    const res = (await executeMulticall({
      calls: [
        {
          address: longStaking5 as `0x${string}`,
          abi: LongStakingAbi as Abi,
          functionName: 'stakes',
          args: [address],
        },
      ],
    })) as { success: boolean; data: bigint }[];

    console.log(res);
  } catch {}
};
