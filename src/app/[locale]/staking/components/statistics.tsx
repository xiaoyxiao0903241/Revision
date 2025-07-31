"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { TrendingUp, Users, DollarSign } from "lucide-react"

export function Statistics() {
  const t = useTranslations("staking")

  const stats = [
    {
      title: t("totalStaked"),
      value: "1,234,567 OLY",
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      title: t("stakers"),
      value: "5,432",
      icon: Users,
      color: "text-blue-400",
    },
    {
      title: t("marketCap"),
      value: "$12,345,678",
      icon: DollarSign,
      color: "text-purple-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
