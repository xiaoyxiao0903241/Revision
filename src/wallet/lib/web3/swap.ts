import { Address, erc20Abi } from 'viem';
import { formatUnits, parseUnits } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import { TOKEN_ADDRESSES, DEX_ADDRESS } from '../../constants/tokens';
import PANCAKESWAP_ROUTER_ABI from '../../constants/RouterAbi.json';
// 获取代币余额和授权信息
export const fetchTokenData = async ({
  address,
  fromToken,
  toToken,
  amount,
}: {
  address: Address;
  fromToken: string;
  toToken: string;
  amount?: string;
}) => {
  try {
    // 基础调用：获取余额、授权和精度
    const calls = [
      {
        address: TOKEN_ADDRESSES[
          fromToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: TOKEN_ADDRESSES[
          toToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      },
      {
        address: TOKEN_ADDRESSES[
          fromToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address, DEX_ADDRESS],
      },
      {
        address: TOKEN_ADDRESSES[
          fromToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      },
      {
        address: TOKEN_ADDRESSES[
          toToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        abi: erc20Abi,
        functionName: 'decimals',
      },
    ];

    // 这里不检查 ts和 eslint 错误
    // 只有在有输入金额时才获取兑换比例
    if (amount && parseFloat(amount) > 0) {
      calls.push({
        address: DEX_ADDRESS as `0x${string}`,
        // @ts-expect-error - ABI type mismatch
        abi: PANCAKESWAP_ROUTER_ABI,
        functionName: 'getAmountsOut',
        args: [
          amount, // Convert bigint to string //
          // @ts-expect-error - Type mismatch
          [
            TOKEN_ADDRESSES[fromToken as keyof typeof TOKEN_ADDRESSES],
            TOKEN_ADDRESSES[toToken as keyof typeof TOKEN_ADDRESSES],
          ],
        ],
      });
    }

    const results = await executeMulticall({
      calls,
    });

    console.log(results,'swap的数据')

    // 处理基础数据
    const fromTokenBalance = results[0].success
      ? (results[0].data as bigint)
      : BigInt(0);
    const toTokenBalance = results[1].success
      ? (results[1].data as bigint)
      : BigInt(0);
    const allowance = results[2].success
      ? (results[2].data as bigint)
      : BigInt(0);
    const fromTokenDecimals = results[3].success
      ? (results[3].data as number)
      : 18;
    const toTokenDecimals = results[4].success
      ? (results[4].data as number)
      : 18;

    // 处理兑换比例数据
    let rateData = null;
    if (amount && parseFloat(amount) > 0 && results[5]?.success) {
      rateData = results[5].data as bigint[];
    }

    return {
      fromTokenBalance,
      toTokenBalance,
      allowance,
      fromTokenDecimals,
      toTokenDecimals,
      rateData,
    };
  } catch (error) {
    console.error('Multicall failed:', error);
    return {
      fromTokenBalance: BigInt(0),
      toTokenBalance: BigInt(0),
      allowance: BigInt(0),
      fromTokenDecimals: 18,
      toTokenDecimals: 18,
      rateData: null,
    };
  }
};

// 格式化代币余额
export const formatTokenBalance = (balance: bigint, decimals: number) => {
  if (!balance) return '0';
  const formatted = formatUnits(balance, decimals);
  // 限制最多显示4位小数
  const parts = formatted.split('.');
  if (parts.length === 1) return parts[0];
  return `${parts[0]}.${parts[1].slice(0, 6)}`;
};

// 检查是否需要授权
export const checkNeedsApproval = (
  allowance: bigint,
  amount: string,
  decimals: number
) => {
  console.log('allowance', allowance > 0);
  console.log('amount', amount);
  console.log('decimals', decimals);
  if (allowance <= 0) {
    return true;
  }
  return allowance && amount && decimals
    ? parseUnits(amount, decimals) > allowance
    : false;
};

// 计算最小输出金额（考虑滑点）
export const calculateMinOutput = (amountOut: bigint, slippage: number = 0) => {
  return (amountOut * BigInt(100 - slippage)) / BigInt(100);
};
