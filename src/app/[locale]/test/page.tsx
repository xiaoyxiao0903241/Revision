"use client"

import { useTranslations } from "next-intl"
import Link from "next/link"

export default function TestPage() {
  const t = useTranslations("navigation")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">多语言测试页面</h1>

      <div className="rounded-lg bg-gray-800 p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">翻译测试</h2>
        <div className="space-y-2">
          <p>
            <strong>仪表板:</strong> {t("dashboard")}
          </p>
          <p>
            <strong>分析:</strong> {t("analytics")}
          </p>
          <p>
            <strong>社区:</strong> {t("community")}
          </p>
          <p>
            <strong>质押:</strong> {t("staking")}
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <Link
          href="/zh/test"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          中文版本
        </Link>
        <Link
          href="/en/test"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          English Version
        </Link>
      </div>

      <Link
        href="/staking"
        className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        返回质押页面
      </Link>
    </div>
  )
}
