import { Address, Abi } from 'viem';
import { executeMulticall } from '@/lib/multicall';
import { matrixNetwork } from '@/src/constants/tokens';
import MaxInviteAbi from '@/src/constants/MatrixNetworkAbi.json';
import {
  TOKEN_ADDRESSES,
  DEX_ADDRESS,
  PANCAKESWAP_ROUTER_ABI,
} from '@/src/constants/tokens';

interface InviteInfo {
  isActive: boolean;
  networkMap: Address;
}

interface MulticallResult {
  success: boolean;
  data: bigint | boolean | Address | [Address, bigint];
}

export const getInviteInfo = async ({
  address,
}: {
  address: Address;
}): Promise<InviteInfo> => {
  const result = (await executeMulticall({
    calls: [
      {
        address: matrixNetwork as `0x${string}`,
        abi: MaxInviteAbi as Abi,
        functionName: 'isActive',
        args: [address],
      },
      {
        address: matrixNetwork as `0x${string}`,
        abi: MaxInviteAbi as Abi,
        functionName: 'networkInfo',
        args: [address],
      },
    ],
  })) as MulticallResult[];
  console.log('result', result);
  return {
    isActive: result[0]?.success ? (result[0].data as boolean) : false,
    networkMap: result[1]?.success
      ? (result[1].data as [Address, bigint])[0]
      : '0x0000000000000000000000000000000000000000',
  };
};

export const getPrice = async ({
  fromToken,
  toToken,
  amount,
}: {
  fromToken: string;
  toToken: string;
  amount?: string;
}) => {
  try {
    const calls = [
      {
        address: DEX_ADDRESS as `0x${string}`,
        abi: PANCAKESWAP_ROUTER_ABI as Abi,
        functionName: 'getAmountsOut',
        args: [
          amount,
          [
            TOKEN_ADDRESSES[fromToken as keyof typeof TOKEN_ADDRESSES],
            TOKEN_ADDRESSES[toToken as keyof typeof TOKEN_ADDRESSES],
          ],
        ],
      },
    ];

    const results = await executeMulticall({
      calls,
    });
    console.log(results, 'results');
    let rateData = null;
    if (amount && parseFloat(amount) > 0 && results[0]?.success) {
      rateData = results[0].data as bigint[];
    }
    return {
      rateData,
    };
  } catch (error) {
    console.error('Multicall failed:', error);
    return {
      rateData: null,
    };
  }
};
