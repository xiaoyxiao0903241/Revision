import { useTranslations } from "next-intl"
import { FC, ReactNode, useState } from "react"
import { Button, Card, CardContent, Icon, Pager, Tabs } from "~/components"
import { useMock } from "~/hooks/useMock"
import { cn, dayjs, formatDecimal, formatHash } from "~/lib/utils"

// 涡轮交易记录数据
const turbineRecords = [
  {
    id: 1,
    event: "Claim",
    amount: 1285.0,
    transactionHash: "0X1ert...f9gg",
    dateTime: "2025/12/30 12:30:22",
  },
  {
    id: 2,
    event: "Claim",
    amount: 1285.0,
    transactionHash: "0X1ert...f9gg",
    dateTime: "2025/12/30 12:30:22",
  },
  {
    id: 3,
    event: "Receive",
    amount: 1285.0,
    transactionHash: "0X1ert...f9gg",
    dateTime: "2025/12/30 12:30:22",
  },
  {
    id: 4,
    event: "Receive",
    amount: 1285.0,
    transactionHash: "0X1ert...f9gg",
    dateTime: "2025/12/30 12:30:22",
  },
]

// 事件颜色映射
const eventColors = {
  Claim: "text-secondary",
  Receive: "text-success",
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
        "py-3 px-4 gap-1 flex flex-col w-1/4 justify-start",
        className
      )}
    >
      <div className="text-xs text-foreground/50">{title}</div>
      <div className="flex flex-row items-center gap-2">{children}</div>
    </td>
  )
}

export const TurbineRecords: FC = () => {
  const t = useTranslations("turbine")
  const [activeTab, setActiveTab] = useState(0)
  const { walletConnected } = useMock()

  // 标签页数据
  const tabData = [
    { label: t("allEvent"), href: "#" },
    { label: t("receive"), href: "#" },
    { label: t("claimEvent"), href: "#" },
  ]

  // 过滤记录
  const filteredRecords =
    activeTab === 0
      ? turbineRecords
      : turbineRecords.filter((record) => {
          if (activeTab === 1) return record.event === "Receive"
          if (activeTab === 2) return record.event === "Claim"
          return true
        })

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* 标签页 */}
        <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-base text-foreground">
              {formatDecimal(22197, 0)} {t("records")}
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
                    <Cell
                      title={t("event")}
                      className={
                        eventColors[record.event as keyof typeof eventColors]
                      }
                    >
                      <Icon
                        name={record.event === "Claim" ? "event" : "record"}
                        size={16}
                      />
                      {record.event === "Claim"
                        ? t("claimEvent")
                        : t("receive")}
                    </Cell>
                    <Cell title={t("amount")} className="w-1/4">
                      {formatDecimal(record.amount, 2)} OLY
                    </Cell>
                    <Cell title={t("transactionHash")} className="w-1/4">
                      <a
                        href="#"
                        className="underline text-sm"
                        title={record.transactionHash}
                      >
                        {formatHash(record.transactionHash)}
                      </a>
                    </Cell>
                    <Cell title={t("dateTime")} className="w-1/4">
                      {record.dateTime}
                    </Cell>
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td
                    colSpan={4}
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
                <td colSpan={4} className="flex justify-center items-center">
                  <Pager
                    currentPage={3}
                    totalPages={10}
                    onPageChange={() => {}}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
