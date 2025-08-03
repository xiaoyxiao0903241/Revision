import { FC } from "react"
import Logo from "~/assets/logo.svg"
import { cn } from "~/lib/utils"
export const RoundedLogo: FC<{
  className?: string
}> = ({ className }) => {
  return (
    <div
      className={cn(
        "rounded-full bg-[#D9BFFF] w-8 h-8 flex items-center justify-center",
        className
      )}
    >
      <Logo className="w-11/12" />
    </div>
  )
}
