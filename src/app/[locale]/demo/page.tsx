"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/popover"
import { Button } from "~/components/button"

export default function PopoverDemo() {
  const [open, setOpen] = useState(false)

  const stakingData = [
    { days: 30, oly: 0.0 },
    { days: 90, oly: 0.0 },
    { days: 180, oly: 0.0 },
    { days: 360, oly: 0.0 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Popover 组件演示
        </h1>

        <div className="flex flex-col items-center justify-center space-y-8">
          {/* 基础 Popover 示例 */}
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold text-blue-300">
              质押奖励计算器
            </h2>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outlined"
                  className="bg-[#1A1A2E] border-[#00B4FF] text-[#00B4FF] hover:bg-[#2A2A3E] hover:border-[#00B4FF] hover:text-[#00B4FF] font-mono"
                >
                  查看质押奖励
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#00B4FF] font-mono mb-4">
                    质押期限奖励
                  </h3>
                  {stakingData.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-[#2A2A3E] last:border-b-0"
                    >
                      <span className="text-[#E0E0E0] font-mono">
                        {item.days}Days
                      </span>
                      <span className="text-[#00B4FF] font-mono font-semibold">
                        {item.oly.toFixed(2)} OLY
                      </span>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 不同位置的 Popover 示例 */}
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="text-center">
              <h3 className="mb-4 text-xl font-semibold text-blue-300">
                右侧显示
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outlined"
                    className="bg-[#1A1A2E] border-[#00B4FF] text-[#00B4FF] hover:bg-[#2A2A3E] font-mono"
                  >
                    右侧 Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="right" className="w-64 p-4">
                  <div className="space-y-2">
                    <h4 className="text-[#00B4FF] font-mono font-semibold">
                      右侧内容
                    </h4>
                    <p className="text-[#E0E0E0] font-mono text-sm">
                      这是一个显示在右侧的 popover 示例
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="text-center">
              <h3 className="mb-4 text-xl font-semibold text-blue-300">
                左侧显示
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outlined"
                    className="bg-[#1A1A2E] border-[#00B4FF] text-[#00B4FF] hover:bg-[#2A2A3E] font-mono"
                  >
                    左侧 Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="left" className="w-64 p-4">
                  <div className="space-y-2">
                    <h4 className="text-[#00B4FF] font-mono font-semibold">
                      左侧内容
                    </h4>
                    <p className="text-[#E0E0E0] font-mono text-sm">
                      这是一个显示在左侧的 popover 示例
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 自定义内容示例 */}
          <div className="text-center mt-12">
            <h3 className="mb-4 text-xl font-semibold text-blue-300">
              自定义内容
            </h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outlined"
                  className="bg-[#1A1A2E] border-[#00B4FF] text-[#00B4FF] hover:bg-[#2A2A3E] font-mono"
                >
                  显示详细信息
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-6">
                <div className="space-y-4">
                  <h4 className="text-[#00B4FF] font-mono font-semibold text-lg">
                    项目统计信息
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#2A2A3E] p-3 rounded border border-[#00B4FF]/30">
                      <div className="text-[#E0E0E0] font-mono text-sm">
                        总用户数
                      </div>
                      <div className="text-[#00B4FF] font-mono font-semibold text-lg">
                        12,345
                      </div>
                    </div>
                    <div className="bg-[#2A2A3E] p-3 rounded border border-[#00B4FF]/30">
                      <div className="text-[#E0E0E0] font-mono text-sm">
                        总交易量
                      </div>
                      <div className="text-[#00B4FF] font-mono font-semibold text-lg">
                        $1.2M
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#2A2A3E]">
                    <p className="text-[#E0E0E0] font-mono text-sm">
                      实时数据更新，每 30 秒刷新一次
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
