import { useWriteContract } from 'wagmi';
import { useCallback } from 'react';
import { Abi } from 'viem';

interface UseContractWriteProps {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
}

export function useContractWrite({
  address,
  abi,
  functionName,
}: UseContractWriteProps) {
  const { writeContract, ...rest } = useWriteContract();

  const write = useCallback(
    (args?: readonly unknown[], value?: bigint) => {
      if (!writeContract) return;

      return writeContract({
        abi,
        address,
        functionName,
        args,
        value,
      });
    },
    [writeContract, abi, address, functionName]
  );

  return {
    write,
    ...rest,
  };
}
