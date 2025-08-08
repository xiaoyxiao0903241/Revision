import { useTranslations } from "next-intl"
import { FC, ReactNode, useState } from "react"
import { Button, Card, Pager, Tabs } from "~/components"
import { useMock } from "~/hooks/useMock"
import { cn, dayjs, formatDecimal } from "~/lib/utils"

// 布道奖记录数据
const records = Array.from({ length: 4 }).map((_, index) => ({
  id: index,
  event: "Bonus",
  communityLevel: 4,
  smallTeamPerformance: 123285.0,
  totalPerformance: 1223285.0,
  bonusAmount: index === 3 ? 5.0 : 85.0,
  dateTime: "2025/12/30 12:30:22",
}))

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
        "py-3 px-4 gap-1 flex flex-col w-1/6 justify-start",
        className
      )}
    >
      <div className="text-xs text-foreground/50">{title}</div>
      <div className="flex flex-row items-center gap-2">{children}</div>
    </td>
  )
}

export const EvangelistBonusRecords: FC = () => {
  const t = useTranslations("dao")
  const tStaking = useTranslations("staking")
  const [activeTab, setActiveTab] = useState(0)
  const { walletConnected } = useMock()

  // 标签页数据
  const tabData = [
    { label: t("bonus_record"), href: "#" },
    { label: t("claim_record"), href: "#" },
  ]

  // 过滤记录
  const filteredRecords =
    activeTab === 0
      ? records
      : records.filter((record) => {
          if (activeTab === 1) return record.event === "Bonus"
          if (activeTab === 2) return record.event === "Claim"
          return true
        })

  return (
    <Card>
      {/* 标签页 */}
      <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
        <div className="flex-1 flex flex-col items-end">
          <div className="text-base text-foreground">
            {formatDecimal(22197, 0)} {tStaking("records")}
          </div>
          <div className="text-xs text-foreground/50">
            {dayjs(dayjs().subtract(20, "seconds")).fromNow()}
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
                  <Cell title={t("event")} className="text-secondary">
                    {t("bonus_event_type")}
                  </Cell>
                  <Cell title={t("community_level")}>
                    {record.communityLevel}
                  </Cell>
                  <Cell title={t("small_team_performance")}>
                    ${formatDecimal(record.smallTeamPerformance, 2)}
                  </Cell>
                  <Cell title={t("total_performance")}>
                    ${formatDecimal(record.totalPerformance, 2)}
                  </Cell>
                  <Cell title={t("bonus_amount")}>
                    {formatDecimal(record.bonusAmount, 2)} OLY
                  </Cell>
                  <Cell title={t("date_time")}>{record.dateTime}</Cell>
                </tr>
              ))
            ) : (
              <tr className="w-full">
                <td
                  colSpan={6}
                  className="flex flex-col items-center justify-center text-foreground/50 bg-foreground/5 rounded-lg p-4 gap-2"
                >
                  {!walletConnected ? (
                    <>
                      {t("walletNotConnected")}
                      <Button
                        clipDirection="topRight-bottomLeft"
                        className="w-auto"
                      >
                        {t("connectWallet")}
                      </Button>
                    </>
                  ) : (
                    <>
                      {t("noRecords")}
                      <Button
                        clipDirection="topRight-bottomLeft"
                        className="w-auto"
                      >
                        {t("stakeNow")}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
          {/* 分页 */}
          <tfoot>
            <tr>
              <td colSpan={6} className="flex justify-center items-center">
                <Pager
                  currentPage={1}
                  totalPages={20}
                  onPageChange={() => {}}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}
