# Icon 组件文档

## 概述

Icon 组件是基于 iconfont 字体图标的 React 组件，支持 20 个自定义图标，提供丰富的自定义选项和交互功能。

## 支持的图标

组件支持以下 20 个图标：

- `analytics` - 数据分析
- `community` - 社区
- `dashboard` - 仪表板
- `event` - 事件
- `lp-bonds` - LP 债券
- `locked-staking` - 锁定质押
- `swap` - 交换
- `cooling-pool` - 冷却池
- `staking` - 质押
- `dao` - DAO
- `treasury-bonds` - 国库债券
- `turbine` - 涡轮
- `documents` - 文档
- `bnb` - BNB
- `unstake` - 解除质押
- `calculator` - 计算器
- `claim` - 领取
- `stake` - 质押
- `clock` - 时钟
- `record` - 记录

## 基本用法

```tsx
import { Icon } from "~/components"

// 基础用法
<Icon name="analytics" />

// 自定义尺寸
<Icon name="calculator" size={24} />

// 自定义颜色
<Icon name="claim" color="#10b981" />

// 可点击图标
<Icon
  name="swap"
  onClick={() => console.log('点击了交换图标')}
/>
```

## Props

| 属性        | 类型                  | 默认值  | 说明                                        |
| ----------- | --------------------- | ------- | ------------------------------------------- |
| `name`      | `IconFontName`        | -       | 图标名称（必需）                            |
| `className` | `string`              | -       | 自定义 CSS 类名                             |
| `size`      | `number \| string`    | `16`    | 图标大小，可以是数字（px）或 CSS 尺寸字符串 |
| `color`     | `string`              | -       | 图标颜色                                    |
| `onClick`   | `() => void`          | -       | 点击事件处理函数                            |
| `disabled`  | `boolean`             | `false` | 是否禁用                                    |
| `style`     | `React.CSSProperties` | -       | 自定义样式对象                              |

## 高级用法

### 禁用状态

```tsx
<Icon name="lp-bonds" disabled />
```

### 自定义样式

```tsx
<Icon
  name="turbine"
  size={32}
  color="#84cc16"
  className="hover:opacity-80 transition-opacity"
  style={{ transform: "rotate(45deg)" }}
/>
```

### 键盘可访问性

当提供 `onClick` 属性时，图标会自动支持键盘导航：

```tsx
<Icon
  name="documents"
  onClick={() => handleClick()}
  // 自动支持 Enter 和 Space 键触发点击
/>
```

## 导出内容

组件还导出了以下内容：

```tsx
import { Icon, ICON_NAMES, ICON_COUNT, type IconFontName } from "~/components"

// ICON_NAMES - 所有图标名称的数组
console.log(ICON_NAMES) // ['analytics', 'community', ...]

// ICON_COUNT - 图标总数
console.log(ICON_COUNT) // 20

// IconFontName - TypeScript 类型
const iconName: IconFontName = "analytics"
```

## 实际应用示例

### 导航菜单

```tsx
const menuItems = [
  { icon: "dashboard", label: "仪表板", href: "/dashboard" },
  { icon: "analytics", label: "数据分析", href: "/analytics" },
  { icon: "community", label: "社区", href: "/community" },
  { icon: "dao", label: "DAO", href: "/dao" },
]

{
  menuItems.map((item) => (
    <Link key={item.href} href={item.href}>
      <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg">
        <Icon name={item.icon} size={20} />
        <span>{item.label}</span>
      </div>
    </Link>
  ))
}
```

### 状态指示器

```tsx
const statusConfig = {
  staking: { icon: "stake", color: "#3b82f6", label: "质押中" },
  cooling: { icon: "clock", color: "#f59e0b", label: "冷却中" },
  ready: { icon: "claim", color: "#10b981", label: "可领取" },
}

{
  Object.entries(statusConfig).map(([status, config]) => (
    <div key={status} className="flex items-center gap-2">
      <Icon name={config.icon} size={16} color={config.color} />
      <span className="text-sm">{config.label}</span>
    </div>
  ))
}
```

### 操作按钮

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
  <Icon name="stake" size={16} />
  <span>开始质押</span>
</button>
```

## 技术实现

- 基于 iconfont 字体图标
- 使用 CSS `@font-face` 加载字体文件
- 通过 unicode 编码直接显示图标（不使用 CSS `:before` 伪元素）
- 支持 TypeScript 类型检查
- 遵循无障碍访问标准

### CSS 结构优化

为了减少冗余，我们只保留了必要的 CSS 定义：

```css
/* 字体定义 */
@font-face {
  font-family: "iconfont";
  src: url("/fonts/iconfont.woff2") format("woff2"), url("/fonts/iconfont.woff")
      format("woff"), url("/fonts/iconfont.ttf") format("truetype");
}

/* 基础样式 */
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**注意**：我们移除了所有 `.icon-xxx:before` 类，因为组件直接使用 unicode 编码，这样更高效且减少了 CSS 文件大小。

## 字体文件

组件依赖以下字体文件（位于 `public/fonts/` 目录）：

- `iconfont.woff2` - Web Open Font Format 2.0
- `iconfont.woff` - Web Open Font Format
- `iconfont.ttf` - TrueType Font

字体定义已集成到 `src/app/globals.css` 中。
