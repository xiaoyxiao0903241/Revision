/** @type {import('next').NextConfig} */
import { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    useCache: true,
    useLightningcss: true,
    viewTransition: true,
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                      removeUnknownsAndDefaults: {
                        keepRoleAttr: true,
                      },
                    },
                  },
                },
                "removeXMLNS",
              ],
            },
          },
        },
      ],
    })
    return config
  },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
