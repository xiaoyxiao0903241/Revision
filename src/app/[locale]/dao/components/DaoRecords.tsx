"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, Icon, Tabs } from "~/components";
import { useTranslations } from "next-intl";
import ProTable, { ProTableColumn } from "~/components/ProTable";
import { rewardHistoryList, rewardList } from "~/services/auth/dao";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { formatDecimal } from "~/lib/utils";

type DaoRecordsParams = {
  currentPage: number;
  pageSizeProp: number;
  userAddress: string;
  type: string;
};

// 在文件顶部或其他合适位置定义数据项类型
type DaoRecordItem = {
  event: string;
  hash: string;
  amount: string;
  lockIndex: number;
  lockIndex_n: number;
  createdAt: string;
  actBonus: string;
  unlockNum: number;
  stakeAmount: string;
  lossBonus: string;
  createTime: string;
  sourceNum: number;
};
const DaoRecords = ({ type }: { type: string }) => {
  const t = useTranslations("dao");
  const tStaking = useTranslations("staking");
  const [activeTab, setActiveTab] = useState(0);
  const { userAddress } = useUserAddress();
  const [total, setTotal] = useState<number>(0);
  const [columns, setColumns] = useState<ProTableColumn<DaoRecordItem>[]>([]);

  // 标签页数据
  const tabData = [
    { label: t("bonus_record"), href: "#" },
    { label: t("claim_record"), href: "#" },
  ];

  const evnetColumn = {
    title: t("event"),
    dataIndex: "event",
    key: "event",
    render: () => {
      return (
        <span className="text-secondary">
          <Icon name="event" size={16} className="mr-2" />
          {t("bonus_event_type")}
        </span>
      );
    },
  };
  const historyColumns: ProTableColumn<DaoRecordItem>[] = [
    evnetColumn,
    {
      title: t("transaction_hash"),
      dataIndex: "hash",
      key: "hash",
      render: {
        link: true,
        href: (value: string) => `https://bscscan.com/address/${value}`,
        target: "_blank",
        valueType: "hash",
      },
    },
    {
      title: tStaking("amount"),
      dataIndex: "amount",
      key: "amount",
      render: (value: string) => {
        return <>{formatDecimal(Number(value), 2)} OLY</>;
      },
    },
    {
      title: t("lockingCycle"),
      dataIndex: "lockIndex",
      key: "lockIndex",
    },
    {
      title: t("tax_rate"),
      dataIndex: "lockIndex_n",
      key: "lockIndex_n",
    },
    {
      title: t("date_time"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: {
        valueType: "dateTime",
      },
    },
  ];

  const switchColumns = (type: string) => {
    let list: ProTableColumn<DaoRecordItem>[] = [];
    switch (type) {
      case "matrix":
        list = [
          evnetColumn,
          {
            title: t("net_holding"),
            dataIndex: "actBonus",
            key: "actBonus",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("unlock_layers_label"),
            dataIndex: "unlockNum",
            key: "unlockNum",
          },
          {
            title: t("net_holding_amount"),
            dataIndex: "stakeAmount",
            key: "stakeAmount",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("loss_bonus_amount"),
            dataIndex: "lossBonus",
            key: "lossBonus",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("date_time"),
            dataIndex: "createTime",
            key: "createTime",
            render: {
              valueType: "dateTime",
            },
          },
        ];
        break;
      case "promotion":
        list = [
          evnetColumn,
          // 时间(createTime)	社区级别(benefitLevel)	小区业绩(smallMarket)	总业绩(market)	奖金(actBonus)
          {
            title: t("net_holding"),
            dataIndex: "actBonus",
            key: "actBonus",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("total_performance"),
            dataIndex: "market",
            key: "market",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("small_team_performance"),
            dataIndex: "smallMarket",
            key: "smallMarket",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("evangelist_level"),
            dataIndex: "benefitLevel",
            key: "benefitLevel",
          },
          {
            title: t("date_time"),
            dataIndex: "createTime",
            key: "createTime",
            render: {
              valueType: "dateTime",
            },
          },
        ];
        break;
      case "lead":
        list = [
          evnetColumn,
          // 时间(createTime)	解锁称号会员数量(sourceNum)	奖金(actBonus)
          {
            title: t("net_holding"),
            dataIndex: "actBonus",
            key: "actBonus",
            render: (value: string) => {
              return <>{formatDecimal(Number(value), 2)} OLY</>;
            },
          },
          {
            title: t("evangelist_level"),
            dataIndex: "sourceNum",
            key: "sourceNum",
          },
          {
            title: t("date_time"),
            dataIndex: "createTime",
            key: "createTime",
            render: {
              valueType: "dateTime",
            },
          },
        ];
        break;
    }
    setColumns(list);
  };

  useEffect(() => {
    switchColumns(type);
  }, [activeTab, type]);

  return (
    <Card>
      <CardContent className="space-y-6">
        {/* 标签页 */}
        <Tabs data={tabData} activeIndex={activeTab} onChange={setActiveTab}>
          <div className="flex-1 flex flex-col items-end">
            <div className="text-base text-foreground">
              {total} {tStaking("records")}
            </div>
            <div className="text-xs text-foreground/50"></div>
          </div>
        </Tabs>
        {activeTab === 0 && (
          <div className="overflow-x-auto">
            <ProTable
              columns={activeTab === 0 ? columns : historyColumns}
              queryFn={(params) => {
                const { currentPage, pageSizeProp, type } =
                  params as DaoRecordsParams;
                return rewardList(
                  currentPage,
                  pageSizeProp,
                  userAddress as string,
                  type,
                );
              }}
              params={{ userAddress, type }}
              formatResult={(data) => {
                const total = data?.total || 0;
                setTotal(total);
                return {
                  dataSource: data?.records || [],
                  total,
                };
              }}
            />
          </div>
        )}
        {activeTab === 1 && (
          <div className="overflow-x-auto">
            <ProTable
              columns={columns}
              queryFn={(params) => {
                const { currentPage, pageSizeProp, type } =
                  params as DaoRecordsParams;
                return rewardHistoryList(
                  currentPage,
                  pageSizeProp,
                  userAddress as string,
                  type,
                );
              }}
              params={{ userAddress, type }}
              formatResult={(data) => {
                const total = data?.total || 0;
                setTotal(total);
                return {
                  dataSource: data?.records || [],
                  total,
                };
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default DaoRecords;
