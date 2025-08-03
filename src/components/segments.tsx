"use client"

import { AnimatePresence, motion } from "motion/react"
import React, { useEffect, useRef, useState } from "react"
import { cn } from "~/lib/utils"
import { View } from "./view"

interface SegmentOption {
  value: string
  label: string
}

interface SegmentsProps {
  options: SegmentOption[]
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function Segments({
  options,
  value,
  onChange,
  disabled = false,
}: SegmentsProps) {
  const [selectedValue, setSelectedValue] = useState(value || options[0]?.value)
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left?: number
    width?: number
    height?: number
  }>({})
  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 更新选中值
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  // 计算指示器位置和尺寸
  useEffect(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue
    )
    if (
      selectedIndex === -1 ||
      !containerRef.current ||
      !optionRefs.current[selectedIndex]
    ) {
      return
    }

    const container = containerRef.current
    const selectedOption = optionRefs.current[selectedIndex]
    const containerRect = container.getBoundingClientRect()
    const optionRect = selectedOption.getBoundingClientRect()

    setIndicatorStyle({
      left: optionRect.left - containerRect.left,
      width: optionRect.width,
      height: optionRect.height,
    })
  }, [selectedValue, options])

  const handleOptionClick = (optionValue: string) => {
    if (disabled) return

    setSelectedValue(optionValue)
    onChange?.(optionValue)
  }

  return (
    <View
      clipDirection="topRight-bottomLeft"
      clipSize={12}
      className="bg-[#22285E] h-12 p-[3px]"
    >
      <div
        className="w-full h-full flex relative flex-row gap-2"
        ref={containerRef}
      >
        {/* 滑动指示器 */}
        <AnimatePresence>
          <motion.div
            className={cn(
              "absolute transition-all duration-300 ease-out h-full"
            )}
            style={indicatorStyle}
            animate={{
              opacity: 1,
              scale: 1,
              width: indicatorStyle.width,
              left: indicatorStyle.left,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
          >
            <View
              clipDirection="topRight-bottomLeft"
              className="bg-[#576AF4]/40 w-full h-full"
              clipSize={12}
            >
              <span />
            </View>
          </motion.div>
        </AnimatePresence>

        {/* 选项按钮 */}
        {options.map((option, index) => (
          <button
            key={option.value}
            ref={(el) => {
              optionRefs.current[index] = el
            }}
            className="flex-1 p-4 z-10 flex items-center justify-center"
            onClick={() => handleOptionClick(option.value)}
            disabled={disabled}
          >
            <span
              className={cn(
                "whitespace-nowrap transition-all duration-300 text-foreground/70",
                selectedValue === option.value && "text-white"
              )}
            >
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </View>
  )
}
