// signatureSalts
import { Address, Abi, formatUnits } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import RewardPoolV7Abi from '../../constants/RewardPoolV7.json';
import { taxReceiver } from '../../constants/tokens';
import TaxReceiver_ABI from '../../constants/TaxReceiver.json';

interface signatureInfo {
  isUsed: boolean;
  isSignatureUsed: boolean;
}

interface RaioAmountResult {
  raioAmount: number;
}

interface MulticallResult {
  success: boolean;
  data: boolean;
}

export const verifySignature = async ({
  signature,
  address,
}: {
  signature: string;
  address: Address;
}): Promise<signatureInfo> => {
  try {
    const result = (await executeMulticall({
      calls: [
        {
          address: address as `0x${string}`,
          abi: RewardPoolV7Abi.abi as Abi,
          functionName: 'signatureSalts',
          args: [signature],
        },
        {
          address: address as `0x${string}`,
          abi: RewardPoolV7Abi.abi as Abi,
          functionName: 'usedSignatures',
          args: [signature],
        },
      ],
    })) as MulticallResult[];

    // 检查 multicall 是否成功执行
    if (!result || result.length < 2) {
      return {
        isUsed: false,
        isSignatureUsed: false,
      };
    }

    // 处理 signatureSalts 和 usedSignatures 的结果
    const signatureSaltResult = result[0];
    const usedSignatureResult = result[1];

    return {
      isUsed: signatureSaltResult?.success
        ? (signatureSaltResult.data as boolean)
        : false,
      isSignatureUsed: usedSignatureResult?.success
        ? (usedSignatureResult.data as boolean)
        : false,
    };
  } catch (error) {
    console.error('Error verifying signature:', error);
    // 在发生错误时返回默认值
    return {
      isUsed: false,
      isSignatureUsed: false,
    };
  }
};

export const raioTotalAmount = async (): Promise<RaioAmountResult> => {
  const result = (await executeMulticall({
    calls: [
      {
        address: taxReceiver as `0x${string}`,
        abi: TaxReceiver_ABI as Abi,
        functionName: 'snapshotAmount',
        args: [],
      },
      {
        address: taxReceiver as `0x${string}`,
        abi: TaxReceiver_ABI as Abi,
        functionName: 'taxAmount',
        args: [],
      },
    ],
  })) as { success: boolean; data: bigint }[];
  if (result && result.length) {
    const all =
      Number(formatUnits(result[0].data, 9)) / 2 +
      Number(formatUnits(result[1].data, 9));
    return {
      raioAmount: all,
    };
  }
  return {
    raioAmount: 0,
  };
};
