"use client"

import _ from "lodash"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { FC, useState } from "react"
import List from "~/assets/list.svg"
import Trend from "~/assets/trend.svg"
import {
  Button,
  Card,
  CardContent,
  CardTitle,
  InfoPopover,
  Input,
  Pager,
  View,
} from "~/components"
import { useMock } from "~/hooks/useMock"
import { cn, dayjs, formatDecimal, formatHash } from "~/lib/utils"

const Step: FC<{
  index: number
  title: string
  description: string
  className?: string
}> = ({ index, title, description, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col py-4 my-4 h-full gap-2 pl-6 xl:pl-0 pr-4 lg:pr-0",
        className
      )}
    >
      <div className="flex w-full items-center gap-2">
        <View
          clipDirection="topLeft-bottomRight"
          border={true}
          clipSize={8}
          borderWidth={2}
          borderColor="#434c8c"
          className="w-9 h-9 flex bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)]"
        >
          <span className="text-[18px] font-bold text-white">{index + 1}</span>
        </View>
        <div className="border-t border-dashed border-foreground/50 w-full"></div>
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-foreground/50">{description}</p>
    </div>
  )
}

export default function CommunityPage() {
  const t = useTranslations("community")
  const { walletConnected, setWalletConnected, decimal, setDecimal } = useMock()
  const [currentPage, setCurrentPage] = useState(1)
  return (
    <div className="space-y-6">
      {/* 协议介绍横幅 */}
      <Card
        className="relative overflow-hidden"
        containerClassName="community-body"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold text-white mb-4">
              {t("protocolTitle")}
            </h1>
            <p className="text-foreground/50 text-sm leading-relaxed">
              {t("protocolDescription")}
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <Image
              src="/images/widgets/community-logo.png"
              alt="community"
              width={151}
              height={187}
            />
          </div>
        </div>
      </Card>

      {/* 如何获得社区奖励 */}
      <Card className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 p-0">
        <div className="py-6 lg:col-span-3 xl:col-span-1 p-6 flex items-center text-xl font-bold border-r border-dashed border-foreground/20">
          {t("howToGetRewards")}
        </div>
        {/* 步骤1 */}
        <Step
          index={0}
          title={t("step1.title")}
          description={t("step1.description")}
        />
        {/* 步骤2 */}
        <Step
          index={1}
          title={t("step2.title")}
          description={t("step2.description")}
        />

        {/* 步骤3 */}
        <Step
          index={2}
          title={t("step3.title")}
          description={t("step3.description")}
          className="pr-4 lg:pr-4"
        />
      </Card>

      {/* 推荐计划 */}
      <Card>
        <div className="flex items-center gap-2">
          <Trend className="w-6 h-6" />
          <span className="text-xl font-bold text-white">
            {t("referralProgram")}
          </span>
        </div>
        <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="flex flex-col gap-6  h-full">
            {/* 左侧数据 */}
            <div className="space-y-4 flex-1">
              <div className="flex items-center">
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-foreground/50">
                    {t("totalReferralLocked")}
                  </span>
                  <span className="text-white font-mono text-lg">0.00 OLY</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-foreground/50">
                    {t("totalCommunityLocked")}
                  </span>
                  <span className="text-white font-mono text-lg">0.00 OLY</span>
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-xs text-foreground/50">
                    {t("communityRewards")}
                  </span>
                  <span className="text-white font-mono text-lg">0.00 OLY</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm">
                  {t("referralBy")}
                </label>
                <div className="bg-[#1b1f48] items-center flex shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] px-3 py-4 w-full xl:w-5/6">
                  {walletConnected ? (
                    formatHash("0x2323...ewrew2")
                  ) : (
                    <>
                      <Input
                        value={decimal ?? ""}
                        className="flex-1"
                        onChange={(e) => {
                          setDecimal(e.target.value)
                        }}
                      />
                      <button
                        className="bg-transparent gradient-text font-bold text-sm"
                        onClick={() => setWalletConnected(true)}
                      >
                        {t("submit")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <View
            clipDirection="topRight-bottomLeft"
            className="bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30 p-4"
          >
            {/* 右侧推荐链接 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="space-y-1 flex-1">
                  <label className="text-foreground/50 text-xs">
                    {t("referralLink")}
                  </label>
                  <div className="flex gap-2 items-center">
                    <span className="text-white font-mono text-sm">
                      https://oIYonedao.com/d453DE
                    </span>
                    <InfoPopover className="w-80">
                      <Link
                        target="_blank"
                        href="https://olyonedao.com/invite?address=0x44966c2EE09D39D8568970adD528Fa0dc4d453DE"
                        className="text-white font-mono text-sm break-all whitespace-normal underline"
                      >
                        https://olyonedao.com/invite?address=0x44966c2EE09D39D8568970adD528Fa0dc4d453DE
                      </Link>
                    </InfoPopover>
                  </div>
                </div>
                <Button
                  onClick={() => navigator.clipboard.writeText("")}
                  className="px-4 h-8"
                  clipSize={8}
                  clipDirection="topLeft-bottomRight"
                >
                  {t("copyLink")}
                </Button>
              </div>
              <div className="space-y-2 text-xs">
                <h4 className="text-white font-semibold">
                  {t("inviteFriends")}
                </h4>
                <p className="text-foreground/50 text-xs leading-relaxed">
                  {t("referralBenefits")}
                </p>
              </div>
            </div>
          </View>
        </CardContent>
      </Card>

      {/* 推荐列表 */}
      <Card>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <List className="w-6 h-6" />
            {t("referralList")}
          </CardTitle>
          <div className="flex flex-col gap-1 text-right">
            <span className="text-white">22,197 {t("records")}</span>
            <span className="text-xs text-foreground/50">
              {dayjs().fromNow()}
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="space-y-2">
              {_.times(10).map((item, index) => (
                <tr
                  key={index}
                  className="grid grid-cols-4  p-6 bg-foreground/5 rounded-md"
                >
                  <td className="py-3 px-4 flex flex-col gap-1">
                    <span className="text-xs text-foreground/50">
                      {t("address")}
                    </span>
                    <span className="text-blue-400 cursor-pointer hover:underline font-mono">
                      {formatHash("0x2323...ewrew2")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-mono flex flex-col gap-1">
                    <span className="text-xs text-foreground/50">
                      {t("netHolding")}
                    </span>
                    <span>
                      {formatDecimal(85)}{" "}
                      <span className="gradient-text"> OLY</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white font-mono flex flex-col gap-1">
                    <span className="text-xs text-foreground/50">
                      {t("totalCommunityPerformance")}
                    </span>
                    <span>
                      {formatDecimal(85)}{" "}
                      <span className="gradient-text"> OLY</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300 font-mono flex flex-col gap-1">
                    <span className="text-xs text-foreground/50">
                      {t("joinTime")}
                    </span>
                    <span>{dayjs().format("YYYY/MM/DD HH:mm:ss")}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="col-span-4">
              <tr>
                <td colSpan={4} className="text-center">
                  <Pager
                    currentPage={currentPage}
                    totalPages={20}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}
