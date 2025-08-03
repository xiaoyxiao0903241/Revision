// hooks/useWriteContractWithGasBuffer.ts
import { useAccount, useWriteContract } from 'wagmi';
import {
  WriteContractParameters,
  WriteContractReturnType,
} from 'wagmi/actions';
import { createPublicClient, http } from 'viem';
import { bsc } from 'viem/chains';

export function useWriteContractWithGasBuffer(
  gasMultiplier: number = 1.5, // 默认 ×1.5
  gasBuffer?: bigint, // 也可以额外+多少 gas
  use: boolean = false
) {
  const { address } = useAccount();

  const { writeContractAsync, ...rest } = useWriteContract();

  // 优先用自定义RPC
  const publicClient = createPublicClient({
    chain: bsc, // 这里可以根据实际链动态传递
    transport: http('https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'),
  });

  async function writeContractWithBuffer(
    params: Omit<WriteContractParameters, 'gas'>
  ): Promise<WriteContractReturnType> {
    if (!address) throw new Error('请先连接钱包');
    if (!publicClient) throw new Error('publicClient 未初始化');

    if (use) {
      try {
        // 自动估算 gas
        const estimatedGas = await publicClient.estimateContractGas({
          abi: params.abi,
          address: params.address,
          functionName: params.functionName,
          args: params.args,
          account: address,
          value: params.value,
        });

        console.log('estimatedGas', estimatedGas);
        // 放大 gas
        const adjustedGas =
          (estimatedGas * BigInt(Math.floor(gasMultiplier * 100))) /
            BigInt(100) +
          (gasBuffer !== undefined ? gasBuffer : BigInt(0));

        // 调用写操作，带 gas
        const { ...restParams } = params as any;
        return writeContractAsync({
          ...restParams,
          gas: adjustedGas,
        });
      } catch (err) {
        console.log('err', err);
        // 预估失败，降级为不传 gas
        const { ...restParams } = params as any;
        return writeContractAsync({
          ...restParams,
          // 不传 gas
        });
      }
    }
    const { ...restParams } = params as any;
    return writeContractAsync({
      ...restParams,
      // 不传 gas
    });
  }

  return {
    writeContractAsync: writeContractWithBuffer,
    ...rest,
  };
}
