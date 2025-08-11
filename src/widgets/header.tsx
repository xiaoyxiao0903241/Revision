'use client';
// import { useTranslations } from "next-intl";
import Image from 'next/image';
// import { usePathname, useRouter } from "next/navigation";
import NetWork from '~/components/common/netWork';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { LanguageSwitcher } from './language-switcher';
import { Icon } from '~/components';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useEffect } from 'react';

/**
 * 配置 NProgress 进度条
 * 设置进度条的行为和样式参数
 */
NProgress.configure({
  showSpinner: true, // 显示右上角的旋转器
  minimum: 0.1, // 进度条的最小百分比
  speed: 500, // 进度条动画速度（毫秒）
  easing: 'ease', // 动画缓动函数
  trickle: true, // 自动递增进度
  trickleSpeed: 200, // 自动递增的速度
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
});
interface HeaderProps {
  onMenuClick?: () => void;
}

/**
 * Header 组件 - 应用程序顶部导航栏
 * 包含 Logo、语言切换器、网络状态、钱包连接按钮和移动端菜单按钮
 *
 * @param onMenuClick - 移动端菜单按钮点击回调函数
 * @returns JSX.Element
 */
export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const t = useTranslations("header")

  /**
   * 监听路由变化，控制 NProgress 进度条显示
   * 当路径或查询参数发生变化时，启动进度条动画
   */
  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 500);
    return () => {
      clearTimeout(timeout);
      NProgress.done();
    };
  }, [pathname, searchParams]);
  return (
    <header className='flex h-20 items-center justify-between md:px-9 px-4'>
      <div className='flex flex-col items-center justify-center'>
        <Image
          src='/images/widgets/site-logo.png'
          alt='logo'
          width={106}
          height={60}
          className='md:w-[106px] md:h-[60px] w-[60px] h-[30px]'
        />
      </div>
      <div className='flex items-center gap-4'>
        <LanguageSwitcher />
        <NetWork />
        <ConnectWalletButton></ConnectWalletButton>
        <button
          onClick={onMenuClick}
          className='md:hidden w-[25px] h-[25px] border-[#434c8c] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] border rounded-full rotate-90 flex items-center justify-center'
        >
          <Icon name='arrow' size={20} />
        </button>
      </div>
    </header>
  );
}
