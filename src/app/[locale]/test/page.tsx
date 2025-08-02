"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"
import { Button } from "~/components/button"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          组件测试页面
        </h1>

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

        {/* Select 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Select 组件测试</h2>
          <label className="block text-white text-sm font-medium">
            选择质押期限
          </label>

          <Select defaultValue="30">
            <SelectTrigger>
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span>30天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    1.5x
                  </span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">
                <div className="flex items-center gap-2">
                  <span>7天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    1.0x
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="30">
                <div className="flex items-center gap-2">
                  <span>30天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    1.5x
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="90">
                <div className="flex items-center gap-2">
                  <span>90天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    2.0x
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="180">
                <div className="flex items-center gap-2">
                  <span>180天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    2.5x
                  </span>
                </div>
              </SelectItem>
              <SelectItem value="365">
                <div className="flex items-center gap-2">
                  <span>365天</span>
                  <span className="bg-white/10 px-2 py-1 rounded text-xs">
                    3.0x
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-white text-sm text-center mt-8">
          <div className="flex justify-between items-center">
            <span>距离下次重新基准还有</span>
            <span className="font-mono">3M 59M 46S</span>
          </div>
        </div>
      </div>
    </div>
  )
}
