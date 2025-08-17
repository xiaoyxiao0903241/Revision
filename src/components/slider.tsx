import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';
import { useState, useEffect } from 'react';

import { cn } from '~/lib/utils';

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  indicators?: Array<{ value: number; label: string } | number>; // 支持对象格式或数字格式
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, indicators = [], defaultValue, value, ...props }, ref) => {
  // 使用传入的 defaultValue 或 value 作为初始状态
  const [internalValue, setInternalValue] = useState<number[]>(
    value || defaultValue || [0]
  );

  // 当外部 value 改变时，更新内部状态
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue);
    props.onValueChange?.(newValue);
  };

  // 处理指示器格式，支持数字和对象两种格式
  const processedIndicators = indicators.map(indicator => {
    if (typeof indicator === 'number') {
      return { value: indicator, label: `${(indicator * 100).toFixed(0)}%` };
    }
    return indicator;
  });

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative flex w-full touch-none select-none items-center pb-4',
        className
      )}
      value={internalValue}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track
        className='relative h-1 w-full grow rounded-full bg-[#868686]'
        style={{ paddingLeft: '11px', paddingRight: '11px' }}
      >
        <SliderPrimitive.Range className='absolute h-full rounded-full gradient' />
        <div className='absolute top-0 left-[11px] right-[11px]'>
          {/* 指示器 */}
          {processedIndicators.map((indicator, index) => {
            const min = props.min || 0;
            const max = props.max || 1;
            const isActive = internalValue[0] >= indicator.value;
            // 根据传入的数值、min 和 max 属性计算百分比位置
            const normalizedValue = (indicator.value - min) / (max - min);
            const position = normalizedValue * 100;

            return (
              <div
                key={index}
                className='absolute top-0 flex flex-col items-center gap-4'
                style={{
                  left: `${position}%`,
                  transform: 'translateX(-50%)',
                  pointerEvents: 'none', // 防止指示器干扰 slider 交互
                }}
              >
                {/* 指示器圆点 */}
                <div
                  className={cn(
                    'w-[2px] h-[2px] rounded-full mt-[1px]',
                    isActive ? 'bg-white' : 'bg-gray-600'
                  )}
                />
                {/* 标签 */}
                <div
                  className={cn(
                    'text-xs whitespace-nowrap',
                    isActive ? 'text-white' : 'text-gray-400'
                  )}
                >
                  {indicator.label}
                </div>
              </div>
            );
          })}
        </div>
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="block h-7 w-[22px] cursor-pointer bg-[url('/images/background/slider-thumb.png')] bg-contain bg-center border-none outline-none" />
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
