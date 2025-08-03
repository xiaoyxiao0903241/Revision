"use client"

import { useTranslations } from "next-intl"
import { ReactNode, useState } from "react"
import { Alert, Button, Card, CardContent, Icon, Tabs } from "~/components"
import { stakingRecords } from "~/hooks/useMock"
import { cn, dayjs, formatDecimal } from "~/lib/utils"

// 事件颜色映射
const eventColors = {
  Claim: "text-secondary",
  Unstake: "text-destructive",
  Stake: "text-success",
}

const Cell = ({
  children,
  className,
  title,
}: {
  className?: string
  title: string
  children: ReactNode
}) => {
  return (
    <td
      className={cn(
        "py-3 px-4 gap-1 flex flex-col w-1/5 justify-start",
        className
      )}
    >
      <div className="text-xs text-foreground/50">{title}</div>
      <div className="flex flex-row items-center gap-2">{children}</div>
    </td>
  )
}

export default function RecordsPage() {
  const t = useTranslations("staking")
  const [activeTab, setActiveTab] = useState(0)

  // 标签页数据
  const tabData = [
    { label: t("allEvent"), href: "#" },
    { label: t("stake"), href: "#" },
    { label: t("unstake"), href: "#" },
    { label: t("claim"), href: "#" },
  ]

  // 过滤记录
  const filteredRecords =
    activeTab === 0
      ? stakingRecords
      : stakingRecords.filter((record) => {
          if (activeTab === 1) return record.event === "Stake"
          if (activeTab === 2) return record.event === "Unstake"
          if (activeTab === 3) return record.event === "Claim"
          return true
        })

  return (
    <div className="space-y-6">
      <Alert
        icon="record"
        title={t("records")}
        description={t("recordsDescription")}
      />

      <Card>
        <CardContent className="space-y-6">
          {/* 标签页 */}
          <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
            <div className="flex-1 flex flex-col items-end">
              <div className="text-base text-foreground">
                {formatDecimal(22197, 0)} {t("recordsCount")}
              </div>
              <div className="text-xs text-foreground/50">
                {dayjs(dayjs().subtract(200, "seconds")).fromNow()}
              </div>
            </div>
          </Tabs>

          {/* 记录表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="flex flex-col gap-1">
                {filteredRecords?.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="bg-foreground/5 mb-2 rounded-lg flex flex-row w-full"
                    >
                      <Cell
                        title={t("event")}
                        className={
                          eventColors[record.event as keyof typeof eventColors]
                        }
                      >
                        <Icon name="event" size={16} />
                        {record.event}
                      </Cell>
                      <Cell title={t("transactionHash")} className="w-1/5">
                        <a
                          href="#"
                          className="underline text-sm"
                          title={record.transactionHash}
                        >
                          {record.transactionHash.length > 10
                            ? `${record.transactionHash.slice(
                                0,
                                6
                              )}...${record.transactionHash.slice(-4)}`
                            : record.transactionHash}
                        </a>
                      </Cell>
                      <Cell title={t("amount")} className="w-1/5">
                        {formatDecimal(record.amount, 2)}
                      </Cell>
                      <Cell title={t("period")} className="w-1/5 uppercase">
                        {record.period ? `${record.period} ${t("days")}` : "  "}
                      </Cell>
                      <Cell title={t("dateTime")}>{record.dateTime}</Cell>
                    </tr>
                  ))
                ) : (
                  <tr className="w-full">
                    <td
                      colSpan={5}
                      className="flex flex-col items-center justify-center text-foreground/50 bg-foreground/5 rounded-lg p-4 gap-2"
                    >
                      {t("noRecords")}
                      <Button
                        clipDirection="topRight-bottomLeft"
                        className="w-auto"
                      >
                        {t("stakeNow")}
                      </Button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
