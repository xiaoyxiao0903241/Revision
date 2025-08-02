"use client"

import { Button } from "~/components/button"
import { ClaimBanner } from "~/components/claim-banner"
import { OptionItem, OptionList, OneIcon } from "~/components/option-item"
import { View } from "~/components/view"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"

export default function TestPage() {
  return (
    <div className="min-h-screen  bg-gray-600 p-8">
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
                <Button variant="accent">Accent</Button>
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
                      variant="accent"
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
                      variant="accent"
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

        {/* ClaimBanner 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            ClaimBanner 组件测试
          </h2>

          <div className="space-y-6">
            {/* 默认样式 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">默认样式</h3>
              <ClaimBanner onClick={() => console.log("Claim clicked!")} />
            </div>

            {/* 自定义内容 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                自定义内容
              </h3>
              <ClaimBanner
                title="REWARDS"
                description="Collect your daily rewards and bonuses now available."
                onClick={() => console.log("Rewards clicked!")}
              />
            </div>

            {/* 自定义图标 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                自定义图标
              </h3>
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
                onClick={() => console.log("Boost clicked!")}
              />
            </div>

            {/* 自定义样式 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                自定义样式
              </h3>
              <ClaimBanner
                title="SPECIAL"
                description="Limited time offer - don't miss out!"
                className="bg-gradient-to-r from-purple-600 to-blue-600 border-purple-500/30"
                onClick={() => console.log("Special clicked!")}
              />
            </div>
          </div>
        </div>

        {/* View 组件测试 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">View 组件测试</h2>

          <div className="space-y-6">
            {/* 基础 View */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">基础 View</h3>
              <View className="bg-blue-600 p-6 w-64 h-32">
                <p className="text-white">基础 View 组件，无切割效果</p>
              </View>
            </div>

            {/* 左上到右下斜切 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                左上到右下斜切
              </h3>
              <div className="flex flex-wrap gap-4">
                <View
                  className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                >
                  <p className="text-white font-bold">小斜切 (8px)</p>
                </View>

                <View
                  className="bg-gradient-to-r from-green-600 to-teal-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={16}
                >
                  <p className="text-white font-bold">中斜切 (16px)</p>
                </View>

                <View
                  className="bg-gradient-to-r from-red-600 to-pink-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={24}
                >
                  <p className="text-white font-bold">大斜切 (24px)</p>
                </View>
              </div>
            </div>

            {/* 右上到左下斜切 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                右上到左下斜切
              </h3>
              <div className="flex flex-wrap gap-4">
                <View
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 w-64 h-32"
                  clipDirection="topRight-bottomLeft"
                  clipSize={8}
                >
                  <p className="text-white font-bold">小斜切 (8px)</p>
                </View>

                <View
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 w-64 h-32"
                  clipDirection="topRight-bottomLeft"
                  clipSize={16}
                >
                  <p className="text-white font-bold">中斜切 (16px)</p>
                </View>

                <View
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 w-64 h-32"
                  clipDirection="topRight-bottomLeft"
                  clipSize={24}
                >
                  <p className="text-white font-bold">大斜切 (24px)</p>
                </View>
              </div>
            </div>

            {/* 不同尺寸的 View */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">不同尺寸</h3>
              <div className="flex flex-wrap gap-4 items-end">
                <View
                  className="bg-gradient-to-r from-pink-600 to-rose-600 p-4 w-32 h-24"
                  clipDirection="topLeft-bottomRight"
                  clipSize={12}
                >
                  <p className="text-white text-sm">小尺寸</p>
                </View>

                <View
                  className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 w-48 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={12}
                >
                  <p className="text-white">中等尺寸</p>
                </View>

                <View
                  className="bg-gradient-to-r from-violet-600 to-purple-600 p-8 w-64 h-40"
                  clipDirection="topLeft-bottomRight"
                  clipSize={12}
                >
                  <p className="text-white text-lg">大尺寸</p>
                </View>
              </div>
            </div>

            {/* 组合使用 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">组合使用</h3>
              <div className="flex flex-wrap gap-4">
                <View
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={16}
                  border={true}
                  borderColor="rgba(255, 255, 255, 0.2)"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">★</span>
                    </div>
                    <div>
                      <h4 className="text-white font-bold">带边框和图标</h4>
                      <p className="text-white/80 text-sm">组合多种样式效果</p>
                    </div>
                  </div>
                </View>

                <View
                  className="bg-gradient-to-r from-orange-600 to-red-600 p-6 w-64 h-32 shadow-lg"
                  clipDirection="topRight-bottomLeft"
                  clipSize={16}
                  border={true}
                  borderColor="rgba(255, 255, 255, 0.3)"
                  borderWidth={3}
                >
                  <div className="text-center">
                    <h4 className="text-white font-bold text-lg mb-2">
                      居中内容
                    </h4>
                    <p className="text-white/90">带阴影和边框效果</p>
                  </div>
                </View>
              </div>
            </div>

            {/* 调试测试 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">调试测试</h3>
              <div className="flex flex-wrap gap-4">
                {/* 简单的边框测试 */}
                <div
                  className="bg-red-600 p-6 w-64 h-32 relative"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                  }}
                >
                  {/* 手动添加边框层 */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      top: "-4px",
                      left: "-4px",
                      right: "-4px",
                      bottom: "-4px",
                      background: "rgba(255, 255, 255, 0.8)",
                      clipPath:
                        "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)",
                      zIndex: 0,
                    }}
                  />
                  <p className="text-white relative z-10">手动边框测试</p>
                </div>
              </div>
            </div>

            {/* 带边框的斜切示例 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                带边框的斜切
              </h3>
              <div className="flex flex-wrap gap-4">
                <View
                  className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={12}
                  border={true}
                  borderColor="rgba(255, 255, 255, 0.4)"
                >
                  <div className="text-center">
                    <h4 className="text-white font-bold">白色边框</h4>
                    <p className="text-white/80">40% 透明度</p>
                  </div>
                </View>

                <View
                  className="bg-gradient-to-r from-green-600 to-blue-600 p-6 w-64 h-32"
                  clipDirection="topRight-bottomLeft"
                  clipSize={12}
                  border={true}
                  borderColor="rgba(255, 255, 255, 0.6)"
                  borderWidth={4}
                >
                  <div className="text-center">
                    <h4 className="text-white font-bold">粗边框</h4>
                    <p className="text-white/80">4px 宽度</p>
                  </div>
                </View>

                <View
                  className="bg-gradient-to-r from-yellow-600 to-red-600 p-6 w-64 h-32"
                  clipDirection="topLeft-bottomRight"
                  clipSize={20}
                  border={true}
                  borderColor="rgba(0, 0, 0, 0.3)"
                >
                  <div className="text-center">
                    <h4 className="text-white font-bold">黑色边框</h4>
                    <p className="text-white/80">大斜切效果</p>
                  </div>
                </View>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
