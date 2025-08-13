'use client';
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

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className='fixed inset-0 bg-black/90 z-40 lg:hidden p-4 pt-20'
        onClick={onClose}
      >
        {/* 侧边栏 */}
        <div
          className={cn(
            'w-full z-50 transform sidebar h-[calc(100vh-96px)] flex-1 md:hidden',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className='space-y-6 h-full w-[calc(100vw-32px)] py-4'>
            <div className='h-full w-full overflow-y-auto space-y-4'>
              <SidebarContent />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
