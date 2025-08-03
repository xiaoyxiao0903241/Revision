"use client"

import React, { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Icon } from "./icon"
import { cn } from "~/lib/utils"

interface StatisticsProps {
  title: string
  value: string
  desc?: string
  info?: string
  className?: string
}

export const Statistics: React.FC<StatisticsProps> = ({
  title,
  value,
  desc,
  info,
  className = "",
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <div className={`flex flex-col`}>
      {/* Title Row */}
      <div className="flex items-center justify-between text-foreground/70">
        <span className={cn("text-xs", className)}>{title}</span>
        {info && (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "text-gray-400 hover:text-gray-300 transition-colors",
                  className
                )}
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              >
                <Icon name="documents" className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-4 bg-gray-800 border border-gray-700 text-gray-200"
              side="top"
              align="end"
            >
              <div className="text-sm leading-relaxed">{info}</div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Value Row */}
      <div className="flex items-center space-x-2">
        <span className="text-white font-mono text-3xl">{value}</span>
      </div>

      {/* Description Row */}
      {desc && <div className="text-foreground/50 text-xs">{desc}</div>}
    </div>
  )
}

/*
使用示例：

import { Statistics } from "./statistics"

// 基本用法
<Statistics 
  title="Rebase Rewards" 
  value="0.00 OLY" 
  desc="$0.00" 
/>

// 带信息弹窗的用法
<Statistics 
  title="Rebase Rewards" 
  value="0.00 OLY" 
  desc="$0.00" 
  info="Rebase rewards are distributed automatically to stakers based on their staking amount and duration."
/>

// 只有标题和数值
<Statistics 
  title="Total Staked" 
  value="1,234.56 OLY" 
/>
*/
