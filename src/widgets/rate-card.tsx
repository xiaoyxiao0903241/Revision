import { FC, ReactNode } from 'react';
import { Icon, InfoPopover } from '~/components';
import { cn } from '~/lib/utils';
import Image from 'next/image';
export const RateCard: FC<{
  children?: ReactNode;
  description: string;
  isLoading?: boolean;
  value: boolean;
  onRefresh: () => void;
  onTogleSlippage: (value: boolean) => void;
  onTogChange: (value: boolean) => void;
  isChange?: boolean;
  type: string;
}> = ({
  children,
  description,
  isLoading,
  onRefresh,
  onTogleSlippage,
  value,
  onTogChange,
  isChange,
  type = 'swap',
}) => {
  return (
    <div>
      <div className='flex items-center justify-between cursor-pointer'>
        <div className='flex items-center'>
          <span className='text-sm mr-4'>{description}</span>
          {type === 'swap' && (
            <Image
              alt=''
              src='/images/icon/change.png'
              width={16}
              height={16}
              className='cursor-pointer'
              onClick={() => {
                onTogChange(!isChange);
              }}
            ></Image>
          )}
        </div>
        <div className='flex gap-6 items-center'>
          {children ? (
            <InfoPopover triggerClassName='w-4 h-4 text-warning'>
              {children}
            </InfoPopover>
          ) : null}
          <div
            className={cn('cursor-pointer', {
              'animate-spin': isLoading && type === 'swap',
            })}
            onClick={onRefresh}
          >
            <Icon name='refresh' className={'w-5 h-5 pointer-events-none'} />
          </div>
          <div
            onClick={() => {
              onTogleSlippage(!value);
            }}
          >
            <Icon name='setting' className='w-5 h-5 !cursor-pointer' />
          </div>
        </div>
      </div>
    </div>
  );
};
