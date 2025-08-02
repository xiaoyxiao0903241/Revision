"use client"

import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { useState } from "react"

import { cn } from "~/lib/utils"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  indicators?: Array<{ value: number; label: string }> // 指示器数组，value 范围 0-1
  indicatorPadding?: number // 指示器左右两侧的 padding 宽度（百分比，0-50）
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, indicators = [], indicatorPadding = 0, ...props }, ref) => {
  const [value, setValue] = useState<number[]>([0])

  const handleValueChange = (newValue: number[]) => {
    setValue(newValue)
    props.onValueChange?.(newValue)
  }

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center pb-2",
        className
      )}
      value={value}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow rounded-full bg-[#868686]">
        <SliderPrimitive.Range className="absolute h-full gradient" />

        {/* 指示器 */}
        {indicators.map((indicator, index) => {
          const isActive = value[0] >= indicator.value
          // 计算考虑 padding 后的位置
          // 将 0-1 的值映射到 padding 到 (100-padding) 的范围
          const availableWidth = 100 - indicatorPadding * 2
          const adjustedPosition =
            indicatorPadding + indicator.value * availableWidth

          return (
            <div
              key={index}
              className="absolute top-0 flex flex-col items-center gap-2"
              style={{
                left: `${adjustedPosition}%`,
                transform: "translateX(-50%)",
              }}
            >
              {/* 指示器圆点 */}
              <div
                className={cn(
                  "w-[2px] h-[2px] rounded-full mt-[1px]",
                  isActive ? "bg-white" : "bg-gray-600"
                )}
              />
              {/* 标签 */}
              <div
                className={cn(
                  "text-xs whitespace-nowrap",
                  isActive ? "text-white" : "text-gray-400"
                )}
              >
                {indicator.label}
              </div>
            </div>
          )
        })}
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="block h-7 w-[22px] cursor-pointer bg-[url('/images/background/slider-thumb.png')] bg-contain bg-center border-none outline-none" />
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
