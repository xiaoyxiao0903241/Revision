import * as SelectPrimitive from '@radix-ui/react-select';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';

import { useResponsive } from '~/hooks/useResponsive';
import { cn } from '~/lib/utils';
import { View } from './view';

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot='select' {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot='select-group' {...props} />;
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot='select-value'
      className={cn('text-foreground/70', className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      asChild
      {...props}
    >
      <View
        className={cn(
          'w-full focus:outline-none cursor-pointer',
          'bg-[#22285E] h-12 px-4 flex items-center text-foreground/70 justify-between gap-3 text-sm whitespace-nowrap',
          className
        )}
        clipDirection='topRight-bottomLeft'
        clipSize={12}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className='size-4 text-white transition-transform duration-200 group-data-[state=open]:rotate-180' />
        </SelectPrimitive.Icon>
      </View>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot='select-content'
          className={cn(
            'fixed inset-x-0 bottom-0 z-[100] outline-none',
            className
          )}
          position='item-aligned'
          side='bottom'
          sideOffset={0}
          avoidCollisions={false}
          {...props}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              const event = new Event('keydown');
              Object.defineProperty(event, 'keyCode', { value: 27 });
              Object.defineProperty(event, 'key', { value: 'Escape' });
              document.dispatchEvent(event);
            }}
          />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className='fixed left-1 bottom-4 right-1 z-50'
          >
            <View
              clipDirection='topLeft-bottomRight'
              containerClassName='backdrop-blur-sm'
              className='relative shadow-[inset_0_0_10px_rgba(84,119,247,0.3)] bg-[#171837]/80 backdrop-blur-sm'
            >
              <SelectPrimitive.Viewport className='py-4 max-h-[min(80vh,400px)] overflow-y-auto px-4'>
                {children}
              </SelectPrimitive.Viewport>
            </View>
          </motion.div>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-60 min-w-[8rem] origin-top focus:outline-none',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <View
          className='bg-[#151A3F] overflow-hidden'
          clipDirection='topRight-bottomLeft'
          border={true}
          borderColor='#262a60'
          borderWidth={2}
        >
          <SelectPrimitive.Viewport
            className={cn(
              'py-4',
              position === 'popper' &&
                'w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </View>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('px-3 py-2 text-sm font-semibold text-white', className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        'relative flex w-full h-12 cursor-pointer select-none items-center px-3 py-2 text-sm hover:bg-[#333A74] outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=checked]:text-white',
        className
      )}
      {...props}
    >
      {typeof children === 'string' ? (
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      ) : (
        children
      )}
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-white hover:bg-blue-800 transition-colors outline-none',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className='size-4' />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn(
        'flex cursor-default items-center justify-center py-1 text-white hover:bg-blue-800 transition-colors outline-none',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className='size-4' />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
