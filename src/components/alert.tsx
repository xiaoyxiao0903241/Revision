import { cn } from "~/lib/utils"
import { Icon, IconFontName } from "./icon"
import Info from "~/assets/info.svg"
export function Alert({
  className,
  icon,
  title,
  description,
  ...props
}: React.ComponentProps<"div"> & {
  icon: IconFontName
  title: string
  description: string
}) {
  return (
    <div className="nine-patch-frame alert relative w-full">
      <div
        className={cn("text-foreground flex flex-row gap-6 p-6", className)}
        {...props}
      >
        <div className="bg-[#6357F4] flex w-10 h-10 items-center justify-center rounded-md">
          <Icon name={icon} size={30} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold uppercase">{title}</h3>
          <p className="text-xs text-foreground/70">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function Notification({ children }: React.ComponentProps<"div">) {
  return (
    <div className="flex gap-1 w-full text-warning">
      <Info className="w-4 h-4 text-warning" />
      <span className="text-xs flex-1 text-warning">{children}</span>
    </div>
  )
}
