import { StakingForm } from "./components/staking-form"
import { StakingInfo } from "./components/staking-info"
import { Statistics } from "./components/statistics"

export default function StakingPage() {
  return (
    <div className="space-y-8">
      {/* 统计信息 */}
      <Statistics />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 质押表单 */}
        <i className="gradient-text">X</i>
        <StakingForm />

        {/* 质押信息 */}
        <StakingInfo />
      </div>
    </div>
  )
}
