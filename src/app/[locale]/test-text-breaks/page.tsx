"use client"

import { TextWithBreaksExample } from "~/components/text-with-breaks-example"

export default function TestTextBreaksPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">TextWithBreaks 组件测试</h1>
      <TextWithBreaksExample />
    </div>
  )
}
