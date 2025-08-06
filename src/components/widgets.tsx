import Image from "next/image"
import { FC } from "react"
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
      <Image src="/images/widgets/logo.png" alt="logo" width={24} height={24} />
    </div>
  )
}
