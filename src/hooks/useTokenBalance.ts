import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

interface UseTokenBalanceProps {
  tokenAddress: `0x${string}`;
}

export function useTokenBalance({ tokenAddress }: UseTokenBalanceProps) {
  const { address } = useAccount();

  // 获取代币精度
  const { data: decimals } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  });

  // 获取代币余额
  const { data: balance, ...rest } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [address || '0x'],
    query: {
      enabled: !!address && decimals !== undefined,
    },
  });

  const formattedBalance = useMemo(() => {
    if (!balance || decimals === undefined) return '0';
    // 使用 viem 的 formatUnits 函数来处理大数转换
    return formatUnits(balance, decimals);
  }, [balance, decimals]);

  return {
    balance: formattedBalance,
    rawBalance: balance,
    decimals,
    ...rest,
  };
}
