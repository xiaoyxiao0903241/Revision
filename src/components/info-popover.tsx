import { AnimatePresence, motion } from 'motion/react';
import { FC, ReactNode, useEffect, useState } from 'react';
import InfoIcon from '~/assets/info.svg';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../components/popover';
import { View } from './view';
export const InfoPopover: FC<{
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  title?: string;
}> = ({ children, className, title, triggerClassName }) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // 监听屏幕宽度
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            <motion.div
              className='fixed top-0 right-0 bottom-0 left-0 z-50 bg-black/50'
              onClick={() => setOpen(false)}
            >
              <div
                className={cn(
                  'fixed left-4 bottom-0 right-4 z-50 p-4',
                  className
                )}
              >
                <View
                  clipDirection='topLeft-bottomRight'
                  containerClassName='backdrop-blur-sm'
                  className='relative shadow-[inset_0_0_10px_rgba(84,119,247,0.3)] p-4 bg-[#171837]/80 backdrop-blur-sm'
                >
                  {title ? (
                    <div className='flex items-center'>
                      <span className='text-white text-base font-semibold'>
                        {title}
                      </span>
                      <span onClick={() => setOpen(false)}>X</span>
                    </div>
                  ) : null}
                  {children}
                </View>
              </div>
            </motion.div>
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
