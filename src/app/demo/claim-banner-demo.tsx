"use client"

import React from "react"
import { ClaimBanner } from "~/components"

export function ClaimBannerDemo() {
  const handleClaim = () => {
    console.log("Claim button clicked!")
    // 这里可以添加实际的领取逻辑
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">
        Claim Banner 组件演示
      </h1>

      {/* 默认样式 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">默认样式</h2>
        <ClaimBanner onClick={handleClaim} />
      </div>

      {/* 自定义内容 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">自定义内容</h2>
        <ClaimBanner
          title="REWARDS"
          description="Collect your daily rewards and bonuses now available."
          onClick={handleClaim}
        />
      </div>

      {/* 自定义图标 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">自定义图标</h2>
        <ClaimBanner
          title="BOOST"
          description="Activate your power boost for enhanced performance."
          icon={
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 2v11h3v9l7-12h-4l4-8z" />
            </svg>
          }
          onClick={handleClaim}
        />
      </div>

      {/* 自定义样式 */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">自定义样式</h2>
        <ClaimBanner
          title="SPECIAL"
          description="Limited time offer - don't miss out!"
          className="bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500/30"
          onClick={handleClaim}
        />
      </div>
    </div>
  )
}
