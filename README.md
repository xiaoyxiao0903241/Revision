# ONE OLYONE - DeFi Staking Platform

一个基于 Next.js 的 DeFi 质押平台，具有多语言支持和现代化的 UI 设计。

## 🚀 特性

- **多语言支持** - 支持中文和英文
- **现代化 UI** - 使用 Tailwind CSS 和 shadcn/ui
- **响应式设计** - 适配各种屏幕尺寸
- **深色主题** - 符合 DeFi 平台的设计风格
- **状态管理** - 使用 Zustand 进行状态管理
- **TypeScript** - 完整的类型支持
- **二级目录结构** - 清晰的功能模块划分
- **次级导航栏** - 每个模块都有独立的次级导航

## 📁 项目结构

```
src/
├── pages/
│   ├── [locale]/           # 多语言路由
│   │   ├── layout.tsx      # 语言特定布局
│   │   ├── page.tsx        # 主页
│   │   ├── dashboard/      # 仪表板
│   │   ├── staking/        # 质押相关页面
│   │   │   ├── layout.tsx  # 质押模块布局（包含次级导航栏）
│   │   │   ├── page.tsx    # 质押主页
│   │   │   ├── unstake/    # 解质押
│   │   │   ├── claim/      # 领取奖励
│   │   │   ├── records/    # 质押记录
│   │   │   └── calculator/ # 质押计算器
│   │   ├── analytics/      # 分析相关页面
│   │   │   ├── layout.tsx  # 分析模块布局（包含次级导航栏）
│   │   │   ├── page.tsx    # 分析主页
│   │   │   ├── overview/   # 分析概览
│   │   │   ├── trading/    # 交易分析
│   │   │   ├── users/      # 用户统计
│   │   │   └── rewards/    # 收益报告
│   │   ├── community/      # 社区相关页面
│   │   │   ├── layout.tsx  # 社区模块布局（包含次级导航栏）
│   │   │   ├── page.tsx    # 社区主页
│   │   │   ├── forum/      # 社区论坛
│   │   │   ├── announcements/ # 公告
│   │   │   ├── events/     # 活动
│   │   │   └── voting/     # 投票
│   │   ├── dao/            # DAO相关页面
│   │   │   ├── layout.tsx  # DAO模块布局（包含次级导航栏）
│   │   │   ├── page.tsx    # DAO主页
│   │   │   ├── proposals/  # DAO提案
│   │   │   ├── voting/     # DAO投票
│   │   │   ├── governance/ # DAO治理
│   │   │   └── history/    # DAO历史
│   │   └── test/           # 测试页面
│   └── layout.tsx          # 根布局
├── components/
│   ├── icons/              # 图标组件
│   ├── layout/             # 布局组件
│   ├── staking/            # 质押相关组件
│   └── ui/                 # shadcn/ui 组件
├── i18n/                   # 多语言配置
│   ├── request.ts          # next-intl 配置
│   └── locales/            # 语言包
└── store/                  # 状态管理
```

## 🛠️ 技术栈

- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **组件库**: shadcn/ui
- **国际化**: next-intl
- **状态管理**: Zustand
- **图标**: Lucide React

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 访问应用

- **中文版**: http://localhost:3000/zh
- **英文版**: http://localhost:3000/en
- **测试页面**: http://localhost:3000/zh/test

## 📱 页面说明

### 主页 (/)

- 平台介绍和快速导航

### 质押模块 (/staking)

- **质押主页** (/staking) - 质押表单和信息显示
- **解质押** (/staking/unstake) - 解质押功能
- **领取奖励** (/staking/claim) - 领取质押奖励
- **质押记录** (/staking/records) - 查看质押历史
- **质押计算器** (/staking/calculator) - 收益计算工具

### 分析模块 (/analytics)

- **分析主页** (/analytics) - 分析功能概览
- **分析概览** (/analytics/overview) - 数据概览
- **交易分析** (/analytics/trading) - 交易数据分析
- **用户统计** (/analytics/users) - 用户行为分析
- **收益报告** (/analytics/rewards) - 收益数据分析

### 社区模块 (/community)

- **社区主页** (/community) - 社区功能概览
- **社区论坛** (/community/forum) - 用户交流平台
- **公告** (/community/announcements) - 官方公告
- **活动** (/community/events) - 社区活动
- **投票** (/community/voting) - 社区投票

### DAO 模块 (/dao)

- **DAO 主页** (/dao) - DAO 功能概览
- **DAO 提案** (/dao/proposals) - 治理提案
- **DAO 投票** (/dao/voting) - 治理投票
- **DAO 治理** (/dao/governance) - 治理机制
- **DAO 历史** (/dao/history) - 治理历史

### 仪表板 (/dashboard)

- 用户数据概览（开发中）

### 测试页面 (/test)

- 多语言功能测试

## 🎨 设计特点

- **深色主题**: 符合 DeFi 平台的现代设计
- **紫色主题色**: 与品牌色彩保持一致
- **响应式布局**: 适配不同屏幕尺寸
- **图标系统**: 使用 Lucide React 图标库
- **二级目录结构**: 清晰的功能模块划分
- **次级导航栏**: 每个模块都有独立的次级导航栏

## 🌐 多语言支持

项目支持中文和英文两种语言：

- 语言切换通过顶部导航栏的语言选择器
- 语言包存储在 `src/i18n/locales/` 目录
- 使用 `next-intl` 进行国际化管理

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/[locale]/` 下创建新的页面目录
2. 添加 `page.tsx` 文件
3. 在侧边栏导航中添加对应的链接

### 添加新语言

1. 在 `src/i18n/locales/` 下创建新的语言包文件
2. 更新 `src/i18n/request.ts` 中的 locales 数组
3. 更新 `middleware.ts` 中的配置

### 添加新组件

1. 在 `src/components/` 下创建组件目录
2. 使用 TypeScript 和 Tailwind CSS
3. 遵循项目的命名约定

## 📦 构建和部署

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
