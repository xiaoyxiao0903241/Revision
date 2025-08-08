"use client"
import { useState } from "react"
import { Card, CardContent, Tabs } from "~/components"
import { useTranslations } from "next-intl"
import ProTable from "~/components/ProTable"
import { rewardHistoryList, rewardList } from "~/services/auth/dao"
import { useUserAddress } from '~/contexts/UserAddressContext'

type DaoRecordsParams = {
  currentPage: number
  pageSizeProp: number
  userAddress: string
  type: string
}
const DaoRecords = ({ type }: { type: string }) => {
  const t = useTranslations("dao")
  const tStaking = useTranslations("staking")
  const [activeTab, setActiveTab] = useState(0)
  const { userAddress } = useUserAddress()
  const [total, setTotal] = useState<number>(0)

  // 标签页数据
  const tabData = [
    { label: t("bonus_record"), href: "#" },
    { label: t("claim_record"), href: "#" },
  ]

  const columns = [
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      key: "amount",
    },
  ]

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* 标签页 */}
        <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-base text-foreground">
              {total} {tStaking("records")}
            </div>
            <div className="text-xs text-foreground/50">
            </div>
          </div>
        </Tabs>
        {
          activeTab === 0 && (
            <div className="overflow-x-auto">
              <ProTable
                columns={columns}
                queryFn={(params) => {
                  const { currentPage, pageSizeProp, type } = params as DaoRecordsParams;
                  return rewardList(currentPage, pageSizeProp, userAddress as string, type);
                }}
                params={{userAddress, type}}
                formatResult={(data) => {
                  const total = data?.total || 0;
                  setTotal(total);
                  return {
                    dataSource: data?.records || [],
                    total
                  }
                }}
              />
            </div>
          )
        }
        {
          activeTab === 1 && (
            <div className="overflow-x-auto">
              <ProTable
                columns={columns}
                queryFn={(params) => {
                  const { currentPage, pageSizeProp, type } = params as DaoRecordsParams;
                  return rewardHistoryList(currentPage, pageSizeProp, userAddress as string, type);
                }}
                params={{userAddress, type}}
                formatResult={(data) => {
                  const total = data?.total || 0;
                  setTotal(total);
                  return {
                    dataSource: data?.records || [],
                    total
                  }
                }}
              />
            </div>
          )
        }

      </CardContent>
    </Card>
  )
}
export default DaoRecords