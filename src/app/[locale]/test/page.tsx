"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Select 组件测试
        </h1>

        <div className="space-y-4">
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
