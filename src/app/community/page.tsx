'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FC } from 'react';
import { Card, View } from '~/components';
import { cn } from '~/lib/utils';
import InviteJoin from './components/InviteJoin';
import InviteRecord from './components/InviteRecord';

const Step: FC<{
  index: number;
  title: string;
  description: string;
  className?: string;
  isHiddenLine?: boolean;
}> = ({ index, title, description, className, isHiddenLine }) => {
  return (
    <div
      className={cn(
        'flex md:flex-col md:py-4 md:my-4 h-full md:gap-2',
        className
      )}
    >
      <div className='flex flex-col md:flex-row md:w-full items-center gap-2'>
        <View
          clipDirection='topLeft-bottomRight'
          border={true}
          clipSize={8}
          borderWidth={2}
          borderColor='#434c8c'
          className='w-9 h-9 flex bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)]'
        >
          <span className='text-[18px] font-bold text-white'>{index + 1}</span>
        </View>
        <div
          className={cn(
            'border-l md:border-t border-dashed border-foreground/50 h-full md:h-auto md:w-full',
            isHiddenLine && 'hidden'
          )}
        ></div>
      </div>
      <div className='p-4 pt-0 md:p-0'>
        <h3 className='text-base font-bold text-white'>{title}</h3>
        <p className='text-sm text-foreground/50'>{description}</p>
      </div>
    </div>
  );
};

export default function CommunityPage() {
  const t = useTranslations('community');
  return (
    <div className='space-y-6 w-full'>
      {/* 协议介绍横幅 */}
      <Card
        className='relative overflow-hidden'
        containerClassName='community-body'
      >
        <div className='flex md:grid grid-cols-3 gap-2 md:gap-6 items-center'>
          <div className='lg:col-span-2'>
            <h1 className='text-lg md:text-5xl font-bold text-white mb-4'>
              {t('protocolTitle')}
            </h1>
            <p className='text-foreground/50 text-xs md:text-sm leading-relaxed'>
              {t('protocolDescription')}
            </p>
          </div>
          <div className='flex justify-center lg:justify-end'>
            <Image
              src='/images/widgets/community-logo.png'
              alt='community'
              className='w-[89px] md:w-[151px] max-w-max'
              width={151}
              height={187}
            />
          </div>
        </div>
      </Card>

      {/* 如何获得社区奖励 */}
      <Card className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 px-4 gap-0 md:gap-6 lg:px-9'>
        <div className='py-6 md:col-span-3 xl:col-span-1 p-0 flex items-center text-xl font-bold xl:border-r xl:border-dashed border-foreground/20'>
          {t('howToGetRewards')}
        </div>
        {/* 步骤1 */}
        <Step
          index={0}
          title={t('step1.title')}
          description={t('step1.description')}
        />
        {/* 步骤2 */}
        <Step
          index={1}
          title={t('step2.title')}
          description={t('step2.description')}
        />

        {/* 步骤3 */}
        <Step
          index={2}
          title={t('step3.title')}
          description={t('step3.description')}
          isHiddenLine
        />
      </Card>

      {/* 推荐计划 */}
      <InviteJoin />

      {/* 推荐列表 */}
      <InviteRecord />
    </div>
  );
}
