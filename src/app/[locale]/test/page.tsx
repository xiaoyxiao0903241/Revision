"use client"

import { IconExamples, Slider } from "~/components"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">组件测试页面</h1>
      <div>
        <p className="text-sm text-gray-300 mb-2">padding: 5%</p>
        <Slider
          defaultValue={[40]}
          max={100}
          step={1}
          indicators={[
            { value: 10, label: "10%" },
            { value: 30, label: "30%" },
            { value: 50, label: "50%" },
            { value: 70, label: "70%" },
            { value: 90, label: "90%" },
          ]}
        />
      </div>
      <IconExamples />
    </div>
  )
}
