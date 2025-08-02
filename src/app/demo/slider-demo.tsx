"use client"

import { useState } from "react"
import { Slider } from "~/components/slider"

export default function SliderDemo() {
  const [value1, setValue1] = useState<number[]>([0.2])
  const [value2, setValue2] = useState<number[]>([0.5])
  const [value3, setValue3] = useState<number[]>([0.8])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Slider 组件测试</h1>

        {/* 基础 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">基础 Slider</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Slider
              value={value1}
              onValueChange={setValue1}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="mt-4 text-sm text-gray-300">
              当前值: {(value1[0] * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* 带指示器的 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            带指示器的 Slider
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Slider
              indicators={[0.1, 0.3, 0.5, 0.7]}
              value={value2}
              onValueChange={setValue2}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="mt-4 text-sm text-gray-300">
              当前值: {(value2[0] * 100).toFixed(0)}%
            </div>
            <div className="mt-2 text-xs text-gray-400">
              指示器位置: 10%, 30%, 50%, 70%
            </div>
          </div>
        </div>

        {/* 更多指示器的 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            密集指示器 Slider
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <Slider
              indicators={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]}
              value={value3}
              onValueChange={setValue3}
              max={1}
              step={0.01}
              className="w-full"
            />
            <div className="mt-4 text-sm text-gray-300">
              当前值: {(value3[0] * 100).toFixed(0)}%
            </div>
            <div className="mt-2 text-xs text-gray-400">
              指示器位置: 10%, 20%, 30%, 40%, 50%, 60%, 70%, 80%, 90%
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">功能说明</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              • <span className="text-white">白色圆点</span>：thumb 已通过的位置
            </li>
            <li>
              • <span className="text-gray-400">灰色圆点</span>：thumb
              未通过的位置
            </li>
            <li>
              • 指示器位置通过{" "}
              <code className="bg-gray-700 px-1 rounded">indicators</code>{" "}
              属性传入
            </li>
            <li>• 值范围：0-1，对应 0%-100%</li>
            <li>• 支持实时更新指示器颜色</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
