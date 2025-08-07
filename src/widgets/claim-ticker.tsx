"use client"

import React from "react"
import {  formatCurrency, formatDecimal } from "~/lib/utils"
import { Button } from "~/components/button"
import { Countdown } from "~/components/count-down"
import { useTranslations } from "next-intl"
import { RoundedLogo } from "~/components"

interface ClaimTickerProps {
  lockedAmount: number
  usdValue: number
  endAt: Date
  disabled?: boolean
  onClaim: () => void
}

export function ClaimTicker({
  lockedAmount,
  endAt,
  usdValue,
  onClaim,
  disabled = false,
}: ClaimTickerProps) {
  const t = useTranslations("turbine")
  const tStaking = useTranslations("staking")
  return (
    <div className="relative px-4">
      <div className="flex items-center justify-between">
        {/* 左侧：锁定金额显示 */}
        <div className="flex flex-col">
          {/* 标题 */}
          <div className="text-gray-400 text-xs font-mono uppercase tracking-wider">
            {t("lockedAmount")}
          </div>

          <div className="flex items-center gap-3">
            {/* ONE 图标 */}
            <RoundedLogo className="w-5 h-5" />
            {/* 金额显示 */}
            <div className="flex items-baseline gap-1">
              <span className="text-white font-mono text-2xl font-bold">
                {formatDecimal(lockedAmount, 2)} OLY
              </span>
              <span className="text-foreground/50 text-xs">
                {formatCurrency(usdValue)}
              </span>
            </div>
          </div>
        </div>

        {/* 右侧：领取按钮和倒计时 */}
        <div className="flex flex-col items-end space-y-2">
          {/* 领取按钮 */}
          <Button
            variant="primary"
            size="md"
            clipDirection="topRight-bottomLeft"
            clipSize={8}
            onClick={onClaim}
            disabled={disabled}
            className="min-w-[100px] h-8"
          >
            {tStaking("claim")}
          </Button>

          {/* 倒计时 */}
          <div className="text-gray-400 font-mono text-xs">
            <span className="mr-1">{t("unlockCountdown")}:</span>
            <Countdown
              endAt={endAt}
              className="text-gray-400 font-mono text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
