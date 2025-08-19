import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi } from 'viem';
import { usePublicClient } from 'wagmi';
import Trend from '~/assets/trend.svg';
import {
  Button,
  Card,
  CardContent,
  // InfoPopover,
  Input,
  View,
} from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { fallbackCopyText, formatNumbedecimalScale } from '~/lib/utils';
import { inviterInfo } from '~/services/auth/invite';
import MaxInviteAbi from '~/wallet/constants/MatrixNetworkAbi.json';
import { matrixNetwork } from '~/wallet/constants/tokens';
import { getInviteInfo } from '~/wallet/lib/web3/invite';

// 添加以太坊地址验证函数
const isValidEthereumAddress = (address: string): boolean => {
  // 检查是否为有效的以太坊地址格式
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

function formatInviteAddress(address: string): string {
  return address.slice(0, 18) + '...' + address.slice(-15);
}
const InviteJoin = () => {
  const t = useTranslations('community');
  const commonT = useTranslations('common');
  const pathname = usePathname();
  const { userAddress } = useUserAddress();
  const publicClient = usePublicClient();
  const [isJoining] = useState(false);
  const { handleContractError, isContractError } = useContractError();
  const [code, setCode] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const [link, setLink] = useState('');
  const searchParams = useSearchParams();
  // const lang = getCookieLanguage();
  const urlParamName = 'address';

  // 获取邀请信息
  const { data: inviteInfo, refetch } = useQuery({
    queryKey: ['inviteInfo', userAddress],
    queryFn: () => getInviteInfo({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 40000,
  });

  // 获取邀请仓位
  const { data: InviterAmountInfo } = useQuery({
    queryKey: ['inviterInfo', userAddress],
    queryFn: async () =>
      inviterInfo(userAddress as string, userAddress as string),
    enabled: Boolean(userAddress),
  });

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (value) {
      setIsValidAddress(isValidEthereumAddress(value));
    } else {
      // setIsValidAddress(true);
    }
  };

  const resetState = useCallback(() => {
    setCode('');
    setIsValidAddress(true);
  }, [setCode]);

  const generateLink = useCallback(() => {
    if (userAddress) {
      const link = `${window.location.origin}/community?address=${userAddress}`;
      setLink(link);
    } else {
      setLink('');
    }
  }, [userAddress]);
  const getInviteCodeFromUrl = useCallback(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get(urlParamName);
      if (inviteCode) {
        setCode(inviteCode);
      } else {
        resetState();
      }
    }
  }, [urlParamName, setCode, resetState]);

  // 监听 URL 变化
  useEffect(() => {
    getInviteCodeFromUrl();
  }, [pathname, searchParams, getInviteCodeFromUrl]);

  useEffect(() => {
    generateLink();
  }, [generateLink]);

  const handleJoin = async (address: string) => {
    if (!address) {
      toast.error(t('referralDescription'));
      return;
    }
    if (!publicClient || !userAddress) {
      toast.error(t('missingParams'));
      return;
    }

    // setIsJoining(true);

    try {
      // 先模拟
      await publicClient.simulateContract({
        abi: MaxInviteAbi,
        address: matrixNetwork as `0x${string}`,
        functionName: 'joinNetwork',
        args: [address as `0x${string}`],
        account: userAddress as `0x${string}`, // 必须指定调用者
      });

      const hash = await writeContractAsync({
        abi: MaxInviteAbi as Abi,
        address: matrixNetwork as `0x${string}`,
        functionName: 'joinNetwork',
        args: [address as `0x${string}`],
      });

      const result = await publicClient.waitForTransactionReceipt({ hash });

      if (result.status === 'success') {
        toast.success(t('joinSuccess'));
        refetch();
      } else {
        toast.error(t('joinFailed'));
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        toast.error(t('unknownError'));
      }
    } finally {
      // setIsJoining(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        toast.success(commonT('copy_success_message'));
        return;
      }
      const success = await fallbackCopyText(link);
      if (success) {
        toast.success(commonT('copySuccess'));
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card>
      <div className='flex items-center gap-2'>
        <Trend className='w-6 h-6' />
        <span className='text-xl font-bold text-white'>
          {t('referralProgram')}
        </span>
      </div>
      <CardContent className='grid grid-cols-1 xl:grid-cols-2 gap-4 px-0 md:px-6'>
        <div className='flex flex-col gap-6  h-full'>
          {/* 左侧数据 */}
          <div className='space-y-4 flex-1'>
            <div className='grid grid-cols-2 md:flex items-center'>
              <div className='flex flex-col flex-1'>
                <span className='text-xs text-foreground/50'>
                  {t('totalReferralLocked')}
                </span>
                <span className='text-white font-mono text-lg'>
                  {formatNumbedecimalScale(
                    InviterAmountInfo?.referralAmount || 0,
                    2
                  )}{' '}
                  OLY
                </span>
              </div>
              <div className='flex flex-col flex-1'>
                <span className='text-xs text-foreground/50'>
                  {t('totalCommunityLocked')}
                </span>
                <span className='text-white font-mono text-lg'>
                  {formatNumbedecimalScale(
                    InviterAmountInfo?.totalAmount || 0,
                    2
                  )}{' '}
                  OLY
                </span>
              </div>
              <div className='flex flex-col flex-1'>
                {/* <span className='text-xs text-foreground/50'>
                  {t('communityRewards')}
                </span>
                <span className='text-white font-mono text-lg'>
                  {formatte2Num.format(InviterAmountInfo?.totalBonus || 0)} OLY
                </span> */}
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-gray-300 text-sm'>{t('referralBy')}</label>
              <div className='bg-[#1b1f48] items-center flex shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] px-3 py-4 w-full xl:w-5/6 gap-2'>
                {inviteInfo?.isActive ? (
                  formatInviteAddress(inviteInfo.networkMap as string)
                ) : (
                  <>
                    <Input
                      value={code}
                      className='flex-1'
                      onChange={e => handleCodeChange(e.target.value)}
                      placeholder={t('referralDescription')}
                    />
                    <button
                      className='bg-transparent text-gradient font-bold text-sm'
                      onClick={() => handleJoin(code)}
                      disabled={
                        isJoining ||
                        !isValidAddress ||
                        inviteInfo?.isActive ||
                        !userAddress
                      }
                      type='button'
                    >
                      {t('submit')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <View
          clipDirection='topRight-bottomLeft'
          className='bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30 p-4'
        >
          {/* 右侧推荐链接 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='space-y-1 flex-1'>
                <label className='text-foreground/50 text-base'>
                  {t('referralLink')}
                </label>
                <div className='flex gap-2 items-center'>
                  <div className='text-white font-mono text-sm break-all break-words'>
                    {inviteInfo?.isActive ? (
                      <>
                        <span>{link}</span>
                      </>
                    ) : (
                      <span className='opacity-50'>
                        {t('nobindDescription')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCopy}
                className='px-4 h-8 min-w-[100px]'
                clipSize={8}
                clipDirection='topLeft-bottomRight'
                disabled={!inviteInfo?.isActive || !link}
              >
                {t('copyLink')}
              </Button>
            </div>
            <div className='space-y-2 text-xs'>
              <h4 className='text-white font-semibold'>{t('inviteFriends')}</h4>
              <p className='text-foreground/50 text-xs leading-relaxed'>
                {t('referralBenefits')}
              </p>
            </div>
          </div>
        </View>
      </CardContent>
    </Card>
  );
};

export default InviteJoin;
