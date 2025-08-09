"use client";

import { useTranslations } from "next-intl";
import { Alert } from "~/components";
import { WalletSummary } from "~/widgets";
import { StakingCalculator } from "~/widgets/staking-calculator";

export default function CalculatorPage() {
  const t = useTranslations("staking");
  const tLockedStaking = useTranslations("lockedStaking");
  return (
    <div className="space-y-6">
      {/* 顶部标题和描述 */}
      <Alert
        icon="calculator"
        title={t("calculatorTitle")}
        description={tLockedStaking("calculatorDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧计算器 */}
        <StakingCalculator rateEnabled />

        {/* 右侧钱包摘要 */}
        <div className="space-y-6">
          <WalletSummary />
        </div>
      </div>
    </div>
  );
}
