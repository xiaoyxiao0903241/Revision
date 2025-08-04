"use client"

import { useTranslations } from "next-intl"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  View,
} from "~/components"

// 模拟数据
const mockReferralData = {
  totalReferralLocked: "0.00 OLY",
  totalCommunityLocked: "0.00 OLY",
  communityRewards: "0.00 OLY",
  referralBy: "0x2323...ewrew2",
  referralLink: "https://oI Yonedao.com/d453DE",
}

const mockReferralList = Array.from({ length: 5 }, (_, i) => ({
  address: "OX1ert...f9",
  netHolding: "85.00 OLY",
  totalCommunityPerformance: "85.00 OLY",
  joinTime: "2025/12/30 12:30:22",
}))

export default function CommunityPage() {
  const t = useTranslations("community")

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockReferralData.referralLink)
    // 这里可以添加复制成功的提示
  }

  return (
    <div className="space-y-6">
      {/* 协议介绍横幅 */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-xl"></div>
        </div>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold text-white mb-4">
                {t("protocolTitle")}
              </h1>
              <p className="text-gray-300 leading-relaxed">
                {t("protocolDescription")}
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <View className="w-24 h-24 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg opacity-60"></div>
              </View>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 如何获得社区奖励 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            {t("howToGetRewards")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 步骤1 */}
            <View className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {t("step1.title")}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("step1.description")}
                </p>
              </div>
            </View>

            {/* 步骤2 */}
            <View className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {t("step2.title")}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("step2.description")}
                </p>
              </div>
            </View>

            {/* 步骤3 */}
            <View className="bg-gray-800/50 p-4 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {t("step3.title")}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("step3.description")}
                </p>
              </div>
            </View>
          </div>
        </CardContent>
      </Card>

      {/* 推荐计划 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-purple-400">📈</span>
            {t("referralProgram")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧数据 */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">
                    {t("totalReferralLocked")}
                  </span>
                  <span className="text-white font-mono">
                    {mockReferralData.totalReferralLocked}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">
                    {t("totalCommunityLocked")}
                  </span>
                  <span className="text-white font-mono">
                    {mockReferralData.totalCommunityLocked}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">{t("communityRewards")}</span>
                  <span className="text-white font-mono">
                    {mockReferralData.communityRewards}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 text-sm">
                  {t("referralBy")}
                </label>
                <input
                  type="text"
                  value={mockReferralData.referralBy}
                  readOnly
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                />
              </div>
            </div>

            {/* 右侧推荐链接 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-gray-300 text-sm">
                  {t("referralLink")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={mockReferralData.referralLink}
                    readOnly
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white font-mono text-sm"
                  />
                  <Button onClick={handleCopyLink} size="sm" className="px-4">
                    {t("copyLink")}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-white font-semibold">
                  {t("inviteFriends")}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t("referralBenefits")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 推荐列表 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-purple-400">📋</span>
              {t("referralList")}
            </CardTitle>
            <div className="text-sm text-gray-400">
              <span>22,197 {t("records")}</span>
              <span className="ml-2">20 {t("secondsAgo")}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    {t("address")}
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    {t("netHolding")}
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    {t("totalCommunityPerformance")}
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">
                    {t("joinTime")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockReferralList.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30"
                  >
                    <td className="py-3 px-4">
                      <span className="text-blue-400 cursor-pointer hover:underline font-mono">
                        {item.address}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-mono">
                      {item.netHolding}
                    </td>
                    <td className="py-3 px-4 text-white font-mono">
                      {item.totalCommunityPerformance}
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-mono">
                      {item.joinTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button variant="outlined" size="sm" className="px-3">
              &lt;
            </Button>
            <Button variant="primary" size="sm" className="px-3">
              1
            </Button>
            <Button variant="outlined" size="sm" className="px-3">
              2
            </Button>
            <Button variant="outlined" size="sm" className="px-3">
              3
            </Button>
            <Button variant="outlined" size="sm" className="px-3">
              4
            </Button>
            <span className="text-gray-400 px-2">...</span>
            <Button variant="outlined" size="sm" className="px-3">
              20
            </Button>
            <Button variant="outlined" size="sm" className="px-3">
              &gt;
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
