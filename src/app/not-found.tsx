'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function LocaleNotFound() {
  const t = useTranslations('notFound');

  return (
    <div className='w-full' style={{ height: 'calc(100vh - 128px)' }}>
      <div className='w-full h-full nine-patch-frame card-body relative'>
        <div className='absolute top-0 left-0 right-0'>
          <Image
            className='absolute-center-x min-w-[200px] min-h-[9px]'
            src='/images/background/card-indicator.png'
            alt='card-indicator'
            width={200}
            height={9}
          />
        </div>
        <div className='absolute inset-0 flex flex-col justify-center items-center'>
          <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <Image
              src='/images/widgets/404.png'
              alt='404'
              width={300}
              height={300}
            />
          </div>
          <div className='flex flex-col items-center justify-center space-y-2 mt-[140px]'>
            <div className='text-sm font-bold text-foreground/90'>
              {t('comingSoon')}
            </div>
            <div className='text-5xl font-bold text-gradient'>{t('title')}</div>
            <div className='text-foreground/50 text-xs'>
              {t('description', {
                default: '抱歉，您访问的页面不存在或已被移动。',
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
