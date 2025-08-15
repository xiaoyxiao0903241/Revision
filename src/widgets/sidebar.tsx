'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, IconFontName } from '~/components';
import { cn } from '~/lib/utils';
import { LanguageSwitcherMobile } from './language-switcher';

interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  section?: string;
  uppercase?: boolean;
}

const NavigationItem = ({ item }: { item: NavigationItem }) => {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        'flex w-full items-center space-x-3 px-5 py-4 text-base font-medium transition-colors',
        'hover:bg-foreground/5',
        isActive && 'text-gradient'
      )}
    >
      {item.icon.startsWith('/') ? (
        <Image src={item.icon} alt={item.label} width={24} height={24} />
      ) : (
        <Icon
          name={item.icon as IconFontName}
          size={24}
          className={cn('text-gray-400', isActive && 'text-gradient')}
        />
      )}
      <span
        className={cn(
          'text-gray-300',
          isActive && 'text-gradient',
          item.uppercase && 'uppercase'
        )}
      >
        {item.label}
      </span>
    </Link>
  );
};

export const SidebarContent = () => {
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
      href: ' https://ave.ai/token/${TOKEN_ADDRESSES.OLY}-bsc',
      icon: '/images/icon/ave.png', // 使用默认图标
    },
    {
      label: t('viewOnDexScreener'),
      href: 'https://dexscreener.com/bsc/${TOKEN_ADDRESSES.OLY}',
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
      {groupedItems.main && (
        <div className='space-y-2'>
          {groupedItems.main.map(item => {
            return <NavigationItem key={item.href} item={item} />;
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Staking Section */}
      {groupedItems.staking && (
        <div className='space-y-2'>
          <h3 className='px-5 text-xs font-semibold uppercase tracking-wider text-gray-400'>
            {t('staking')}
          </h3>
          {groupedItems.staking.map(item => {
            return <NavigationItem key={item.href} item={item} />;
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Bonds Section */}
      {groupedItems.bonds && (
        <div className='space-y-2'>
          <h3 className='px-5 text-xs font-semibold uppercase tracking-wider text-gray-400'>
            {t('bonds')}
          </h3>
          {groupedItems.bonds.map(item => {
            return <NavigationItem key={item.href} item={item} />;
          })}
        </div>
      )}
      <div className='border-t border-gray-800 mx-5'></div>
      {/* Tools Section */}
      {groupedItems.tools && (
        <div className='space-y-2'>
          <h3 className='px-5 text-xs font-semibold uppercase tracking-wider text-gray-400'>
            {t('tools')}
          </h3>
          {groupedItems.tools.map(item => {
            return <NavigationItem key={item.href} item={item} />;
          })}
        </div>
      )}

      <div className='flex-1'></div>
      {footerItems && (
        <div className='space-y-2'>
          {footerItems.map((item, index) => {
            return (
              <div
                className='flex w-full items-center space-x-3 px-5 py-4 text-base font-medium transition-colors hover:bg-foreground/5 cursor-pointer'
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
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
      {/* Social Links */}
      <div className='py-10'>
        <div className='flex gap-6 px-5'>
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
  return (
    <div className='hidden md:flex px-4 lg:px-9 flex-col'>
      <div className='sidebar w-[260px] min-h-[calc(100vh-128px)]'>
        <nav className='h-full flex flex-col gap-6 pt-6'>
          <SidebarContent />
        </nav>
      </div>
    </div>
  );
};
