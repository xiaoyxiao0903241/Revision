// import { useLocale } from "next-intl";
import { Icon } from '~/components';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/dropdown-menu';
import { locales } from '~/i18n/config';
import { LANGUAGES } from '../../public/locales/constsnts';
// import { usePathname, useRouter } from "next/navigation";
import * as Flags from 'country-flag-icons/react/1x1';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '~/i18n/LanguageProvider';
import {
  getInitialLocale,
  setLocale as setCookieLanguage,
} from '~/i18n/client';
import { cn } from '~/lib/utils';

const useLanguages = () => {
  const { locale, changeLanguage } = useLanguage();
  // const router = useRouter();
  // const pathname = usePathname();
  // const handleLanguageChange = (newLocale: string) => {
  //   console.log("newLocale", newLocale);
  //   // 构造新的路径来切换语言
  //   const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
  //   router.replace(newPath);
  // };

  const handleLanguageChange = useCallback(
    async (lang: string) => {
      console.log('lang', lang);
      console.log('locale', locale);
      // if (lang === locale) return;
      setCookieLanguage(lang as (typeof locales)[number]);
      await changeLanguage(lang);
    },
    [locale, changeLanguage]
  );

  useEffect(() => {
    const locale = getInitialLocale();
    if (locale) {
      handleLanguageChange(locale);
    }
  }, [handleLanguageChange]);
  return {
    locale,
    changeLanguage: handleLanguageChange,
  };
};

export const LanguageSwitcher = () => {
  const { locale, changeLanguage } = useLanguages();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='hidden md:flex items-center gap-2 cursor-pointer'>
          <Icon
            name='sphere'
            size={32}
            className='text-foreground pointer-events-none'
          />
          <Icon
            name='arrow'
            size={20}
            className='text-foreground/50 pointer-events-none'
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        containerClassName='ml-3 md:ml-0'
        className='w-[calc(100dvw-24px)] md:w-48 z-50 h-[calc(100dvh-80px)] overflow-y-auto md:h-auto'
      >
        {LANGUAGES.map(language => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={cn(
              'flex items-center gap-2 h-16 md:h-14 text-lg md:text-base',
              locale === language.code ? 'text-foreground' : ''
            )}
          >
            {(() => {
              const Flag = Flags[language.flag as keyof typeof Flags];
              return Flag ? (
                <Flag
                  title={language.name}
                  className='shadow'
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 16,
                    objectFit: 'cover',
                  }}
                />
              ) : null;
            })()}
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const LanguageSwitcherMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, changeLanguage } = useLanguages();
  return (
    <>
      <div
        className='flex md:hidden items-center gap-2 cursor-pointer'
        onClick={e => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Icon
          name='sphere'
          size={32}
          className='text-foreground pointer-events-none'
        />
        <Icon
          name='arrow'
          size={20}
          className='text-foreground/50 pointer-events-none'
        />
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/90 z-40 lg:hidden p-4 pt-20 '
              onClick={e => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'tween', duration: 0.15 }}
                className={cn(
                  'w-full z-40 transform sidebar h-[calc(100vh-96px)] flex-1 md:hidden'
                )}
              >
                <div className='w-full h-full flex flex-col -ml-24 gap-2 overflow-y-auto'>
                  {LANGUAGES.map(language => (
                    <div
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={cn(
                        'flex items-center justify-start gap-2 min-h-14 text-lg w-full',
                        locale === language.code ? 'text-foreground' : ''
                      )}
                    >
                      {(() => {
                        const Flag = Flags[language.flag as keyof typeof Flags];
                        return Flag ? (
                          <Flag
                            title={language.name}
                            className='shadow'
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 16,
                              objectFit: 'cover',
                            }}
                          />
                        ) : null;
                      })()}
                      {language.name}
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
