import React from "react"
import { cn } from "~/lib/utils"

export interface SvgIconProps extends React.SVGProps<SVGSVGElement> {
  /** 图标大小，可以是数字（像素）或字符串（CSS值） */
  size?: number | string
  /** 图标颜色 */
  color?: string
  /** 是否继承父元素的颜色 */
  inheritColor?: boolean
  /** 额外的CSS类名 */
  className?: string
  /** SVG文件路径 */
  src: string
}

export const SvgIcon = React.forwardRef<SVGSVGElement, SvgIconProps>(
  (
    { size = 24, color, inheritColor = false, className, src, ...props },
    ref
  ) => {
    const sizeValue = typeof size === "number" ? `${size}px` : size

    return (
      <svg
        ref={ref}
        width={sizeValue}
        height={sizeValue}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "inline-block",
          {
            "text-current": inheritColor,
          },
          className
        )}
        style={{
          color: inheritColor ? undefined : color,
        }}
        {...props}
      >
        <use href={src} />
      </svg>
    )
  }
)

SvgIcon.displayName = "SvgIcon"

export default SvgIcon
