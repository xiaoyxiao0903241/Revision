import { Address, erc20Abi, Abi, formatUnits } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import {
  TOKEN_ADDRESSES,
  nodeSales,
  matrixNetwork,
} from '../../constants/tokens';
import NodeSalesAbi from '../../constants/NodeSalesAbi.json';
import MaxInviteAbi from '../../constants/MatrixNetworkAbi.json';

// 节点类型枚举
export enum NodeType {
  GENESIS, // 0 创世
  GOLD, // 1 黄金
  BLOCKSILVER, // 2 黑银
  CONSENSUS, // 3 共识
  NEBULA, // 4 星云
}

// 节点信息接口
export interface NodeInfo {
  nodeType: NodeType;
  purchaseTime: bigint;
  rewardPercent: bigint;
  owner: Address;
}

// 销售信息接口
export interface SalesInfo {
  price: bigint;
  rewardPercent: bigint;
  sold: bigint;
  amount: bigint;
}

// 销售状态接口
export interface SaleStatus {
  isPaused: boolean;
  startTime: bigint;
  endTime: bigint;
}

// 销售总览信息接口
export interface SaleOverview {
  isActivated: boolean;
  isPaused: boolean;
  startTime: bigint;
  endTime: bigint;
  paymentToken: Address;
  totalNodesSold: bigint;
  allowance: bigint;
  dailyDecrease: bigint;
  minRewardPercent: bigint;
  salesInfo: {
    [key in NodeType]: (SalesInfo & { currentRewardPercent: bigint }) | null;
  };
}

// 定义 multicall 返回类型
interface MulticallResult {
  success: boolean;
  data:
    | bigint
    | boolean
    | Address
    | [bigint, bigint, bigint, bigint]
    | UserRewardStatus;
}

interface HistoryItem extends Record<string, unknown> {
  time: string;
  hash: string;
  amount: number;
  address: string;
  roi: number;
}

// 获取用户节点列表
export const getUserNodes = async ({ address }: { address: Address }) => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'getUserNodes',
        args: [address],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success ? (results[0].data as bigint[]) : [];
  } catch (error) {
    console.error('Failed to get user nodes:', error);
    return [];
  }
};

// 获取节点详细信息
export const getNodeDetails = async ({ nodeId }: { nodeId: bigint }) => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'nodes',
        args: [nodeId],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    if (!results[0].success) return null;

    const [nodeType, purchaseTime, rewardPercent, owner] = results[0].data as [
      bigint,
      bigint,
      bigint,
      Address,
    ];

    return {
      nodeType: Number(nodeType) as NodeType,
      purchaseTime,
      rewardPercent,
      owner,
    } as NodeInfo;
  } catch (error) {
    console.error('Failed to get node details:', error);
    return null;
  }
};

// 获取销售信息
export const getSalesInfo = async ({ nodeType }: { nodeType: NodeType }) => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [nodeType],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    if (!results[0].success) return null;
    console.log(results, 'xxxxxxx');
    const [price, rewardPercent, sold, amount] = results[0].data as [
      bigint,
      bigint,
      bigint,
      bigint,
    ];
    console.log('price', price);
    console.log('rewardPercent', rewardPercent);
    console.log('sold', sold);
    console.log('amount', amount);
    return {
      price,
      rewardPercent,
      sold,
      amount,
    } as SalesInfo;
  } catch (error) {
    console.error('Failed to get sales info:', error);
    return null;
  }
};

// 获取当前奖励百分比
export const getCurrentRewardPercent = async ({
  nodeType,
}: {
  nodeType: NodeType;
}) => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [nodeType, BigInt(Math.floor(Date.now() / 1000))],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success ? (results[0].data as bigint) : BigInt(0);
  } catch (error) {
    console.error('Failed to get current reward percent:', error);
    return BigInt(0);
  }
};

// 检查是否需要授权,以及授权额度
export const checkNodeApproval = async ({ address }: { address: Address }) => {
  try {
    const calls = [
      {
        address: TOKEN_ADDRESSES.DAI as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, nodeSales],
      },
      {
        address: TOKEN_ADDRESSES.DAI as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    const allowance = results[0].success
      ? (results[0].data as bigint)
      : BigInt(0);
    const balance = results[1].success
      ? (results[1].data as bigint)
      : BigInt(0);
    return allowance < balance;
  } catch (error) {
    console.error('Failed to check node approval:', error);
    return false;
  }
};

// 获取销售开始时间
export const getSaleStartTime = async () => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleStartTime',
        args: [],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success ? (results[0].data as bigint) : BigInt(0);
  } catch (error) {
    console.error('Failed to get sale start time:', error);
    return BigInt(0);
  }
};

// 获取销售结束时间
export const getSaleEndTime = async () => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleEndTime',
        args: [],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success ? (results[0].data as bigint) : BigInt(0);
  } catch (error) {
    console.error('Failed to get sale end time:', error);
    return BigInt(0);
  }
};

// 获取销售状态
export const getSaleStatus = async () => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'paused',
        args: [],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleStartTime',
        args: [],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleEndTime',
        args: [],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return {
      isPaused: results[0].success ? (results[0].data as boolean) : true,
      startTime: results[1].success ? (results[1].data as bigint) : BigInt(0),
      endTime: results[2].success ? (results[2].data as bigint) : BigInt(0),
    } as SaleStatus;
  } catch (error) {
    console.error('Failed to get sale status:', error);
    return {
      isPaused: true,
      startTime: BigInt(0),
      endTime: BigInt(0),
    } as SaleStatus;
  }
};

// 获取支付 token 地址
export const getPaymentToken = async () => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'paymentToken',
        args: [],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success
      ? (results[0].data as Address)
      : '0x0000000000000000000000000000000000000000';
  } catch (error) {
    console.error('Failed to get payment token:', error);
    return '0x0000000000000000000000000000000000000000';
  }
};

// 获取销售总量
export const getTotalNodesSold = async () => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'getTotalNodesSold',
        args: [],
      },
    ];

    const results = await executeMulticall({
      calls,
    });

    return results[0].success ? (results[0].data as bigint) : BigInt(0);
  } catch (error) {
    console.error('Failed to get total nodes sold:', error);
    return BigInt(0);
  }
};

// 检查授权额度
export const getAllowance = async ({ address }: { address: Address }) => {
  try {
    const result = (await executeMulticall({
      calls: [
        {
          address: TOKEN_ADDRESSES.DAI as `0x${string}`,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, nodeSales],
        },
      ],
    })) as MulticallResult[];

    if (result[0].success) {
      return BigInt(Number(result[0].data as bigint));
    }
    return BigInt(0);
  } catch (error) {
    console.error('Failed to get allowance:', error);
    return BigInt(0);
  }
};

// 获取销售总览信息
export const getSaleOverview = async ({ address }: { address: Address }) => {
  try {
    const currentTime = BigInt(Math.floor(Date.now() / 1000));
    const calls = [
      // 获取销售状态
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'paused',
        args: [],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleStartTime',
        args: [],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'saleEndTime',
        args: [],
      },
      // 获取支付 token
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'paymentToken',
        args: [],
      },
      // 获取销售总量
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'getTotalNodesSold',
        args: [],
      },
      // 获取各类型节点销售信息
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [NodeType.GENESIS],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [NodeType.GOLD],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [NodeType.BLOCKSILVER],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [NodeType.CONSENSUS],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'salesInfo',
        args: [NodeType.NEBULA],
      },
      // 获取各类型节点当前奖励百分比
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [NodeType.GENESIS, currentTime],
      },

      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [NodeType.GOLD, currentTime],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [NodeType.BLOCKSILVER, currentTime],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [NodeType.CONSENSUS, currentTime],
      },
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'currentRewardPercent',
        args: [NodeType.NEBULA, currentTime],
      },
      // 获取授权额度
      {
        address: TOKEN_ADDRESSES.DAI as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, nodeSales],
      },
      // 获取用户是否绑定上级
      {
        address: matrixNetwork as `0x${string}`,
        abi: MaxInviteAbi as Abi,
        functionName: 'isActive',
        args: [address],
      },
      // dailyDecrease
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'dailyDecrease',
        args: [],
      },
      // minRewardPercent
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'minRewardPercent',
        args: [],
      },
    ];

    const results = (await executeMulticall({
      calls,
    })) as MulticallResult[];
    console.log(results, '1111111');

    // 处理销售信息
    const salesInfo = {
      [NodeType.GENESIS]: results[5].success
        ? {
            price: BigInt(
              Number((results[5].data as [bigint, bigint, bigint, bigint])[0])
            ),
            rewardPercent: BigInt(
              Number((results[5].data as [bigint, bigint, bigint, bigint])[1])
            ),
            sold: BigInt(
              Number((results[5].data as [bigint, bigint, bigint, bigint])[2])
            ),
            amount: BigInt(
              Number((results[5].data as [bigint, bigint, bigint, bigint])[3])
            ),
            currentRewardPercent: results[10].success
              ? BigInt(Number(results[10].data as bigint))
              : BigInt(0),
          }
        : null,
      [NodeType.GOLD]: results[6].success
        ? {
            price: BigInt(
              Number((results[6].data as [bigint, bigint, bigint, bigint])[0])
            ),
            rewardPercent: BigInt(
              Number((results[6].data as [bigint, bigint, bigint, bigint])[1])
            ),
            sold: BigInt(
              Number((results[6].data as [bigint, bigint, bigint, bigint])[2])
            ),
            amount: BigInt(
              Number((results[6].data as [bigint, bigint, bigint, bigint])[3])
            ),
            currentRewardPercent: results[11].success
              ? BigInt(Number(results[11].data as bigint))
              : BigInt(0),
          }
        : null,
      [NodeType.BLOCKSILVER]: results[7].success
        ? {
            price: BigInt(
              Number((results[7].data as [bigint, bigint, bigint, bigint])[0])
            ),
            rewardPercent: BigInt(
              Number((results[7].data as [bigint, bigint, bigint, bigint])[1])
            ),
            sold: BigInt(
              Number((results[7].data as [bigint, bigint, bigint, bigint])[2])
            ),
            amount: BigInt(
              Number((results[7].data as [bigint, bigint, bigint, bigint])[3])
            ),
            currentRewardPercent: results[12].success
              ? BigInt(Number(results[12].data as bigint))
              : BigInt(0),
          }
        : null,
      [NodeType.CONSENSUS]: results[8].success
        ? {
            price: BigInt(
              Number((results[8].data as [bigint, bigint, bigint, bigint])[0])
            ),
            rewardPercent: BigInt(
              Number((results[8].data as [bigint, bigint, bigint, bigint])[1])
            ),
            sold: BigInt(
              Number((results[8].data as [bigint, bigint, bigint, bigint])[2])
            ),
            amount: BigInt(
              Number((results[8].data as [bigint, bigint, bigint, bigint])[3])
            ),
            currentRewardPercent: results[13].success
              ? BigInt(Number(results[13].data as bigint))
              : BigInt(0),
          }
        : null,
      [NodeType.NEBULA]: results[9].success
        ? {
            price: BigInt(
              Number((results[9].data as [bigint, bigint, bigint, bigint])[0])
            ),
            rewardPercent: BigInt(
              Number((results[9].data as [bigint, bigint, bigint, bigint])[1])
            ),
            sold: BigInt(
              Number((results[9].data as [bigint, bigint, bigint, bigint])[2])
            ),
            amount: BigInt(
              Number((results[9].data as [bigint, bigint, bigint, bigint])[3])
            ),
            currentRewardPercent: results[14].success
              ? BigInt(Number(results[14].data as bigint))
              : BigInt(0),
          }
        : null,
    };
    console.log('salesInfo', salesInfo);
    return {
      isPaused: results[0].success ? (results[0].data as boolean) : true,
      startTime: results[1].success
        ? BigInt(Number(results[1].data as bigint))
        : BigInt(0),
      endTime: results[2].success
        ? BigInt(Number(results[2].data as bigint))
        : BigInt(0),
      paymentToken: results[3].success
        ? (results[3].data as Address)
        : '0x0000000000000000000000000000000000000000',
      totalNodesSold: results[4].success
        ? BigInt(Number(results[4].data as bigint))
        : BigInt(0),
      allowance: results[15].success
        ? BigInt(Number(results[15].data as bigint))
        : BigInt(0),
      isActivated: results[16].success ? (results[16].data as boolean) : false,
      dailyDecrease: results[17].success
        ? BigInt(Number(results[17].data as bigint))
        : BigInt(0),
      minRewardPercent: results[18].success
        ? BigInt(Number(results[18].data as bigint))
        : BigInt(0),
      salesInfo,
    } as SaleOverview;
  } catch (error) {
    console.error('Failed to get sale overview:', error);
    return {
      isPaused: true,
      startTime: BigInt(0),
      endTime: BigInt(0),
      paymentToken: '0x0000000000000000000000000000000000000000',
      totalNodesSold: BigInt(0),
      allowance: BigInt(0),
      isActivated: false,
      dailyDecrease: BigInt(0),
      minRewardPercent: BigInt(0),
      salesInfo: {
        [NodeType.GENESIS]: null,
        [NodeType.GOLD]: null,
        [NodeType.BLOCKSILVER]: null,
        [NodeType.CONSENSUS]: null,
        [NodeType.NEBULA]: null,
      },
    } as SaleOverview;
  }
};
// 写一个授权销售节点函数
export const approveNodeSale = async () => {
  try {
    const calls = [
      {
        address: TOKEN_ADDRESSES.DAI as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [nodeSales, BigInt(Number.MAX_SAFE_INTEGER)],
      },
    ];
    console.log('calls', calls);
    const results = (await executeMulticall({
      calls,
    })) as MulticallResult[];
    console.log('results', results);
    return results[0].success ? (results[0].data as boolean) : false;
  } catch (error) {
    console.error('Failed to approve node sale:', error);
    return false;
  }
};

export interface UserRewardStatus {
  hasPurchased: boolean;
  from: Address;
  amount: string;
  canClaim: boolean;
  hasClaimed: boolean;
}

// 写一个通过用户邀请人购买的奖励获取用户的领取奖励状况
export const getUserRewardStatus = async ({
  list,
  address,
}: {
  list: HistoryItem[];
  address: Address;
}) => {
  try {
    const calls = [
      {
        address: nodeSales as `0x${string}`,
        abi: NodeSalesAbi as Abi,
        functionName: 'userHasPurchased',
        args: [address],
      },
    ];
    const calls1 = list.map(item => ({
      address: nodeSales as `0x${string}`,
      abi: NodeSalesAbi as Abi,
      functionName: 'getUserReward',
      args: [address, item.saleId],
    }));
    const results = await executeMulticall<
      | [
          Address, // from
          bigint, // amount
          boolean, // canClaim
          boolean, // hasClaimed
        ]
      | boolean
    >({
      calls: [...calls, ...calls1],
    });
    const userRewardStatus: UserRewardStatus[] = [];
    // 先处理 index 0
    let hasPurchased = false;
    if (results[0] && results[0].success) {
      hasPurchased = results[0].data as boolean;
    }

    // 再处理剩下的
    for (let i = 1; i < results.length; i++) {
      const item = results[i];
      if (item.success && item.data) {
        if (Array.isArray(item.data)) {
          // 数组解构
          const [, , canClaim, hasClaimed] = item.data as [
            Address,
            bigint,
            boolean,
            boolean,
          ];
          userRewardStatus.push({
            hasPurchased,
            canClaim,
            hasClaimed,
          } as UserRewardStatus);
        } else if (typeof item.data === 'object') {
          // 对象解构
          const { amount, canClaim, hasClaimed } = item.data as {
            amount: bigint;
            canClaim: boolean;
            hasClaimed: boolean;
          };
          userRewardStatus.push({
            amount: formatUnits(amount, 18),
            canClaim,
            hasClaimed,
            hasPurchased,
          } as UserRewardStatus);
        }
      }
    }
    console.log(userRewardStatus, 'userRewardStatus');

    return userRewardStatus;
  } catch (error) {
    console.log('错误');
    console.error('Failed to approve node sale:', error);
    return false;
  }
};
