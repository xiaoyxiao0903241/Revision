import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { fallbackCopyText } from '~/lib/utils';
import { useTranslations } from 'next-intl';
// import ClipboardJS from "clipboard";
import { toast } from 'sonner';

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  image?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  tokens: TokenInfo[];
  onAdd: (token: TokenInfo) => void;
}

export default function AddTokenModal({ open, onClose, tokens, onAdd }: Props) {
  const [copeA, setcopeA] = useState(1);
  const [copeB, setcopeB] = useState(1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // const clipboardRef = useRef<ClipboardJS | null>(null);
  // const [link, setLink] = useState("");
  const t = useTranslations('invite');
  const t2 = useTranslations('common.addTokenModal');
  // useEffect(() => {
  //   if (buttonRef.current) {
  //     // 初始化 Clipboard 实例
  //     clipboardRef.current = new ClipboardJS(buttonRef.current, {
  //       text: () => link,
  //     });

  //     // 监听复制结果
  //     clipboardRef.current.on("success", () => {
  //       setcopeA(copeA + 1);
  //       // toast.success(t("copySuccess"));
  //     });
  //     clipboardRef.current.on("error", () => {
  //       setcopeA(copeA - 1);
  //       // toast.error(t("copyError")+'-101');
  //     });
  //   }

  //   // 清理实例避免内存泄漏
  //   return () => clipboardRef.current?.destroy();
  // }, [copeA, link, setcopeA]);

  const handleCopy = async (link: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
        setcopeB(copeB + 1);
        return;
      }
      const success = await fallbackCopyText(link);
      if (success) {
        setcopeB(copeB + 1);
        return;
      }
    } catch (error) {
      console.error(error);
      setcopeB(copeB - 1);
    }
  };
  useEffect(() => {
    if (copeA > 1 || copeB > 1) {
      const timer = setTimeout(() => {
        toast.success(t('copySuccess'));
        setcopeA(1);
        setcopeB(1);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (copeA < 1 && copeB < 1) {
      toast.error(t('copyError'));
      setcopeA(1);
      setcopeB(1);
    }
  }, [copeA, copeB, t, setcopeA, setcopeB]);

  if (!open) return null;
  return createPortal(
    <div
      className='fixed inset-0 z-[9999] flex items-center justify-center'
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }}
      onClick={onClose}
    >
      <div
        className='relative w-[95%] md:max-w-[750px] bg-[#222] border-0 px-2 py-4 md:p-10 rounded-lg md:rounded-3xl'
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          className='absolute right-4 top-4 text-2xl text-white'
          onClick={onClose}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <Image
            src='/img/common/close.png'
            alt=''
            width={24}
            height={24}
            className='cursor-pointer'
          />
        </button>

        <h2 className='text-base md:text-xl font-bold mb-4'>
          {t2('add_token')}
        </h2>
        <table className='w-full text-left'>
          <thead>
            <tr>
              <th className='text-center text-sm md:text-xl md:text-right'>
                {t2('name')}
              </th>
              <th className='text-center text-sm md:text-xl'>
                {t2('address')}
              </th>
              <th className='text-right pr-[30px] box-border text-sm md:text-xl'>
                {t2('action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {tokens.map(token => (
              <tr key={token.address}>
                <td colSpan={3}>
                  <div className=' bg-[#333] my-2 p-1 rounded-xl md:p-[20px] flex items-center justify-center w-[100%]'>
                    <div className='w-[20%] md:w-[33%] flex items-center justify-start'>
                      <Image
                        src={token.image || '/img/common/default-token.png'}
                        alt=''
                        width={50}
                        height={50}
                        className='cursor-pointer hidden md:block'
                      />
                      <Image
                        src={token.image || '/img/common/default-token.png'}
                        alt=''
                        width={30}
                        height={30}
                        className='cursor-pointer block ml-3 md:hidden'
                      />
                      <span className='ml-10 hidden md:block'>
                        {token.name}
                      </span>
                    </div>

                    <div className='w-[50%] md:w-[33%] flex items-center'>
                      <span className='text-blue-400 hidden md:block'>
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </span>
                      <span
                        className='text-blue-400  md:hidden'
                        onClick={() => {
                          handleCopy(token.address);
                        }}
                      >
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </span>
                      <span
                        ref={buttonRef}
                        className='text-orange-400 ml-1 cursor-pointer hidden md:block'
                        onClick={() => {
                          handleCopy(token.address);
                        }}
                      >
                        (Copy)
                      </span>
                    </div>
                    <div className='w-[30%] md:w-[33%] text-right'>
                      <button
                        className='bg-[#FF8908] text-[14px] md:text-xl text-white px-2 md:px-4 py-1 rounded'
                        onClick={() => onAdd(token)}
                      >
                        {t2('add')}
                      </button>
                    </div>
                  </div>
                </td>
                {/* <td></td>
                <td>

                </td>
                <td>

                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>,
    document.body
  );
}
