'use client';
import { useMemo } from 'react';
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { fallbackCopyText, formatAddress } from '~/lib/utils';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { chainId as chainIdConstant } from '~/wallet/constants/tokens';
// import copy from "copy-to-clipboard";
import ClipboardJS from 'clipboard';
import Image from 'next/image';
import { useTokenBalance } from '~/hooks/useTokenBalance';
import { TOKEN_ADDRESSES } from '~/wallet/constants/tokens';
import { useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { bnbPrice } from '~/services/auth/head';
import { useQuery } from '@tanstack/react-query';

export default function ConnectWalletButton({
  className,
  from = 'header',
}: {
  className?: string;
  from?: string;
}) {
  const t = useTranslations();
  const tcopy = useTranslations('invite');
  const { setUserAddress, isSigned, setIsSigned, clearSignature, sign } =
    useUserAddress();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [copeA, setcopeA] = useState(1);
  const [copeB, setcopeB] = useState(1);
  const { userAddress } = useUserAddress();

  const { balance: asBalance } = useTokenBalance({
    tokenAddress: TOKEN_ADDRESSES.OLY as `0x${string}`,
  });

  const { balance: daiBalance } = useTokenBalance({
    tokenAddress: TOKEN_ADDRESSES.DAI as `0x${string}`,
  });

  const { data: bnbBalance } = useBalance({
    address: address as `0x${string}`,
  });

  const assetsList = [
    {
      img: '/imgs/common/usdt.png',
      name: 'USDT',
      fullName: 'USDT',
      amount: daiBalance || '0',
      usdt: '100',
    },
    {
      img: '/imgs/common/bnb.png',
      name: 'BNB',
      fullName: 'BNB',
      amount: bnbBalance
        ? formatUnits(bnbBalance.value, bnbBalance.decimals)
        : '0',
      usdt: '0',
    },
    {
      img: '/imgs/common/one.png',
      name: 'OLY',
      fullName: 'OLY',
      amount: asBalance || '0',
      usdt: '100',
    },
  ];
  const chainId = useChainId();
  const addressRef = useRef<HTMLButtonElement>(null);
  const addressClipboardRef = useRef<ClipboardJS | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  //获取bnb价格
  const { data: bnbprice } = useQuery({
    queryKey: ['getBnbPrice'],
    queryFn: () => {
      if (!userAddress) return Promise.reject(new Error('Missing  address'));
      return bnbPrice();
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 30000,
  });

  const totalValueInUSD = useMemo(() => {
    let total = 0;
    // 添加 DAI 价值
    if (daiBalance) {
      total += parseFloat(daiBalance);
    }
    // 添加 BNB 价值
    if (bnbBalance && bnbprice && Number(bnbprice) > 0) {
      total +=
        parseFloat(formatUnits(bnbBalance.value, bnbBalance.decimals)) *
        Number(bnbprice);
    }
    // 添加 oly 价值
    // if (asBalance) {
    //   total += parseFloat(asBalance);
    // }
    return total.toFixed(1);
  }, [daiBalance, bnbBalance, bnbprice]);

  // 添加点击外部区域关闭菜单的功能
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 监听账户变化，保持按钮收起状态
  useEffect(() => {
    setIsOpen(false);
  }, [address]);

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== chainIdConstant) {
      switchChain({ chainId: chainIdConstant });
    }
  }, [isConnected, chainId, switchChain]);
  // 监听连接状态变化
  useEffect(() => {
    if (!isConnected) {
      setUserAddress(null);
      setIsSigned(false);
    }
  }, [isConnected, setUserAddress, setIsSigned]);

  const handleSignIn = async () => {
    if (!address) return;

    try {
      setIsSigning(true);
      await sign(address);
      setIsOpen(false);
    } catch (error) {
      console.error('Sign in failed:', error);
      disconnect();
    } finally {
      setIsSigning(false);
    }
  };
  useEffect(() => {
    if (addressRef.current) {
      addressClipboardRef.current = new ClipboardJS(addressRef.current, {
        text: () => {
          console.log(
            'ClipboardJS text function called with address:',
            address
          );
          return address as string;
        },
      });

      addressClipboardRef.current.on('success', () => {
        console.log('ClipboardJS success');
        setcopeA(copeA + 1);
        // toast.success(tcopy("copySuccess"));
      });
      addressClipboardRef.current.on('error', () => {
        console.log('ClipboardJS error');
        setcopeA(copeA - 1);
        // toast.error(tcopy("copyError"));
      });
    }

    return () => addressClipboardRef.current?.destroy();
  }, [address, setcopeA, copeA]);
  const handleCopyAddress = async () => {
    if (address) {
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(address);
          // toast.success(tcopy("copySuccess"));
          setcopeB(copeB + 1);
          return;
        }
        const success = await fallbackCopyText(address);
        if (success) {
          setcopeB(copeB + 1);
          // toast.success(tcopy("copySuccess"));
          return;
        }
        // toast.success(tcopy("copySuccess"));
      } catch (error) {
        console.error(error);
        // toast.error(tcopy("copyError"));
        setcopeB(copeB - 1);
      }
    }
  };
  useEffect(() => {
    if (copeA > 1 || copeB > 1) {
      const timer = setTimeout(() => {
        toast.success(tcopy('copySuccess'));
        setcopeA(1);
        setcopeB(1);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (copeA < 1 && copeB < 1) {
      toast.error(tcopy('copyError'));
      setcopeA(1);
      setcopeB(1);
    }
  }, [copeA, copeB, tcopy, setcopeA, setcopeB]);

  const handleDisconnect = () => {
    if (address) {
      clearSignature(address);
    }
    setIsSigned(false);
    setUserAddress(null);
    disconnect();
  };

  // const tokenList = [
  //   {
  //     symbol: "AS",
  //     name: "AS",
  //     address: TOKEN_ADDRESSES.AS,
  //     decimals: 9,
  //     image: "/tokens/AS.png"
  //   },
  //   {
  //     symbol: "DAI",
  //     name: "DAI",
  //     address: TOKEN_ADDRESSES.DAI,
  //     decimals: 18,
  //     image: "/tokens/usdt.png"
  //   }
  // ];

  // const handleAddToken = async (token: TokenInfo) => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_watchAsset',
  //         params: {
  //           type: 'ERC20',
  //           options: {
  //             address: token.address,
  //             symbol: token.symbol,
  //             decimals: token.decimals
  //           },
  //         },
  //       });
  //     } catch (error) {
  //       console.log('error', error)
  //       toast.error(t2("add_tip"));
  //     }
  //   } else {
  //     toast.error("请先安装钱包插件");
  //   }
  // };

  if (!isConnected) {
    return (
      <button
        onClick={openConnectModal}
        className={` xl:w-[170px] xl:h-[50px] h-[35px] ${from === 'header' ? "bg-transparent bg-[url('/imgs/common/connect.png')] bg-cover xl:leading-[50px]  w-[120px]" : 'bg-[#576AF4] hover:bg-[#576AF4]/80 pt-1'}  text-white rounded-md text-sm xl:text-base  ${className}`}
      >
        <span
          className={`${from === 'header' ? 'xl:leading-[45px] leading-[30px]' : 'xl:leading-[45px] xl:px-3 leading-[30px] lg:text-xl text-[14px]'}  h-full block`}
        >
          {t('common.wallet.connect')}
        </span>
      </button>
    );
  }

  if (isConnected && !isSigned) {
    return (
      <button
        onClick={handleSignIn}
        disabled={isSigning}
        className={`px-4 py-2 bg-[#7238EF] text-[14px] text-white rounded-md hover:bg-[#7238EF]/80  ${className}`}
      >
        {isSigning
          ? t('common.wallet.signing')
          : t('common.wallet.please_sign')}
      </button>
    );
  }

  const shortAddress = address ? formatAddress(address) : '';

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex rounded-full items-center gap-2 h-10 box-border px-2 py-2 bg-[#fff]'
      >
        <div className='flex items-center gap-2'>
          {/* <Network className="w-4 h-4" /> */}
          <Image
            src='/imgs/common/wallet.png'
            width={32}
            height={32}
            alt=''
          ></Image>
          <span className='text-[#0D0EC9] font-bold'>{shortAddress}</span>
        </div>
        <ChevronDown
          color='black'
          className={`w-4 h-4 transition-transform  ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2  p-[20px] w-[320px] bg-white border border-white/10 rounded-[24px] shadow-lg z-[50]'>
          <div className=' py-2 border-b border-white/10 flex items-center justify-between'>
            <div className='flex items-center'>
              <div className='text-sm text-[#0D0EC9]'>{shortAddress}</div>
              <Image
                src='/imgs/common/share.png'
                className='ml-2 cursor-pointer'
                width={16}
                height={16}
                alt=''
                onClick={() => {
                  window.open(`https://bscscan.com/address/${address}`);
                }}
              ></Image>
              <Image
                src='/imgs/common/copy.png'
                className='ml-2 cursor-pointer'
                width={16}
                height={16}
                alt=''
                onClick={() => {
                  handleCopyAddress();
                }}
              ></Image>
            </div>
            <button
              className='text-sm px-2 py-1 rounded-[8px] bg-gradient-to-b from-[#45BAFF] to-[#C27AFF] ml-10'
              onClick={() => {
                handleDisconnect();
                setIsOpen(false);
              }}
            >
              {t('common.wallet.disconnect')}
            </button>
          </div>
          <div className='flex flex-col text-[#161616]'>
            <h2 className='text-3xl font-bold'>${totalValueInUSD}</h2>
            {/* <span className='mt-[6px]'>{t('common.wallet.mywallet')}</span> */}
          </div>
          <div className='flex flex-col gap-y-3 mt-3'>
            <span className='text-[#161616] text-sm'>
              {t('common.wallet.assets')}
            </span>
            <ul className='flex flex-col gap-y-4'>
              {assetsList.map(it => (
                <li
                  key={it.name}
                  className='text-[#161616] flex justify-between items-center'
                >
                  <div className='flex items-center'>
                    <Image src={it.img} width={36} height={36} alt=''></Image>
                    <div className='flex flex-col text-base ml-3'>
                      <div className='flex items-center'>
                        <span className='font-bold text-[16px] mr-[4px]'>
                          {it.name}
                        </span>
                        {/* <span>{it.fullName}</span> */}
                      </div>
                      {/* <span className="text-xs">BNB CHAIN</span> */}
                    </div>
                  </div>
                  <div className='flex flex-col text-base text-[#161616]'>
                    <span>{it.amount}</span>
                    {/* <span className="text-[12px] text-xs">${it.usdt}</span> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* <button
            onClick={() => {
              openChainModal?.();
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
          >
            {t("common.wallet.switch_network")}
          </button> */}

          {/* <button
            onClick={() => {
              setShowAddToken(true);
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-[#FF8908] hover:bg-white/5 transition-colors border-t border-white/10"
          >
            {t2("add_token")}
          </button> */}
        </div>
      )}
      {/* <AddTokenModal
        open={showAddToken}
        onClose={() => setShowAddToken(false)}
        tokens={tokenList}
        onAdd={handleAddToken}
      /> */}
    </div>
  );
}
