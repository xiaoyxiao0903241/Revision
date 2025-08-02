"use client"

import { Button } from "~/components/button"
import { OptionItem, OptionList, OneIcon } from "~/components/option-item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">组件测试页面</h1>

        {/* Select 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Select 组件测试</h2>
          <div className="w-64">
            <Select>
              <SelectTrigger className="nine-patch-frame select-trigger">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <SelectValue placeholder="选择时间" />
                </div>
              </SelectTrigger>
              <SelectContent className="nine-patch-frame select-dropdown">
                <SelectItem value="7" className="flex justify-between">
                  <span>天</span>
                  <span className="bg-white/10 px-2 py-1 rounded">x1</span>
                </SelectItem>
                <SelectItem value="30" className="flex justify-between">
                  <span>天</span>
                  <span className="bg-white/10 px-2 py-1 rounded">x4</span>
                </SelectItem>
                <SelectItem value="90" className="flex justify-between">
                  <span>天</span>
                  <span className="bg-white/10 px-2 py-1 rounded">x12</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* OptionItem 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            OptionItem 组件测试
          </h2>
          <div className="w-96">
            <OptionList>
              <OptionItem
                isSelected={true}
                onClick={() => console.log("7 Days selected")}
              >
                <div className="flex items-center gap-3">
                  <OneIcon />
                  <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                    2.01 OLY
                  </span>
                </div>
                <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                  7 Days
                </span>
              </OptionItem>
              <OptionItem
                isSelected={false}
                onClick={() => console.log("30 Days selected")}
              >
                <div className="flex items-center gap-3">
                  <OneIcon />
                  <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                    2.01 OLY
                  </span>
                </div>
                <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                  30 Days
                </span>
              </OptionItem>
              <OptionItem
                isSelected={false}
                onClick={() => console.log("90 Days selected")}
              >
                <div className="flex items-center gap-3">
                  <OneIcon />
                  <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                    2.01 OLY
                  </span>
                </div>
                <span className="text-white font-mono font-bold text-sm uppercase tracking-wide">
                  90 Days
                </span>
              </OptionItem>
            </OptionList>
          </div>
        </div>

        {/* Button 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Button 组件测试</h2>

          <div className="space-y-6">
            {/* 基础按钮 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">基础按钮</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outlined">Outlined</Button>
                <Button variant="gradient">Gradient</Button>
              </div>
            </div>

            {/* 斜切按钮 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">斜切按钮</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-white/80 mb-2">
                    左上-右下斜切
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="primary"
                      clipDirection="topLeft-bottomRight"
                      clipSize={8}
                    >
                      Small Clip
                    </Button>
                    <Button
                      variant="gradient"
                      clipDirection="topLeft-bottomRight"
                      clipSize={12}
                    >
                      Medium Clip
                    </Button>
                    <Button
                      variant="secondary"
                      clipDirection="topLeft-bottomRight"
                      clipSize={16}
                    >
                      Large Clip
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-white/80 mb-2">
                    右上-左下斜切
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="primary"
                      clipDirection="topRight-bottomLeft"
                      clipSize={8}
                    >
                      Small Clip
                    </Button>
                    <Button
                      variant="gradient"
                      clipDirection="topRight-bottomLeft"
                      clipSize={12}
                    >
                      Medium Clip
                    </Button>
                    <Button
                      variant="secondary"
                      clipDirection="topRight-bottomLeft"
                      clipSize={16}
                    >
                      Large Clip
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 不同尺寸 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">不同尺寸</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
