import { FC } from "react"
import { cn } from "~/lib/utils"

const Item: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-sm font-oxanium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const Label: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span className={cn("text-sm text-foreground/50", className)} {...props}>
      {children}
    </span>
  )
}

const Value: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn("text-sm text-white font-oxanium", className)}
      {...props}
    >
      {children}
    </span>
  )
}

const ListBase: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("flex flex-col gap-3 text-sm font-oxanium", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const List = Object.assign(ListBase, {
  Item,
  Label,
  Value,
})
