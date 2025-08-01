"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"
import { Icon } from "~/components"

export default function TestPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          组件测试页面
        </h1>
        <Icon name="analytics" className="gradient-text" />
        <Icon name="analytics" className="text-red-400" />
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

        {/* IconFont 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            IconFont 组件测试
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <Icon name="analytics" size={24} className="text-white mb-2" />
              <span className="text-xs text-white/70">analytics</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <Icon name="community" size={24} className="text-white mb-2" />
              <span className="text-xs text-white/70">community</span>
            </div>

            <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg">
              <Icon name="Frame" size={24} className="text-white mb-2" />
              <span className="text-xs text-white/70">Frame</span>
            </div>
          </div>
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
