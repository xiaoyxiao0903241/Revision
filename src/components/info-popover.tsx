import { FC, ReactNode, useState } from 'react';
import InfoIcon from '~/assets/info.svg';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
export const InfoPopover: FC<{
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
}> = ({ children, className, triggerClassName }) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InfoIcon
          className={cn(
            'text-foreground/50 w-3 h-3 cursor-pointer',
            triggerClassName
          )}
        />
      </PopoverTrigger>
      <PopoverContent className={cn('w-52', className)}>
        {children}
      </PopoverContent>
    </Popover>
  );
};
