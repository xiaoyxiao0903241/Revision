import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, motion } from 'motion/react';
import { FC, ReactNode, useState } from 'react';
import Close from '~/assets/close.svg';
import InfoIcon from '~/assets/info.svg';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { useResponsive } from '../hooks/useResponsive';
import { View } from './view';
export const InfoPopover: FC<{
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  title?: string;
}> = ({ children, className, title, triggerClassName }) => {
  const [open, setOpen] = useState(false);
  const { isMobile } = useResponsive();

  // 小屏用自定义底部弹窗
  if (isMobile) {
    return (
      <>
        <InfoIcon
          className={cn(
            'text-foreground/50 w-3 h-3 cursor-pointer',
            triggerClassName
          )}
          onClick={() => setOpen(true)}
        />
        <AnimatePresence>
          {open && (
            <Portal>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='fixed top-0 right-0 bottom-0 left-0 z-50 bg-black/50'
                onClick={() => setOpen(false)}
              />
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={cn('fixed left-1 bottom-4 right-1 z-50', className)}
              >
                <View
                  clipDirection='topLeft-bottomRight'
                  containerClassName='backdrop-blur-sm'
                  className='relative shadow-[inset_0_0_10px_rgba(84,119,247,0.3)] p-4 bg-[#171837]/80 backdrop-blur-sm'
                >
                  {title ? (
                    <div className='flex items-center w-full justify-between'>
                      <span className='text-white text-base font-semibold'>
                        {title}
                      </span>
                      <div
                        className='p-2 cursor-pointer'
                        onClick={() => setOpen(false)}
                      >
                        <Close className='w-4 h-4 text-white' />
                      </div>
                    </div>
                  ) : null}
                  {children}
                </View>
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
      </>
    );
  }

  // 大屏用 Popover
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
