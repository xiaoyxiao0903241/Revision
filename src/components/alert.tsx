import { cn } from "~/lib/utils"
import { Icon, IconFontName } from "./icon"
import Info from "~/assets/info.svg"
import { ReactNode } from "react"
export function Alert({
  className,
  icon,
  title,
  description,
  iconSize = 28,
  ...props
}: React.ComponentProps<"div"> & {
  icon: IconFontName
  title: string
  description: string
  iconSize?: number
}) {
  return (
    <div className="nine-patch-frame alert relative w-full">
      <div
        className={cn("text-foreground flex flex-row gap-6 p-6", className)}
        {...props}
      >
        <div className="bg-[#6357F4] flex w-10 h-10 min-w-10 min-h-10 items-center justify-center rounded-md">
          <Icon name={icon} size={iconSize} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold uppercase">{title}</h3>
          <p className="text-xs text-foreground/70">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function Notification({ children }: { children: string | ReactNode }) {
  const parts =
    typeof children === "string" ? children.split("\\n") : [children]
  return (
    <div className="flex gap-1 w-full text-warning">
      <Info className="w-3 h-3 text-warning mt-1" />
      <div className="flex flex-col gap-1">
        {parts.map((part, index) => (
          <span key={index} className="text-xs flex-1 text-warning">
            {part}
          </span>
        ))}
      </div>
    </div>
  )
}
