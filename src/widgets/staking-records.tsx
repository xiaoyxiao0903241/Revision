import { useTranslations } from "next-intl"
import { FC, ReactNode, useState } from "react"
import { Button, Card, CardContent, Icon, Tabs } from "~/components"
import { cn, formatDecimal, formatHash } from "~/lib/utils"
import { useUserAddress } from "~/contexts/UserAddressContext";


// 事件颜色映射
const eventColors = {
  deposit: "text-secondary",
  principal: "text-destructive",
  rebase: "text-success",
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
interface recordType  {
  id: string;
  amount: string;
  createdAt: string;
  hash: string;
  lockIndex: number;
  recordType: string;
}

export const StakingRecords: FC<{
  records: recordType[],
  changeTab:(type:string) => void;
  total:number
}> = ({ records,changeTab,total}) => {
  const t = useTranslations("staking")
  const [activeTab, setActiveTab] = useState(0)
  const { userAddress } = useUserAddress();
  // 标签页数据
  const tabData = [
    { label: t("allEvent"), href: "#",type:"" },
    { label: t("stake"), href: "#",type:"deposit" },
    { label: t("unstake"), href: "#",type:"principal" },
    { label: t("claim"), href: "#",type:"rebalse" },
  ]

  // 过滤记录
  // const filteredRecords =
  //   activeTab === 0
  //     ? records
  //     : records.filter((record) => {
  //         if (activeTab === 1) return record.event === "Stake"
  //         if (activeTab === 2) return record.event === "Unstake"
  //         if (activeTab === 3) return record.event === "Claim"
  //         return true
  //       })
  return (
    <Card>
      <CardContent className="space-y-6">
        {/* 标签页 */}
        <Tabs data={tabData} activeIndex={activeTab} onChange={(value)=>{
          changeTab(tabData[value].type)
          setActiveTab(value)
        }}>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-base text-foreground">
              {total} {t("recordsCount")}
            </div>
            {/* <div className="text-xs text-foreground/50">
              {dayjs(dayjs().subtract(200, "seconds")).fromNow()}
            </div> */}
          </div>
        </Tabs>

        {/* 记录表格 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="flex flex-col gap-1">
              {records?.length > 0 ? (
                records.map((record,index) => (
                  <tr
                    key={index}
                    className="bg-foreground/5 mb-2 rounded-lg flex flex-row w-full"
                  >
                    <Cell
                      title={t("event")}
                      className={
                        eventColors[record.recordType as keyof typeof eventColors]
                      }
                    >
                      <Icon name="event" size={16} />
                      {record.recordType}
                    </Cell>
                    <Cell title={t("transactionHash")} className="w-1/4" >
                      <span
                        className="underline text-sm"
                        title={record.hash}
                        onClick={()=>{
                          window.open(`https://bscscan.com/tx/${record.hash}`)
                        }}
                      >
                        {formatHash(record.hash)}
                      </span>
                    </Cell>
                    <Cell title={t("amount")} className="w-1/4">
                      {formatDecimal(Number(record.amount), 2)}
                    </Cell>
                    {/* <Cell title={t("period")} className="w-1/5 uppercase">
                      {record.period ? `${record.period} ${t("days")}` : "  "}
                    </Cell> */}
                    <Cell title={t("dateTime")} className="w-1/4">{record.createdAt}</Cell>
                  </tr>
                ))
              ) : (
                <tr className="w-full">
                  <td
                    colSpan={5}
                    className="flex flex-col items-center justify-center text-foreground/50 bg-foreground/5 rounded-lg p-4 gap-2"
                  >
                    {!userAddress ? (
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
                         暂无数据
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
