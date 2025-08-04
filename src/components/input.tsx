import * as React from "react"

import { cn } from "~/lib/utils"

function InputBase({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full bg-transparent outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // 隐藏 number 类型的上下箭头
        "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0",
        // Firefox 隐藏上下箭头
        "[&::-moz-number-spin-box]:appearance-none",
        className
      )}
      {...props}
    />
  )
}

interface InputNumberProps
  extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: string | number
  onChange?: (value: string) => void
  maxDecimals?: number
}

function InputNumber({
  className,
  value = "",
  onChange,
  maxDecimals = 6,
  ...props
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    console.log(inputValue)
    // 允许空字符串
    if (inputValue === "") {
      onChange?.(inputValue)
      return
    }

    // 检查小数位数（只有当小数点后有数字时才检查）
    if (inputValue.includes(".")) {
      const parts = inputValue.split(".")
      if (parts.length === 2 && parts[1] && parts[1].length > maxDecimals) {
        return
      }
    }

    // 浏览器原生 number 类型已经处理了其他验证
    onChange?.(inputValue)
  }

  return (
    <InputBase
      type="number"
      inputMode="decimal"
      value={value}
      onChange={handleChange}
      className={className}
      {...props}
    />
  )
}

export const Input = Object.assign(InputBase, {
  Number: InputNumber,
})
