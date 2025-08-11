'use client';

import React from 'react';
import { cn } from '~/lib/utils';
import { InfoPopover } from './info-popover';

interface StatisticsProps {
  title: string;
  value: string | number;
  desc?: string;
  info?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Statistics: React.FC<StatisticsProps> = ({
  title,
  value,
  desc,
  info,
  className = '',
  size,
}) => {
  return (
    <div className={`flex flex-col`}>
      {/* Title Row */}
      <div className='flex items-center gap-1 text-foreground/70'>
        <span className={cn('text-xs', className)}>{title}</span>
        {info && <InfoPopover>{info}</InfoPopover>}
      </div>

      {/* Value Row */}
      <div className='flex items-center space-x-2'>
        <span
          className={cn(
            'text-white font-mono text-xl md:text-3xl',
            size === 'sm' && 'text-base md:text-lg',
            size === 'md' && 'text-lg md:text-2xl'
          )}
        >
          {value}
        </span>
      </div>

      {/* Description Row */}
      {desc && <div className='text-foreground/50 text-xs'>{desc}</div>}
    </div>
  );
};
