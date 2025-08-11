/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';

/**
 * Next.js 配置
 * 移除了 next-intl 插件以避免多语言路径前缀（如 /en/, /zh/ 等）
 * 项目使用客户端状态管理来处理多语言切换
 */
const nextConfig: NextConfig = {
  output: 'export',
  /**
   * 图片配置 - 禁用图片优化以兼容静态导出
   * 当使用 output: 'export' 时，Next.js 的图片优化 API 不可用
   */
  images: {
    unoptimized: true,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
  experimental: {
    reactCompiler: true,
    useCache: true,
    viewTransition: true,
    optimizeCss: true,
    optimizePackageImports: [
      '@tanstack/react-query',
      'next-intl',
      'viem',
      'recharts',
      'wagmi',
    ],
    // optimizeServerReact: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  /**
   * Webpack 配置 - 处理 SVG 文件
   * 使用 @svgr/webpack 将 SVG 转换为 React 组件
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeUnknownsAndDefaults: {
                        keepRoleAttr: true,
                      },
                    },
                  },
                },
                'removeXMLNS',
              ],
            },
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
