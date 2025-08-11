import { FC, ReactNode } from 'react';
import { Icon, InfoPopover } from '~/components';
import { cn } from '~/lib/utils';

export const RateCard: FC<{
  children?: ReactNode;
  description: string;
  isLoading?: boolean;
  value: boolean;
  onRefresh: () => void;
  onTogleSlippage: (value: boolean) => void;
}> = ({
  children,
  description,
  isLoading,
  onRefresh,
  onTogleSlippage,
  value,
}) => {
  return (
    <div>
      <div className='flex items-center justify-between'>
        <span className='text-sm'>{description}</span>
        <div className='flex gap-6 items-center'>
          {children ? (
            <InfoPopover triggerClassName='w-4 h-4 text-warning'>
              {children}
            </InfoPopover>
          ) : null}
          <div
            className={cn('cursor-pointer', { 'animate-spin': isLoading })}
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
