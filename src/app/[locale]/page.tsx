import { useTranslations } from "next-intl"
import { Link } from "~/i18n/navigation"

export default function HomePage() {
  const t = useTranslations("common")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t("welcome")}</h1>

      <div className="space-y-4">
        <p className="text-gray-300">{t("description")}</p>

        {/* 测试 next-intl Link 组件 */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">测试链接：</h2>
          <div className="flex space-x-4">
            <Link
              href="staking"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              质押页面 (next-intl Link)
            </Link>
            <a
              href="/zh/staking"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              质押页面 (原生 a 标签)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
