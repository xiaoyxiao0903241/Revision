"use client"

import { useTranslations } from "next-intl"

export default function DemoPage() {
  const t = useTranslations("navigation")

  return (
    <div className="p-8">
      <div className="card-body">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6 gradient-text">
            Sidebar 重构演示
          </h1>

          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">导航结构</h2>
              <ul className="space-y-2 text-sm">
                <li>• {t("dashboard")} - 仪表板</li>
                <li>• {t("analytics")} - 分析</li>
                <li>• {t("community")} - 社区</li>
                <li>• {t("staking")} - 质押</li>
                <li> - {t("noLockStaking")} - 无锁定期质押</li>
                <li> - {t("lockedStaking")} - 锁定质押</li>
                <li>• {t("bonds")} - 债券</li>
                <li> - {t("lpBonds")} - LP债券</li>
                <li> - {t("treasuryBonds")} - 国库债券</li>
                <li>• {t("tools")} - 工具</li>
                <li> - {t("dao")} - DAO</li>
                <li> - {t("coolingPool")} - 冷却池</li>
                <li> - {t("turbine")} - 涡轮</li>
                <li> - {t("swap")} - 交换</li>
                <li>• {t("documents")} - 文档</li>
                <li>• {t("viewOnAve")} - 在AVE上查看</li>
                <li>• {t("viewOnDexScreener")} - 在DexScreener上查看</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">特性</h2>
              <ul className="space-y-2 text-sm">
                <li>✅ 使用现有图标系统</li>
                <li>✅ 支持国际化</li>
                <li>✅ 响应式设计</li>
                <li>✅ 渐变高亮效果</li>
                <li>✅ 分组显示</li>
                <li>✅ 社交媒体链接</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">样式特点</h2>
              <ul className="space-y-2 text-sm">
                <li>• 深色主题设计</li>
                <li>• 九宫格边框效果</li>
                <li>• 渐变文字高亮</li>
                <li>• 悬停效果</li>
                <li>• 分组标题</li>
                <li>• 图标与文字对齐</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
