import { Card, CardHeader, Icon } from "~/components"

export default function DemoPage() {
  return (
    <div className="space-y-8 p-8 bg-">
      <h1 className="text-3xl font-bold text-white">九宫格边框组件演示</h1>
      <Icon name="Home" />
      {/* 小尺寸演示 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">小尺寸 (300x200)</h2>
        <Card>
          <CardHeader>测试</CardHeader>
          <div className="text-white">
            <h3 className="text-lg font-medium mb-2">小尺寸容器</h3>
            <p className="text-gray-300">
              这是一个小尺寸的九宫格边框容器，边框会自动拉伸适应尺寸。
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
