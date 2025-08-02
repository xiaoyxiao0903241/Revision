"use client"

import { Button } from "~/components/button"
import { ClaimBanner } from "~/components/claim-banner"
import { View } from "~/components/view"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/select"
import { Alert } from "~/components/alert"
import { Slider } from "~/components"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-transparent p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">组件测试页面</h1>

        {/* 基础 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">基础 Slider</h2>
          <div className="p-6 bg-gray-800 rounded-lg">
            <Slider defaultValue={[33]} max={100} step={1} />
          </div>
        </div>

        {/* 带指示器的 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            带指示器的 Slider
          </h2>
          <div className="p-6 bg-gray-800 rounded-lg">
            <Slider
              defaultValue={[0.2]}
              max={1}
              step={0.01}
              indicators={[
                { value: 0.1, label: "10%" },
                { value: 0.3, label: "30%" },
                { value: 0.5, label: "50%" },
                { value: 0.7, label: "70%" },
                { value: 0.9, label: "90%" },
              ]}
            />
          </div>
        </div>

        {/* 不同指示器配置的 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">不同指示器配置</h2>
          <div className="p-6 bg-gray-800 rounded-lg space-y-6">
            <div>
              <p className="text-sm text-gray-300 mb-2">
                指示器: [25%, 50%, 75%]
              </p>
              <Slider
                defaultValue={[0.3]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.25, label: "25%" },
                  { value: 0.5, label: "50%" },
                  { value: 0.75, label: "75%" },
                ]}
              />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-2">
                指示器: [20%, 40%, 60%, 80%]
              </p>
              <Slider
                defaultValue={[0.6]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.2, label: "20%" },
                  { value: 0.4, label: "40%" },
                  { value: 0.6, label: "60%" },
                  { value: 0.8, label: "80%" },
                ]}
              />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-2">指示器: [10%, 90%]</p>
              <Slider
                defaultValue={[0.5]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.1, label: "10%" },
                  { value: 0.9, label: "90%" },
                ]}
              />
            </div>
          </div>
        </div>

        {/* 无指示器的 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            无指示器的 Slider
          </h2>
          <div className="p-6 bg-gray-800 rounded-lg">
            <Slider defaultValue={[50]} max={100} step={1} indicators={[]} />
          </div>
        </div>

        {/* 带 padding 的指示器 Slider */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            带 padding 的指示器 Slider
          </h2>
          <div className="p-6 bg-gray-800 rounded-lg space-y-6">
            <div>
              <p className="text-sm text-gray-300 mb-2">padding: 5%</p>
              <Slider
                defaultValue={[0.4]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.1, label: "10%" },
                  { value: 0.3, label: "30%" },
                  { value: 0.5, label: "50%" },
                  { value: 0.7, label: "70%" },
                  { value: 0.9, label: "90%" },
                ]}
                indicatorPadding={5}
              />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-2">padding: 10%</p>
              <Slider
                defaultValue={[0.6]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.2, label: "20%" },
                  { value: 0.4, label: "40%" },
                  { value: 0.6, label: "60%" },
                  { value: 0.8, label: "80%" },
                ]}
                indicatorPadding={10}
              />
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-2">padding: 15%</p>
              <Slider
                defaultValue={[0.5]}
                max={1}
                step={0.01}
                indicators={[
                  { value: 0.25, label: "25%" },
                  { value: 0.5, label: "50%" },
                  { value: 0.75, label: "75%" },
                ]}
                indicatorPadding={15}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
