import { cn } from "~/lib/utils"

export function Alert({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="nine-patch-frame alert relative">
      <div
        className={cn("text-foreground flex flex-row gap-6 p-6", className)}
        {...props}
      />
    </div>
  )
}
