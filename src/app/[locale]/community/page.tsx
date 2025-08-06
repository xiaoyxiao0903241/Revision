"use client"

import _ from "lodash"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FC } from "react"
import {
  Card,
  View,
} from "~/components"
import { cn } from "~/lib/utils"
import InviteJoin from "./components/InviteJoin"
import InviteRecord from "./components/InviteRecord"

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
      <InviteJoin />

      {/* 推荐列表 */}
      <InviteRecord />
    </div>
  )
}
