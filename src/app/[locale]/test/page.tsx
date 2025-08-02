"use client"

import { Statistics } from "~/components/statistics"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          Statistics 组件测试
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 基本用法 - 对应图片中的样式 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics title="Rebase Rewards" value="0.00 OLY" desc="$0.00" />
          </div>

          {/* 带信息弹窗的用法 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics
              title="Rebase Rewards"
              value="0.00 OLY"
              desc="$0.00"
              info="Rebase rewards are distributed automatically to stakers based on their staking amount and duration. The rewards are calculated using a complex algorithm that takes into account the total staking pool and individual contributions."
            />
          </div>

          {/* 只有标题和数值 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics title="Total Staked" value="1,234.56 OLY" />
          </div>

          {/* 带信息的其他示例 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics
              title="APY Rate"
              value="12.5%"
              desc="Annual Percentage Yield"
              info="The Annual Percentage Yield (APY) represents the real rate of return earned on your staking investment, taking into account the effect of compound interest."
            />
          </div>

          {/* 大数值示例 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics
              title="Market Cap"
              value="$2.5M"
              desc="Total Market Value"
            />
          </div>

          {/* 带信息的复杂示例 */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <Statistics
              title="Circulating Supply"
              value="1,000,000"
              desc="Total Tokens in Circulation"
              info="This represents the total number of tokens currently available in the market. It excludes tokens that are locked in staking contracts or held by the development team."
            />
          </div>
        </div>

        <div className="mt-12 p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">组件特性</h2>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>title</strong>: 必填，显示在顶部的标题文本
            </li>
            <li>
              • <strong>value</strong>: 必填，显示主要数值
            </li>
            <li>
              • <strong>desc</strong>: 可选，显示在数值下方的描述文本
            </li>
            <li>
              • <strong>info</strong>:
              可选，如果提供则显示信息图标，点击弹出详细信息
            </li>
            <li>
              • <strong>className</strong>: 可选，自定义样式类名
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
