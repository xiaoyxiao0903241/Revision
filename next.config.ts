/** @type {import('next').NextConfig} */
import { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    useCache: true,
    useLightningcss: true,
    viewTransition: true,
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
