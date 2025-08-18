import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '~/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 10, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 border-[2px] border-[#35489B] bg-[#151A3F] backdrop-blur-sm p-4 text-[#E0E0E0] shadow-[inset_0_0_20px_rgba(84,119,247,0.3)] outline-none font-mono text-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative',
        "before:content-[''] before:absolute before:top-[-8px] before:left-1/2 before:transform before:-translate-x-1/2 before:w-0 before:h-0 before:border-l-[8px] before:border-r-[8px] before:border-b-[8px] before:border-l-transparent before:border-r-transparent before:border-b-[#35489B] before:z-10",
        "after:content-[''] after:absolute after:top-[-6px] after:left-1/2 after:transform after:-translate-x-1/2 after:w-0 after:h-0 after:border-l-[6px] after:border-r-[6px] after:border-b-[6px] after:border-l-transparent after:border-r-transparent after:border-b-[#1D2658] after:z-20",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
