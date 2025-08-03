"use client"

import { useTranslations } from "next-intl"
import { Alert } from "~/components"
import { stakingRecords } from "~/hooks/useMock"
import { StakingRecords } from "~/widgets/staking-records"

export default function RecordsPage() {
  const t = useTranslations("staking")

  return (
    <div className="space-y-6">
      <Alert
        icon="record"
        title={t("records")}
        description={t("recordsDescription")}
      />
      <StakingRecords records={stakingRecords} />
    </div>
  )
}
