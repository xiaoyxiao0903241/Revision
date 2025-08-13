import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
  InfoPopover,
  Input,
  View,
} from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import {
  fallbackCopyText,
  formatAddress,
  formatte2Num,
  getCookieLanguage,
} from '~/lib/utils';
import { inviterInfo } from '~/services/auth/invite';
import MaxInviteAbi from '~/wallet/constants/MatrixNetworkAbi.json';
import { matrixNetwork } from '~/wallet/constants/tokens';
import { getInviteInfo } from '~/wallet/lib/web3/invite';

// 添加以太坊地址验证函数
const isValidEthereumAddress = (address: string): boolean => {
  // 检查是否为有效的以太坊地址格式
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const InviteJoin = () => {
  const t = useTranslations('community');
  const inviteT = useTranslations('invite');
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
  const lang = getCookieLanguage();
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
  }, [userAddress, lang]);
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
      toast.error(inviteT('enterReferralId'));
      return;
    }
    if (!publicClient || !userAddress) {
      toast.error(inviteT('missingParams'));
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
      console.log(result, 'sss');
      if (result.status === 'success') {
        toast.success(inviteT('joinSuccess'));
        refetch();
      } else {
        toast.error(inviteT('joinFailed'));
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        // 处理合约定义的错误
        if (errorMessage.includes('User rejected')) {
          toast.error(inviteT('userRejected'));
        } else if (errorMessage.includes('InvalidInitialization')) {
          toast.error(inviteT('invalidInitialization'));
        } else if (errorMessage.includes('NotInitializing')) {
          toast.error(inviteT('notInitializing'));
        } else if (errorMessage.includes('OwnableInvalidOwner')) {
          toast.error(inviteT('invalidOwner'));
        } else if (errorMessage.includes('OwnableUnauthorizedAccount')) {
          toast.error(inviteT('unauthorizedAccount'));
        }
        // 处理常见交易错误
        else if (errorMessage.includes('insufficient funds')) {
          toast.error(inviteT('insufficientFunds'));
        } else if (errorMessage.includes('user rejected')) {
          toast.error(inviteT('userRejected'));
        } else if (errorMessage.includes('already joined')) {
          toast.error(inviteT('alreadyJoined'));
        } else if (errorMessage.includes('invalid referrer')) {
          toast.error(inviteT('invalidReferrer'));
        } else {
          toast.error(inviteT('unknownError'));
        }
      }
    } finally {
      // setIsJoining(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        return;
      }
      const success = await fallbackCopyText(link);
      if (success) {
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
                  {formatte2Num.format(InviterAmountInfo?.referralAmount || 0)}{' '}
                  OLY
                </span>
              </div>
              <div className='flex flex-col flex-1'>
                <span className='text-xs text-foreground/50'>
                  {t('totalCommunityLocked')}
                </span>
                <span className='text-white font-mono text-lg'>
                  {formatte2Num.format(InviterAmountInfo?.totalAmount || 0)} OLY
                </span>
              </div>
              <div className='flex flex-col flex-1'>
                <span className='text-xs text-foreground/50'>
                  {t('communityRewards')}
                </span>
                <span className='text-white font-mono text-lg'>
                  {formatte2Num.format(InviterAmountInfo?.totalBonus || 0)} OLY
                </span>
              </div>
            </div>

            <div className='space-y-2'>
              <label className='text-gray-300 text-sm'>{t('referralBy')}</label>
              <div className='bg-[#1b1f48] items-center flex shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] px-3 py-4 w-full xl:w-5/6'>
                {inviteInfo?.isActive ? (
                  formatAddress(inviteInfo.networkMap as string)
                ) : (
                  <>
                    <Input
                      value={code}
                      className='flex-1'
                      onChange={e => handleCodeChange(e.target.value)}
                      placeholder={inviteT('enterReferralId')}
                    />
                    <button
                      className='bg-transparent gradient-text font-bold text-sm'
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
                <label className='text-foreground/50 text-xs'>
                  {t('referralLink')}
                </label>
                <div className='flex gap-2 items-center'>
                  <div className='text-white font-mono text-sm'>
                    {inviteInfo?.isActive ? (
                      <>
                        <span>{link}</span>
                        <InfoPopover
                          triggerClassName='inline ml-2'
                          className='w-80'
                        >
                          <Link
                            target='_blank'
                            href={link}
                            className='text-white font-mono text-sm break-all whitespace-normal underline'
                          >
                            {link}
                          </Link>
                        </InfoPopover>
                      </>
                    ) : (
                      <span className='opacity-50'>
                        {inviteT('noLinkAvailable')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCopy}
                className='px-4 h-8'
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
