"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { Alert, Card } from "~/components"
import {
  CoolingPoolStats,
  CoolingPoolCard,
  CoolingPoolRecords,
} from "~/widgets"

export default function CoolingPoolPage() {
  const t = useTranslations("coolingPool")

  // 冷却池卡片数据
  const coolingPoolCards = [
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 85.65,
      period: 5,
      className: "text-white",
      bgClassName: "gradient",
      disabled: false,
      active: true,
    },
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 15.65,
      period: 10,
      className: "text-warning",
      bgClassName: "bg-warning",
      disabled: false,
      active: false,
    },
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 85.65,
      period: 15,
      className: "text-success",
      bgClassName: "bg-success",
      disabled: false,
      active: false,
    },
    {
      released: 0.0,
      waiting: 0.0,
      waitingPercent: 0.0,
      period: 20,
      className: "text-secondary",
      bgClassName: "bg-secondary",
      disabled: true,
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* 描述区域 */}
      <Alert icon="stake" title={t("title")} description={t("description")} />

      <div className="grid grid-cols-1">
        <Card>
          {/* 统计卡片 */}
          <CoolingPoolStats />
          {/* 冷却池卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coolingPoolCards.map((card, index) => (
              <CoolingPoolCard key={index} data={card} onClick={() => {}}>
                <Image
                  src={`/images/widgets/pool-${index + 1}.png`}
                  alt="gear"
                  width={140}
                  height={140}
                />
              </CoolingPoolCard>
            ))}
          </div>
        </Card>
      </div>

      {/* 事件记录 */}
      <CoolingPoolRecords />
    </div>
  )
}
