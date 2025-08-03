import { createPublicClient, http, custom } from 'viem';
import { Abi, encodeFunctionData, decodeFunctionResult } from 'viem';
import {
  mainnet,
  bsc,
  polygon,
  arbitrum,
  optimism,
  base,
  bscTestnet,
  avalanche,
  sepolia,
} from 'viem/chains';
import { chainId } from '@/src/constants/tokens';
// Multicall3 contract ABI
const MULTICALL_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'target', type: 'address' },
          { name: 'allowFailure', type: 'bool' },
          { name: 'callData', type: 'bytes' },
        ],
        name: 'calls',
        type: 'tuple[]',
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        components: [
          { name: 'success', type: 'bool' },
          { name: 'returnData', type: 'bytes' },
        ],
        name: 'returnData',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// 主网 Multicall3 合约地址
const MULTICALL_ADDRESS = {
  1: '0xcA11bde05977b3631167028862bE2a173976CA11', // Ethereum
  56: '0xcA11bde05977b3631167028862bE2a173976CA11', // BSC
  137: '0xcA11bde05977b3631167028862bE2a173976CA11', // Polygon
  42161: '0xcA11bde05977b3631167028862bE2a173976CA11', // Arbitrum
  10: '0xcA11bde05977b3631167028862bE2a173976CA11', // Optimism
  8453: '0xcA11bde05977b3631167028862bE2a173976CA11', // Base
  97: '0xcA11bde05977b3631167028862bE2a173976CA11', // BSC Testnet
} as const;

// 链配置映射
const CHAIN_CONFIG = {
  1: mainnet,
  56: bsc,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
  43114: avalanche,
  11155111: sepolia,
  97: bscTestnet,
} as const;

export interface ContractCall {
  address: `0x${string}`;
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
  bondIndex?: number;
}

export interface MulticallResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * 执行 multicall 调用

 * @param calls 合约调用数组
 * @param rpcUrl 可选的 RPC URL
 * @returns 解码后的调用结果数组
 */
export async function executeMulticall<T = unknown>({
  calls,
  rpcUrl,
}: {
  calls: ContractCall[];
  rpcUrl?: string;
}): Promise<MulticallResult<T>[]> {
  if (calls.length === 0) return [];

  // 验证参数
  if (!chainId) {
    throw new Error('Chain ID is required');
  }

  if (!calls.every(call => call.address && call.abi && call.functionName)) {
    throw new Error('Invalid call parameters');
  }

  const multicallAddress =
    MULTICALL_ADDRESS[chainId as keyof typeof MULTICALL_ADDRESS];
  if (!multicallAddress) {
    throw new Error(`Multicall not supported on chain ${chainId}`);
  }

  // 获取链配置
  const chainConfig = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
  if (!chainConfig) {
    throw new Error(`Chain configuration not found for chain ${chainId}`);
  }

  // 创建公共客户端，优先用 window.ethereum
  let transport;
  if (typeof window !== 'undefined' && window.ethereum) {
    transport = custom(window.ethereum);
  } else {
    transport = http(rpcUrl);
  }

  const client = createPublicClient({
    chain: chainConfig,
    transport,
  });

  // 准备调用数据
  const callsData = calls.map(call => {
    try {
      return {
        target: call.address,
        allowFailure: true,
        callData: encodeFunctionData({
          abi: call.abi,
          functionName: call.functionName,
          args: call.args,
        }),
      };
    } catch (error) {
      console.error('Error encoding function data:', {
        address: call.address,
        functionName: call.functionName,
        args: call.args,
        error,
      });
      throw error;
    }
  });

  try {
    // 执行 multicall
    const result = await client.readContract({
      address: multicallAddress,
      abi: MULTICALL_ABI,
      functionName: 'aggregate3',
      args: [callsData],
    });

    // 解码结果
    return result.map((item, index) => {
      if (!item.success || !item.returnData || item.returnData === '0x') {
        console.error('Call failed or returned empty data:', {
          index,
          success: item.success,
          returnData: item.returnData,
        });
        return {
          success: false,
          error: new Error('Call failed or returned empty data'),
        } as MulticallResult<T>;
      }

      try {
        const decoded = decodeFunctionResult({
          abi: calls[index].abi,
          functionName: calls[index].functionName,
          data: item.returnData,
        });
        return {
          success: true,
          data: decoded as T,
        } as MulticallResult<T>;
      } catch (error) {
        console.error('Error decoding result:', {
          index,
          functionName: calls[index].functionName,
          returnData: item.returnData,
          error,
        });
        return {
          success: false,
          error: error as Error,
        } as MulticallResult<T>;
      }
    });
  } catch (error) {
    console.error('Multicall execution failed:', error);
    throw new Error(`Multicall failed: ${error}`);
  }
}

export const getCurrentBlock = async () => {
  try {
    // 获取链配置
    const chainConfig = CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
    if (!chainConfig) {
      throw new Error(`Chain configuration not found for chain ${chainId}`);
    }

    // 创建公共客户端，优先用 window.ethereum
    let transport;
    if (typeof window !== 'undefined' && window.ethereum) {
      transport = custom(window.ethereum);
    } else {
      transport = http(
        'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
      );
    }
    let client;
    client = createPublicClient({
      chain: chainConfig,
      transport,
    });
    console.log('client', client);
    if (!client) {
      throw new Error('Failed to get public client');
    }
    try {
      const blockNumber = await client.getBlockNumber();
      return Number(blockNumber);
    } catch (error) {
      console.log('error', error);
      transport = http(
        'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
      );
      client = createPublicClient({
        chain: chainConfig,
        transport,
      });
      const blockNumber = await client.getBlockNumber();
      return Number(blockNumber);
    }
  } catch (error) {
    console.error('Error getting current block:', error);
    return 0;
  }
};
