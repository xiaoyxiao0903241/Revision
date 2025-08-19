'use client';

import { Portal } from '@radix-ui/react-portal';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import Close from '~/assets/close.svg';
import { useResponsive } from '~/hooks/useResponsive';
import { cn } from '~/lib/utils';
import { View } from './view';

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  contentClassName?: string;
  title?: string;
}

export function ResponsiveDialog({
  children,
  showCloseButton = true,
  contentClassName,
  title,
  open,
  onOpenChange,
}: ResponsiveDialogProps) {
  const { isMobile } = useResponsive();

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          {/* 遮罩层包含所有内容 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
              !isMobile && 'flex items-center justify-center' // PC 端使用 flex 布局居中
            )}
            onClick={() => onOpenChange(false)}
          >
            {/* 内容容器 */}
            <motion.div
              initial={
                isMobile ? { y: 100, opacity: 0 } : { scale: 0.65, opacity: 0 }
              }
              animate={
                isMobile ? { y: 0, opacity: 1 } : { scale: 1, opacity: 1 }
              }
              exit={
                isMobile ? { y: 100, opacity: 0 } : { scale: 0.65, opacity: 0 }
              }
              onClick={e => e.stopPropagation()}
              className={cn(
                isMobile
                  ? 'fixed left-1 bottom-4 right-1' // 移动端：底部弹出
                  : 'w-[412px]', // 桌面端：由父级 flex 布局实现居中
                contentClassName
              )}
            >
              <View
                clipDirection='topLeft-bottomRight'
                containerClassName='backdrop-blur-sm'
                className='relative shadow-[inset_0_0_10px_rgba(84,119,247,0.3)] p-4 bg-[#171837]/80 backdrop-blur-sm'
              >
                {(title || showCloseButton) && (
                  <div className='flex items-center w-full justify-between mb-4'>
                    {title && (
                      <span className='text-white text-base font-semibold'>
                        {title}
                      </span>
                    )}
                    {showCloseButton && (
                      <div
                        className='p-2 cursor-pointer ml-auto group'
                        onClick={e => {
                          e.stopPropagation();
                          onOpenChange(false);
                        }}
                      >
                        <Close className='w-4 h-4 text-white/70 transition-opacity group-hover:opacity-100' />
                      </div>
                    )}
                  </div>
                )}
                {children}
              </View>
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
}
