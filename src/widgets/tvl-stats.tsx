"use client"

import { useTranslations } from "next-intl"
import React, { useState } from "react"
import { Icon, IconFontName, View } from "~/components"
import { PieChart } from "./small-chart"

// TVL统计组件
export const TVLStats: React.FC = () => {
  const t = useTranslations("analytics")
  const [showGraph, setShowGraph] = useState(false)
  const tvlData: {
    currentTVL: number
    change: number
    changePercent: number
    components: {
      name: string
      value: number
      change: number
      icon: IconFontName
    }[]
  } = {
    currentTVL: 137349459,
    change: -196191.904,
    changePercent: -0.14,
    components: [
      {
        name: t("no_lock_staking"),
        value: 300,
        change: -0.1,
        icon: "staking",
      },
      {
        name: t("locked_staking"),
        value: 200,
        change: -0.1,
        icon: "locked-staking",
      },
      {
        name: t("lp_bonds"),
        value: 100,
        change: -0.1,
        icon: "lp-bonds",
      },
      {
        name: t("treasury_bonds"),
        value: 400,
        change: 0.1,
        icon: "treasury-bonds",
      },
    ],
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 标题和切换按钮 */}
      <div
        className="absolute top-2 right-2 "
        onClick={() => setShowGraph(!showGraph)}
      >
        <View
          clipDirection="topLeft-bottomRight"
          border={true}
          clipSize={8}
          borderWidth={2}
          borderColor="#434c8c"
          className="flex px-4 py-1 cursor-pointer bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)]"
        >
          <span className="text-sm text-white">{t("switch")}</span>
        </View>
      </div>
      {/* 当前TVL值 */}
      <div className="gap-2 flex flex-col items-center">
        <h3 className="text-foreground/50">{t("tvl")}</h3>
        <div className="text-5xl font-bold text-white text-nowrap text-ellipsis">
          $ {tvlData.currentTVL.toLocaleString()}
        </div>
        <span className="text-sm text-foreground/50">{t("tvl_changes")}</span>
        <span
          className={`text-2xl font-mono ${
            tvlData.change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          $ {tvlData.change.toLocaleString()}
        </span>
        <span
          className={`font-mono ${
            tvlData.changePercent >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          ({tvlData.changePercent >= 0 ? "+" : ""}
          {tvlData.changePercent}%)
        </span>
      </div>

      {/* TVL组件列表 */}
      {showGraph ? (
        <div>
          <PieChart data={tvlData.components} />
        </div>
      ) : (
        <div className="space-y-3 p-4 border-foreground/20 border">
          {tvlData.components.map((component, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={component.icon} size={20} />
                <span className="text-sm text-foreground/50">
                  {component.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/50">
                  ${component.value.toLocaleString()}
                </span>
                <span
                  className={`text-xs ${
                    component.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  ({component.change >= 0 ? "+" : ""}
                  {component.change}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
