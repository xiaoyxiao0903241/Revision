"use client"
import { FC, SVGProps } from "react"
import { cn } from "~/lib/utils"

import shaking from "~/assets/icons/shaking.svg"

const icons = {
  shaking,
} as const

type IconType = keyof typeof icons

type Props = {
  name: IconType
  className?: string
  active?: boolean
} & Omit<SVGProps<SVGSVGElement>, "className">

const Icon: FC<Props> = ({ name, className, active, ...svgProps }) => {
  const IconComponent = icons[name]

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent
      className={cn("flex-shrink-0", className)}
      from="red"
      to="blue"
      {...svgProps}
    />
  )
}

Icon.displayName = "Icon"

export { Icon, type IconType }
