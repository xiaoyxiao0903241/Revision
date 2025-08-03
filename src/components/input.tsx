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
  value,
  onChange,
  maxDecimals = 6,
  ...props
}: InputNumberProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // 允许空字符串
    if (inputValue === "") {
      onChange?.(inputValue)
      return
    }

    // 允许单个负号
    if (inputValue === "-") {
      onChange?.(inputValue)
      return
    }

    // 允许单个小数点
    if (inputValue === ".") {
      onChange?.(inputValue)
      return
    }

    // 允许负号开头的小数点
    if (inputValue === "-.") {
      onChange?.(inputValue)
      return
    }

    // 检查是否只包含数字、小数点和负号
    const validChars = /^[-.\d]+$/
    if (!validChars.test(inputValue)) {
      console.log("Invalid chars:", inputValue)
      return
    }

    // 防止多个负号
    const minusCount = (inputValue.match(/-/g) || []).length
    if (minusCount > 1) {
      console.log("Multiple minus signs")
      return
    }

    // 防止负号不在开头
    if (minusCount === 1 && !inputValue.startsWith("-")) {
      console.log("Minus not at start")
      return
    }

    // 防止多个小数点
    const dotCount = (inputValue.match(/\./g) || []).length
    if (dotCount > 1) {
      console.log("Multiple dots")
      return
    }

    // 检查小数位数（只有当小数点后有数字时才检查）
    if (inputValue.includes(".")) {
      const parts = inputValue.split(".")
      if (parts.length === 2 && parts[1] && parts[1].length > maxDecimals) {
        console.log("Too many decimals")
        return
      }
    }

    // 允许所有有效的数字格式
    console.log("Valid input:", inputValue)
    onChange?.(inputValue)
  }

  return (
    <InputBase
      type="text"
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
