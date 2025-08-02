"use client"

import React from "react"
import { Icon, ICON_NAMES, ICON_COUNT } from "./icon"

/**
 * Icon组件使用示例
 * 展示各种图标的使用方法和样式
 */
export function IconExamples() {
  const handleIconClick = (iconName: string) => {
    console.log(`点击了图标: ${iconName}`)
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Icon 组件示例</h2>
        <p className="text-gray-600 mb-2">总共支持 {ICON_COUNT} 个图标</p>
      </div>

      {/* 基础用法 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">基础用法</h3>
        <div className="flex flex-wrap gap-4">
          <Icon name="analytics" />
          <Icon name="community" />
          <Icon name="dashboard" />
          <Icon name="dao" />
          <Icon name="staking" />
        </div>
      </div>

      {/* 自定义尺寸 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">自定义尺寸</h3>
        <div className="flex items-center gap-4">
          <Icon name="calculator" size={12} />
          <Icon name="calculator" size={16} />
          <Icon name="calculator" size={24} />
          <Icon name="calculator" size={32} />
          <Icon name="calculator" size="2rem" />
          <Icon name="calculator" size="3em" />
        </div>
      </div>

      {/* 自定义颜色 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">自定义颜色</h3>
        <div className="flex items-center gap-4">
          <Icon name="claim" color="#10b981" />
          <Icon name="unstake" color="#ef4444" />
          <Icon name="stake" color="#3b82f6" />
          <Icon name="clock" color="#f59e0b" />
          <Icon name="bnb" color="#f7931e" />
        </div>
      </div>

      {/* 可点击图标 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">可点击图标</h3>
        <div className="flex items-center gap-4">
          <Icon
            name="swap"
            size={24}
            color="#8b5cf6"
            onClick={() => handleIconClick("swap")}
            className="hover:opacity-80 transition-opacity"
          />
          <Icon
            name="documents"
            size={24}
            color="#06b6d4"
            onClick={() => handleIconClick("documents")}
            className="hover:opacity-80 transition-opacity"
          />
          <Icon
            name="turbine"
            size={24}
            color="#84cc16"
            onClick={() => handleIconClick("turbine")}
            className="hover:opacity-80 transition-opacity"
          />
        </div>
      </div>

      {/* 禁用状态 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">禁用状态</h3>
        <div className="flex items-center gap-4">
          <Icon name="lp-bonds" disabled />
          <Icon name="locked-staking" disabled />
          <Icon name="cooling-pool" disabled />
        </div>
      </div>

      {/* 所有图标展示 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">所有可用图标</h3>
        <div className="grid grid-cols-5 gap-4">
          {ICON_NAMES.map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => handleIconClick(iconName)}
            >
              <Icon name={iconName} size={24} className="mb-2 cursor-pointer" />
              <span className="text-xs text-gray-600 text-center">
                {iconName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 组合使用示例 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">组合使用示例</h3>
        <div className="space-y-4">
          {/* 导航项 */}
          <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
            <Icon name="analytics" size={20} color="#6366f1" />
            <span>数据分析</span>
          </div>

          {/* 按钮 */}
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Icon name="stake" size={16} />
            <span>开始质押</span>
          </button>

          {/* 状态指示 */}
          <div className="flex items-center gap-2">
            <Icon name="clock" size={16} color="#f59e0b" />
            <span className="text-sm text-gray-600">冷却中...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
