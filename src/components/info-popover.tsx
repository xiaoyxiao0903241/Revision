import { FC, useState } from "react"
import InfoIcon from "~/assets/info.svg"
import { cn } from "~/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
export const InfoPopover: FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <InfoIcon className="text-foreground/50 w-6 h-6 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className={cn("w-52", className)}>
        {children}
      </PopoverContent>
    </Popover>
  )
}
