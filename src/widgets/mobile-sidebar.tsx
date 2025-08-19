import { AnimatePresence, motion } from 'motion/react';
import { useEffect } from 'react';
import { cn } from '~/lib/utils';
import { SidebarContent } from './sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  // 阻止背景滚动和键盘事件
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* 遮罩层 */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/90 z-40 lg:hidden p-4 pt-20 backdrop-blur-sm'
              onClick={onClose}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.2 }}
                className={cn(
                  'w-full z-40 transform sidebar h-[calc(100vh-96px)] flex-1 md:hidden'
                )}
              >
                <nav className='space-y-6 h-full w-[calc(100vw-32px)] py-4'>
                  <div className='h-full w-full overflow-y-auto space-y-4'>
                    <SidebarContent />
                  </div>
                </nav>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
