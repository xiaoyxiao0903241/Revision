// signatureSalts
import { Address, Abi, formatUnits } from 'viem';
import { executeMulticall } from '~/lib/multicall';
import RewardPoolV7Abi from '../../constants/RewardPoolV7.json';
import { taxReceiver } from '../../constants/tokens';
import TaxReceiver_ABI from '../../constants/TaxReceiver.json';

interface signatureInfo {
  isUsed: boolean;
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
  const result = (await executeMulticall({
    calls: [
      {
        address: address as `0x${string}`,
        abi: RewardPoolV7Abi as Abi,
        functionName: 'signatureSalts',
        args: [signature],
      },
    ],
  })) as MulticallResult[];
  console.log('result', result);
  return {
    isUsed: result[0]?.success ? (result[0].data as boolean) : false,
  };
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
