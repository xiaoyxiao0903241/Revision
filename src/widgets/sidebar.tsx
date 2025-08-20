import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FC, useState } from 'react';
import { Icon, IconFontName, View } from '~/components';
import { cn } from '~/lib/utils';
import { LanguageSwitcherMobile } from './language-switcher';
interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  section?: string;
  uppercase?: boolean;
  collapsed?: boolean;
}

const NavigationItem = ({
  item,
  collapsed,
}: {
  item: NavigationItem;
  collapsed?: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    (pathname ?? '').endsWith(item.href) ||
    (pathname ?? '').startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        'flex w-full items-center space-x-3 px-5 py-4 text-base font-medium transition-colors',
        'hover:bg-foreground/5',
        isActive && 'text-gradient',
        collapsed && 'text-center'
      )}
    >
      {item.icon.startsWith('/') ? (
        <Image src={item.icon} alt={item.label} width={24} height={24} />
      ) : (
        <Icon
          name={item.icon as IconFontName}
          size={24}
          className={cn('text-gray-400', isActive && 'text-gradient', {
            'w-full text-center': collapsed,
          })}
        />
      )}
      {collapsed ? null : (
        <span
          className={cn(
            'text-gray-300',
            isActive && 'text-gradient',
            item.uppercase && 'uppercase'
          )}
        >
          {item.label}
        </span>
      )}
    </Link>
  );
};

export const SidebarContent: FC<{ collapsed: boolean }> = ({
  collapsed = false,
}) => {
  const t = useTranslations('navigation');

  const navigationItems: NavigationItem[] = [
    {
      label: t('dashboard'),
      href: '/',
      icon: 'dashboard',
      uppercase: true,
    },
    {
      label: t('analytics'),
      href: '/analytics',
      icon: 'analytics',
      uppercase: true,
    },
    {
      label: t('community'),
      href: '/community',
      icon: 'community',
      uppercase: true,
    },
    {
      label: t('noLockStaking'),
      href: '/staking',
      icon: 'staking',
      section: 'staking',
      uppercase: true,
    },
    {
      label: t('lockedStaking'),
      href: '/locked-staking',
      icon: 'locked-staking',
      section: 'staking',
      uppercase: true,
    },
    {
      label: t('lpBonds'),
      href: '/lp-bonds',
      icon: 'lp-bonds',
      section: 'bonds',
      uppercase: true,
    },
    {
      label: t('treasuryBonds'),
      href: '/treasury-bonds',
      icon: 'treasury-bonds',
      section: 'bonds',
      uppercase: true,
    },
    {
      label: t('dao'),
      href: '/dao',
      icon: 'dao',
      section: 'tools',
      uppercase: true,
    },
    {
      label: t('coolingPool'),
      href: '/cooling-pool',
      icon: 'cooling-pool',
      section: 'tools',
      uppercase: true,
    },
    {
      label: t('turbine'),
      href: '/turbine',
      icon: 'turbine',
      section: 'tools',
      uppercase: true,
    },
    {
      label: t('swap'),
      href: '/swap',
      icon: 'swap',
      section: 'tools',
      uppercase: true,
    },
  ];

  const footerItems: NavigationItem[] = [
    {
      label: t('documents'),
      href: 'https://oly-one-i0t0dn4.gamma.site/',
      icon: '/images/icon/docs.png',
    },
    {
      label: t('viewOnAve'),
      href: 'https://ave.ai/token/0x544028231562a43b106fbceca722b65cb5c861b0-bsc?from=Token',
      icon: '/images/icon/ave.png', // 使用默认图标
    },
    {
      label: t('viewOnDexScreener'),
      href: 'https://dexscreener.com/bsc/0x6865704FF097b1105Ed42B8517020e14Fe9A2ABD',
      icon: '/images/icon/dex.png', // 使用默认图标
    },
  ];

  const groupedItems = navigationItems.reduce(
    (acc, item) => {
      if (item.section) {
        if (!acc[item.section]) {
          acc[item.section] = [];
        }
        acc[item.section].push(item);
      } else {
        if (!acc.main) {
          acc.main = [];
        }
        acc.main.push(item);
      }
      return acc;
    },
    {} as Record<string, NavigationItem[]>
  );

  console.log(groupedItems, 'groupedItems111');

  return (
    <>
      {/* Main Navigation */}
      <div className='border-t border-foreground/10 mx-5'></div>
      {groupedItems.main && (
        <div className='space-y-2'>
          {groupedItems.main.map(item => {
            return (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Staking Section */}
      {groupedItems.staking && (
        <div className='space-y-2'>
          <h3
            className={cn(
              'px-5 text-xs font-semibold uppercase tracking-wider text-gray-400',
              {
                'w-full text-center': collapsed,
              }
            )}
          >
            {t('staking')}
          </h3>
          {groupedItems.staking.map(item => {
            return (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Bonds Section */}
      {groupedItems.bonds && (
        <div className='space-y-2'>
          <h3
            className={cn(
              'px-5 text-xs font-semibold uppercase tracking-wider text-gray-400',
              {
                'w-full text-center': collapsed,
              }
            )}
          >
            {t('bonds')}
          </h3>
          {groupedItems.bonds.map(item => {
            return (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Tools Section */}
      {groupedItems.tools && (
        <div className='space-y-2'>
          <h3
            className={cn(
              'px-5 text-xs font-semibold uppercase tracking-wider text-gray-400',
              {
                'w-full text-center': collapsed,
              }
            )}
          >
            {t('tools')}
          </h3>
          {groupedItems.tools.map(item => {
            return (
              <NavigationItem
                key={item.href}
                item={item}
                collapsed={collapsed}
              />
            );
          })}
        </div>
      )}

      <div className='flex-1'></div>
      {footerItems && (
        <div className='space-y-2'>
          {footerItems.map((item, index) => {
            return (
              <div
                className={cn(
                  'flex w-full items-center space-x-3 px-5 py-4 text-base font-medium transition-colors hover:bg-foreground/5 cursor-pointer',
                  {
                    'items-center w-full justify-center': collapsed,
                  }
                )}
                onClick={() => {
                  window.open(item.href);
                }}
                key={index}
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={24}
                  height={24}
                />
                {collapsed ? null : <span>{item.label}</span>}
              </div>
            );
          })}
        </div>
      )}
      {/* Social Links */}
      <div className='py-10'>
        <div
          className={cn('flex gap-6 px-5', {
            'flex-col items-center justify-center': collapsed,
          })}
        >
          <a
            href='#'
            aria-label='x'
            onClick={() => {
              window.open('https://x.com/OLYONEGlobal');
            }}
          >
            <Image
              src='/images/icon/x.png'
              alt='Twitter'
              width={32}
              height={32}
            />
          </a>
          <a
            href='#'
            aria-label='Telegram'
            onClick={() => {
              window.open('https://t.me/OlyONECommunity');
            }}
          >
            <Image
              src='/images/icon/telegram.png'
              alt='Telegram'
              width={32}
              height={32}
            />
          </a>
          <a
            href='#'
            aria-label='YouTube'
            onClick={() => {
              window.open('https://www.youtube.com/@OLYONEGlobal');
            }}
          >
            <Image
              src='/images/icon/youtube.png'
              alt='YouTube'
              width={32}
              height={32}
            />
          </a>
          <div className='flex-1'></div>
          <LanguageSwitcherMobile />
        </div>
      </div>
    </>
  );
};

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className='hidden md:flex p-4 flex-col'>
      <div
        className={cn('sidebar min-h-[calc(100vh-32px)] transition-all', {
          collapsed: collapsed,
        })}
      >
        <nav className='h-full flex flex-col gap-6 pt-6'>
          <div className='flex items-center justify-between px-5 relative'>
            <Image
              src='/images/widgets/site-logo.png'
              alt='logo'
              width={64}
              height={36}
            />
            <motion.div
              className='absolute'
              initial={{
                right: 20,
              }}
              animate={{
                right: collapsed ? -9 : 20,
              }}
            >
              <View
                clipDirection='topLeft-bottomRight'
                clipSize={4}
                onClick={() => setCollapsed(!collapsed)}
                border={true}
                borderWidth={1}
                borderColor='#434c8c'
                className={cn(
                  'flex items-center justify-center w-[24px] h-[24px] cursor-pointer text-xs bg-[#1b1f48] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] text-foreground transition-all',
                  {
                    'w-[18px] h-[18px]': collapsed,
                  }
                )}
              >
                <motion.div
                  initial={{
                    rotate: 90,
                  }}
                  animate={{
                    rotate: collapsed ? -90 : 90,
                  }}
                >
                  <Icon
                    name='arrow'
                    size={12}
                    className='pointer-events-none'
                  />
                </motion.div>
              </View>
            </motion.div>
          </div>
          <SidebarContent collapsed={collapsed} />
        </nav>
      </div>
    </div>
  );
};
