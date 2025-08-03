"use client"

import React, { useState } from "react"
import { Segments } from "~/components/segments"
import { Button } from "~/components/button"
import { Card } from "~/components/card"
import {
  Home,
  User,
  Settings,
  Bell,
  Heart,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

const segmentOptions = [
  { value: "home", label: "首页", icon: <Home /> },
  { value: "profile", label: "个人", icon: <User /> },
  { value: "settings", label: "设置", icon: <Settings /> },
]

const iconOptions = [
  { value: "notifications", label: "通知", icon: <Bell /> },
  { value: "favorites", label: "收藏", icon: <Heart /> },
  { value: "starred", label: "星标", icon: <Star /> },
]

const chartOptions = [
  { value: "trending", label: "趋势", icon: <TrendingUp /> },
  { value: "bar", label: "柱状图", icon: <BarChart3 /> },
  { value: "pie", label: "饼图", icon: <PieChart /> },
  { value: "activity", label: "活动", icon: <Activity /> },
]

export default function SegmentsDemo() {
  const [selectedValue1, setSelectedValue1] = useState("home")
  const [selectedValue2, setSelectedValue2] = useState("notifications")
  const [selectedValue3, setSelectedValue3] = useState("trending")
  const [selectedValue4, setSelectedValue4] = useState("home")
  const [selectedValue5, setSelectedValue5] = useState("notifications")
  const [selectedValue6, setSelectedValue6] = useState("trending")

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Segments 组件演示
        </h1>
        <p className="text-gray-400">类似iOS的segment组件，支持滑动动画效果</p>
      </div>

      {/* 基础用法 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">基础用法</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-2">默认样式 (default)</p>
            <Segments
              options={segmentOptions}
              value={selectedValue1}
              onChange={setSelectedValue1}
            />
            <p className="text-sm text-gray-500 mt-2">
              当前选中: {selectedValue1}
            </p>
          </div>

          <div>
            <p className="text-gray-300 mb-2">轮廓样式 (outlined)</p>
            <Segments
              options={iconOptions}
              value={selectedValue2}
              onChange={setSelectedValue2}
              variant="outlined"
            />
            <p className="text-sm text-gray-500 mt-2">
              当前选中: {selectedValue2}
            </p>
          </div>

          <div>
            <p className="text-gray-300 mb-2">填充样式 (filled)</p>
            <Segments
              options={chartOptions}
              value={selectedValue3}
              onChange={setSelectedValue3}
              variant="filled"
            />
            <p className="text-sm text-gray-500 mt-2">
              当前选中: {selectedValue3}
            </p>
          </div>
        </div>
      </Card>

      {/* 尺寸变体 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">尺寸变体</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-2">小尺寸 (sm)</p>
            <Segments
              options={segmentOptions}
              value={selectedValue4}
              onChange={setSelectedValue4}
              size="sm"
            />
          </div>

          <div>
            <p className="text-gray-300 mb-2">中尺寸 (md) - 默认</p>
            <Segments
              options={iconOptions}
              value={selectedValue5}
              onChange={setSelectedValue5}
              size="md"
            />
          </div>

          <div>
            <p className="text-gray-300 mb-2">大尺寸 (lg)</p>
            <Segments
              options={chartOptions}
              value={selectedValue6}
              onChange={setSelectedValue6}
              size="lg"
            />
          </div>
        </div>
      </Card>

      {/* 禁用状态 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">禁用状态</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-2">禁用状态</p>
            <Segments options={segmentOptions} value="home" disabled />
          </div>
        </div>
      </Card>

      {/* 动态选项 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">动态选项</h2>
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              onClick={() => {
                const newOptions = [
                  { value: "option1", label: "选项1" },
                  { value: "option2", label: "选项2" },
                ]
                // 这里可以动态更新选项
                console.log("更新选项:", newOptions)
              }}
            >
              更新选项
            </Button>
          </div>
          <Segments
            options={[
              { value: "dynamic1", label: "动态选项1" },
              { value: "dynamic2", label: "动态选项2" },
              { value: "dynamic3", label: "动态选项3" },
            ]}
            onChange={(value) => console.log("选中:", value)}
          />
        </div>
      </Card>

      {/* 自定义样式 */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white mb-4">自定义样式</h2>
        <div className="space-y-4">
          <div>
            <p className="text-gray-300 mb-2">自定义背景色</p>
            <Segments
              options={segmentOptions}
              className="bg-gradient-to-r from-purple-900/50 to-blue-900/50"
              style={{
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
