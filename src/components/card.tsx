import Image from 'next/image';
import * as React from 'react';

import { cn } from '~/lib/utils';

function Card({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<'div'> & {
  containerClassName?: string;
}) {
  return (
    <div
      data-slot='card'
      className={cn(
        'nine-patch-frame card-body relative w-full',
        containerClassName
      )}
    >
      <div className='absolute top-0 left-0 right-0'>
        <Image
          className='absolute-center-x min-w-[200px] min-h-[9px]'
          src='/images/background/card-indicator.png'
          alt='card-indicator'
          width={200}
          height={9}
        />
      </div>
      <div
        className={cn(
          'text-card-foreground flex flex-col gap-6 p-6 py-9',
          className
        )}
        {...props}
      />
    </div>
  );
}

function CardHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-header'
      className='nine-patch-frame card-header relative -m-6 -mt-9'
      {...props}
    >
      <div className='absolute top-0 left-0 right-0'>
        <Image
          className='absolute-center-x min-w-[200px] min-h-[9px]'
          src='/images/background/card-header-indicator.png'
          alt='card-indicator'
          width={200}
          height={9}
        />
      </div>
      <div className={cn('p-6 pt-9', className)}>{children}</div>
    </div>
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-title'
      className={cn('leading-none font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-action'
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-content'
      className={cn('px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='card-footer'
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
