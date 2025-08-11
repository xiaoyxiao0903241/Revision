// 注释掉 next-intl 的导航配置，因为项目不使用路径前缀的多语言形式（如 /en/, /zh/ 等）
// 项目使用客户端状态管理来处理多语言切换，无需路径前缀

// import { createNavigation } from 'next-intl/navigation';
// import { locales, defaultLocale } from './config';

// export const { Link, redirect, usePathname, useRouter } = createNavigation({
//   locales,
//   defaultLocale,
// });

// 如果需要使用导航功能，请直接使用 Next.js 原生的导航组件：
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
