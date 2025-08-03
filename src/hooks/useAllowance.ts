import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi } from 'viem';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

interface UseAllowanceProps {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
}

export function useAllowance({
  tokenAddress,
  spenderAddress,
}: UseAllowanceProps) {
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

  const { data: allowance, ...rest } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [address || '0x', spenderAddress],
    query: {
      enabled: !!address && decimals !== undefined,
    },
  });

  const formattedAllowance = useMemo(() => {
    if (!allowance || decimals === undefined) return '0';
    return formatUnits(allowance, decimals);
  }, [allowance, decimals]);

  return {
    allowance: formattedAllowance,
    rawAllowance: allowance,
    decimals,
    ...rest,
  };
}
