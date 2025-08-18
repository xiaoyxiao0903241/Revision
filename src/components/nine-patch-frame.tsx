import { cn } from '~/lib/utils';
import { ReactNode } from 'react';

interface NinePatchFrameProps {
  children: ReactNode;
  className?: string;
  withHeader?: boolean;
}

export function NinePatchFrame({ children, className }: NinePatchFrameProps) {
  return (
    <div className={cn('nine-patch-frame', className)}>
      <div>{children}</div>
    </div>
  );
}
