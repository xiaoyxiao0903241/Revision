"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Card, Statistics, View } from "~/components";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { useQuery } from "@tanstack/react-query";
import { PerformanceChart } from "~/widgets";
import { myMess } from "~/services/auth/dashboard";
import { myMessDataType } from "../DashboardPage";
import {
  cn,
  dayjs,
  formatCurrency,
  formatNumbedecimalScale,
} from "~/lib/utils";
import { useNolockStore } from "~/store/noLock";
const Market = ({ myMessInfo }: { myMessInfo: myMessDataType }) => {
  const safeMyMessInfo = myMessInfo || {};
  const t = useTranslations("dashboard");
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all");
  const { userAddress } = useUserAddress();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const { olyPrice } = useNolockStore();
  const timeFilters = [
    { key: "all", label: t("timeFilters.all") },
    { key: "1m", label: t("timeFilters.1m") },
    { key: "3m", label: t("timeFilters.3m") },
    { key: "6m", label: t("timeFilters.6m") },
    { key: "1y", label: t("timeFilters.1y") },
  ];

  // 根据选中的时间过滤器计算开始和结束时间
  useEffect(() => {
    const now = Date.now();
    let start = "";
    let end = "";
    switch (selectedTimeFilter) {
      case "1m":
        start = dayjs(now).subtract(1, "month").valueOf().toString();
        end = now.toString();
        break;
      case "3m":
        start = dayjs(now).subtract(3, "month").valueOf().toString();
        end = now.toString();
        break;
      case "6m":
        start = dayjs(now).subtract(6, "month").valueOf().toString();
        end = now.toString();
        break;
      case "1y":
        start = dayjs(now).subtract(1, "year").valueOf().toString();
        end = now.toString();
        break;
      default:
        // all time 不设置具体时间
        start = "";
        end = "";
    }
    setStartTime(start);
    setEndTime(end);
  }, [selectedTimeFilter]);

  const { data: myMessData } = useQuery({
    queryKey: ["myMess", userAddress, startTime, endTime], // 将 startTime 和 endTime 添加到 queryKey 中
    queryFn: () => myMess(startTime, endTime, userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
    refetchInterval: 20000,
  });
  console.log(myMessData, "ddddddddddddddddddddd");

  return (
    <Card className="flex flex-col md:flex-row gap-6">
      <div className="w-full h-full xl:w-2/5 space-y-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/icon/rocket.png"
            alt="rocket"
            width={24}
            height={24}
          />
          <span className="text-white text-xl font-semibold">
            {t("performance")}
          </span>
        </div>
        {/* 业绩统计 */}
        <div className="space-y-6">
          <div className="flex">
            <div className="flex items-center gap-2 flex-1">
              <View
                clipDirection="topLeft-bottomRight"
                clipSize={4}
                className="bg-gradient-to-b from-primary to-secondary w-2 h-5/6"
              >
                <span />
              </View>
              <Statistics
                title={t("totalPerformance")}
                value={`${formatNumbedecimalScale(safeMyMessInfo.market || 0, 2)} OLY`}
                desc={`${formatCurrency(olyPrice * Number(safeMyMessInfo?.market ?? 0))}`}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <View
                clipDirection="topLeft-bottomRight"
                clipSize={4}
                className="bg-warning w-2 h-5/6"
              >
                <span />
              </View>
              <Statistics
                title={t("smallTeamPerformance")}
                value={`${formatNumbedecimalScale(safeMyMessInfo.smallMarket || 0, 2)} OLY`}
                desc={`${formatCurrency(olyPrice * Number(safeMyMessInfo?.smallMarket ?? 0))}`}
                size="sm"
              />
            </div>
          </div>
          <Statistics
            title={t("communityLevel")}
            value={`V${Number(safeMyMessInfo?.communityLevel || 0) <= 10 ? safeMyMessInfo?.communityLevel : 10}`}
            size="sm"
          />
        </div>
      </div>
      <div className="w-full h-full xl:w-3/5">
        {/* 时间筛选器 */}
        <div className="flex gap-2 justify-end">
          {timeFilters.map((filter) => (
            <View
              clipDirection="topLeft-bottomRight"
              clipSize={8}
              key={filter.key}
              onClick={() => setSelectedTimeFilter(filter.key)}
              border={true}
              borderWidth={1}
              borderColor={
                selectedTimeFilter === filter.key ? "#434c8c" : "#333333"
              }
              className={cn(
                "px-3 py-1 text-xs text-foreground/50  cursor-pointer bg-[#1b1f48]",
                {
                  "shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] text-foreground":
                    selectedTimeFilter === filter.key,
                },
              )}
            >
              {filter.label}
            </View>
          ))}
        </div>

        {/* 业绩图表 */}
        <PerformanceChart
          data={myMessData?.marketList || []}
          className="h-[160px]"
        />
      </div>
    </Card>
  );
};
export default Market;
