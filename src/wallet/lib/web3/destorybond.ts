import { Address, Abi } from 'viem';
import { executeMulticall, ContractCall } from '~/lib/multicall';
import {
  destroyBond5,
  destroyBond30,
  // liquidityBond90,
  treasury as Treasury,
} from '../../constants/tokens';
import BondAbi from '../../constants/BondAbi.json';
import LPHelperAbi from '../../constants/LPHelper.json';
import ITreasuryAbi from '../../constants/ITreasury.json';
import { formatUnits, parseUnits, erc20Abi } from 'viem';
import {
  DEX_ADDRESS,
  TOKEN_ADDRESSES,
  lpHelper as LPHelper,
  // DAIAS as LP_Token,
  OLY,
} from '../../constants/tokens';
import PANCAKESWAP_ROUTER_ABI from '../../constants/RouterAbi.json';
const BondList = [
  {
    name: 'DS_Bond_(5',
    address: destroyBond5,
    color: 'text-orange-500',
  },
  {
    name: 'DS_Bond_(30',
    address: destroyBond30,
    color: 'text-orange-500',
  },
  // {
  //   name: "LP_Bond_(90",
  //   address: liquidityBond90,
  //   color: "text-orange-500",
  // },
];

export interface BondItem {
  name: string;
  price: string;
  bondPrice: string;
  roi: number | string;
  disRote: number | string;
  total: number | string;
  color: string;
  key: string;
  maxPayout: string;
}

export const getBondList = async () => {
  let calls: ContractCall[] = [
    {
      address: DEX_ADDRESS as `0x${string}`,
      abi: PANCAKESWAP_ROUTER_ABI as Abi,
      functionName: 'getAmountsOut',
      args: [
        parseUnits('1', 9).toString(),
        [TOKEN_ADDRESSES.OLY, TOKEN_ADDRESSES.DAI],
      ],
    },
  ];
  BondList.forEach(it => {
    calls = calls.concat([
      {
        address: it.address as `0x${string}`,
        abi: BondAbi as Abi,
        functionName: 'bondPriceInUSD',
        args: [],
      },
      {
        address: it.address as `0x${string}`,
        abi: BondAbi as Abi,
        functionName: 'terms',
        args: [],
      },
      {
        address: it.address as `0x${string}`,
        abi: BondAbi as Abi,
        functionName: 'maxPayout',
        args: [],
      },
    ]);
  });

  try {
    const res = await executeMulticall<
      | [bigint, bigint]
      | bigint
      | [bigint, bigint, bigint, bigint, bigint, bigint, bigint]
    >({
      calls,
    });
    if (res.length && res[0].data) {
      const priceData = res[0].data as [bigint, bigint];
      const list: BondItem[] = [];
      BondList.forEach((it, index) => {
        console.log(
          '12122',
          res[3 * index + 2].data as [
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
            bigint,
          ]
        );
        list.push({
          key: it.address,
          name: it.name,
          price: res[0].success ? formatUnits(priceData[1], 18) : '0',
          bondPrice: res[3 * index + 1].success
            ? (
                Number(formatUnits(res[3 * index + 1].data as bigint, 9)) *
                Number(formatUnits(priceData[1], 18))
              ).toFixed(18)
            : '0',
          roi: res[3 * index + 1].success
            ? Number(
                ((Number(formatUnits(priceData[1], 18)) -
                  Number(
                    Number(formatUnits(res[3 * index + 1].data as bigint, 9)) *
                      Number(formatUnits(priceData[1], 18))
                  )) /
                  Number(
                    Number(formatUnits(res[3 * index + 1].data as bigint, 9)) *
                      Number(formatUnits(priceData[1], 18))
                  )) *
                  100
              ).toFixed(4)
            : 0,
          disRote: res[3 * index + 1].success
            ? Number(
                ((Number(formatUnits(priceData[1], 18)) -
                  Number(
                    Number(formatUnits(res[3 * index + 1].data as bigint, 9)) *
                      Number(formatUnits(priceData[1], 18))
                  )) /
                  Number(formatUnits(priceData[1], 18))) *
                  100
              ).toFixed(4)
            : 0,
          total: res[3 * index + 2].success
            ? formatUnits(
                (
                  res[3 * index + 2].data as [
                    bigint,
                    bigint,
                    bigint,
                    bigint,
                    bigint,
                    bigint,
                    bigint,
                  ]
                )[6],
                9
              )
            : '0',
          maxPayout: res[3 * index + 3].success
            ? formatUnits(res[3 * index + 3].data as bigint, 9)
            : '0',
          color: it.color,
        });
      });
      return list;
    }
    return [];
  } catch (error) {
    console.log(error, 'error');
    return [];
  }
};
// 获取我购买的债券数量
export const getMyBondList = async ({ address }: { address: Address }) => {
  const calls = [
    {
      address: destroyBond5 as `0x${string}`,
      abi: BondAbi as Abi,
      functionName: 'getBondCount',
      args: [address],
    },
    {
      address: destroyBond30 as `0x${string}`,
      abi: BondAbi as Abi,
      functionName: 'getBondCount',
      args: [address],
    },
    // {
    //   address: liquidityBond90 as `0x${string}`,
    //   abi: BondAbi as Abi,
    //   functionName: "getBondCount",
    //   args: [address],
    // },
  ];
  try {
    const res = await executeMulticall<[bigint, bigint, bigint]>({
      calls,
    });
    if (res.length && res[0].data) {
      return [
        Number(res[0].data as unknown as bigint),
        Number(res[1].data as unknown as bigint),
        Number(res[2].data as unknown as bigint),
      ];
    }
    return [0, 0, 0];
  } catch (error) {
    console.error('Error getting token price:', error);
    return [0, 0, 0];
  }
};
// 写一个获取代币价格的方法
export const getTokenPrice = async () => {
  const calls = [
    {
      address: DEX_ADDRESS as `0x${string}`,
      abi: PANCAKESWAP_ROUTER_ABI as Abi,
      functionName: 'getAmountsOut',
      args: [
        parseUnits('1', 18).toString(),
        [TOKEN_ADDRESSES.DAI, TOKEN_ADDRESSES.OLY],
      ],
    },
  ];
  try {
    const res = await executeMulticall<[bigint, bigint]>({
      calls,
    });
    if (res.length && res[0].data) {
      const priceData = res[0].data as [bigint, bigint];
      return res[0].success ? formatUnits(priceData[1], 9) : 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting token price:', error);
    return 0;
  }
};

export interface BondPurchaseInfo {
  name: string;
  address: string;
  bondIndex: number;
  payout: string;
  vesting: string;
  lastBlock: string;
  pricePaid: string;
  claimable: string;
  exists: boolean;
  percentVested: string;
  payoutRemaining: string;
  vestingEndBlock: string;
  currentPrice: string;
  profit: string;
}

export const getMyBondsInfo = async ({ address }: { address: Address }) => {
  const calls: ContractCall[] = [];

  // 为每个债券合约添加调用
  BondList.forEach(bond => {
    // 获取债券数量
    calls.push({
      address: bond.address as `0x${string}`,
      abi: BondAbi as Abi,
      functionName: 'getBondCount',
      args: [address],
    });
  });

  try {
    const res = await executeMulticall<[bigint]>({
      calls,
    });
    if (!res.length) return [];

    // 获取每个债券的详细信息
    const bondDetailsCalls: ContractCall[] = [];
    const bondCounts: number[] = [];

    res.forEach(result => {
      if (result.success) {
        console.log('result.data', result.data);
        const count = Number(result.data);
        bondCounts.push(count);

        // 为每个债券添加详细信息调用
        for (let i = 0; i < count; i++) {
          bondDetailsCalls.push({
            address: BondList[bondCounts.length - 1].address as `0x${string}`,
            abi: BondAbi as Abi,
            functionName: 'getBondInfo',
            args: [address, i],
            bondIndex: i,
          });
        }
      }
    });

    if (bondDetailsCalls.length === 0) return [];

    const detailsRes = await executeMulticall<
      [
        bigint, // payout
        bigint, // vesting
        bigint, // lastBlock
        bigint, // pricePaid
        boolean, // exists
        bigint, // percentVested
        bigint, // payoutRemaining
        bigint, // vestingEndBlock
        bigint, // currentPrice
        bigint, // profit
      ]
    >({
      calls: bondDetailsCalls.map(item => ({
        address: item.address as `0x${string}`,
        abi: item.abi as Abi,
        functionName: item.functionName,
        args: item.args,
      })),
    });

    const bondInfo: BondPurchaseInfo[] = [];
    // let currentIndex = 0;
    console.log('detailsRes', detailsRes);
    detailsRes.forEach((result, index) => {
      if (result.success && result.data) {
        const [
          payout,
          vesting,
          lastBlock,
          pricePaid,
          exists,
          percentVested,
          payoutRemaining,
          vestingEndBlock,
          currentPrice,
          profit,
        ] = result.data;

        bondInfo.push({
          name:
            BondList.find(
              item => item.address === bondDetailsCalls[index].address
            )?.name || '',
          address: bondDetailsCalls[index].address || '',
          bondIndex: bondDetailsCalls[index].bondIndex || 0,
          payout: formatUnits(payout, 9),
          vesting: vesting.toString(),
          lastBlock: lastBlock.toString(),
          pricePaid: formatUnits(pricePaid, 18),
          claimable: (
            Number(formatUnits(payout, 9)) -
            Number(formatUnits(payoutRemaining, 9))
          ).toString(),
          exists,
          percentVested: percentVested.toString(),
          payoutRemaining: formatUnits(payoutRemaining, 9),
          vestingEndBlock: vestingEndBlock.toString(),
          currentPrice: formatUnits(currentPrice, 18),
          profit: formatUnits(profit, 9),
        });

        // currentIndex++;
      }
    });

    return bondInfo;
  } catch (error) {
    console.error('Error getting bond info:', error);
    return [];
  }
};
//获取 usdt 余额
export const getUsdtBalance = async ({ address }: { address: Address }) => {
  const calls = [
    {
      address: TOKEN_ADDRESSES.DAI as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    },
  ];
  const res = await executeMulticall<[bigint]>({
    calls,
  });
  if (res.length && res[0].data) {
    return formatUnits(res[0].data as unknown as bigint, 18);
  }
  return 0;
};
// 获取 代币余额
export const getTokenBalance = async ({ address }: { address: Address }) => {
  const calls = [
    {
      address: TOKEN_ADDRESSES.OLY as `0x${string}`,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    },
  ];
  const res = await executeMulticall<[bigint]>({
    calls,
  });
  if (res.length && res[0].data) {
    return formatUnits(res[0].data as unknown as bigint, 9);
  }
  return 0;
};
// 预估获取 lp 数量
export const getDestroyEstimate = async ({ amount }: { amount: string }) => {
  const calls = [
    {
      address: LPHelper as `0x${string}`,
      abi: LPHelperAbi as Abi,
      functionName: 'estimateOhmInfo',
      args: [parseUnits(amount, 18).toString(), TOKEN_ADDRESSES.DAI],
    },
  ];
  console.log(
    'parseUnits(amount, 18).toString()',
    parseUnits(amount, 18).toString()
  );
  const res = await executeMulticall<[bigint]>({
    calls,
  });
  console.log('resddddd', res);
  if (res.length && res[0].data) {
    return formatUnits(res[0].data as unknown as bigint, 9);
  }
  return 0;
};
export const getTokenValue = async ({
  address,
  amount,
}: {
  address: Address;
  amount: string;
}) => {
  try {
    const calls = [
      {
        address: Treasury as `0x${string}`,
        abi: ITreasuryAbi as Abi,
        functionName: 'valueOf',
        args: [OLY, parseUnits(amount, 9).toString()],
      },
    ];
    const res = await executeMulticall<[bigint]>({
      calls,
    });
    console.log('res', res);
    if (res.length && res[0].data) {
      console.log('res1111', res);
      // return formatUnits(res[0].data as unknown as bigint, 18);
      const calls1 = [
        {
          address: address as `0x${string}`,
          abi: BondAbi as Abi,
          functionName: 'payoutFor',
          args: [res[0].data],
        },
      ];
      const res1 = await executeMulticall<[bigint]>({
        calls: calls1,
      });
      if (res1.length && res1[0].data) {
        return formatUnits(res1[0].data as unknown as bigint, 9);
      }
    }
    return 0;
  } catch (error) {
    console.error('Error getting token value:', error);
    return 0;
  }
};
// 写一个代币授权的方法，要通用的

// 检查代币授权
export const checkTokenAllowance = async ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  amount,
  decimals = 18,
}: {
  tokenAddress: `0x${string}`;
  ownerAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: string;
  decimals?: number;
}) => {
  try {
    const calls = [
      {
        address: tokenAddress,
        abi: erc20Abi as Abi,
        functionName: 'allowance',
        args: [ownerAddress, spenderAddress],
      },
    ];

    const res = await executeMulticall<[bigint]>({
      calls,
    });
    console.log('res12121', res);
    if (res.length && res[0].data) {
      const allowance = res[0].data as unknown as bigint;
      console.log('allowance', allowance);
      const amountInWei = parseUnits(amount, decimals);
      console.log('amountInWei', amountInWei);
      return allowance >= amountInWei;
    }
    return false;
  } catch (error) {
    console.error('Error checking token allowance:', error);
    return false;
  }
};
// 查询债券可领取的质押收益
export const getBondStakeProfit = async ({
  address,
  bondIndex,
  bondAddress,
}: {
  address: Address;
  bondIndex: number;
  bondAddress: string;
}) => {
  const calls = [
    {
      address: bondAddress as `0x${string}`,
      abi: BondAbi as Abi,
      functionName: 'getStakeProfit',
      args: [address, bondIndex],
    },
  ];
  const res = await executeMulticall<[bigint]>({
    calls,
  });
  if (res.length && res[0].data) {
    console.log('res[0].data', res[0].data);
    return formatUnits(res[0].data as unknown as bigint, 9);
  }
  return 0;
};
