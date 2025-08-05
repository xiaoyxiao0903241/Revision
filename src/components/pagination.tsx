import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "~/lib/utils"

// 智能分页逻辑
const generatePaginationItems = (currentPage: number, totalPages: number) => {
  const items: Array<number | "ellipsis"> = []

  if (totalPages <= 6) {
    // 如果总页数小于等于6，显示所有页码
    for (let i = 1; i <= totalPages; i++) {
      items.push(i)
    }
  } else {
    // 总页数大于6，根据当前页位置动态调整按钮数量
    // 两侧显示5个，中间显示6个

    if (currentPage === 1) {
      // 第一个：oxxxx (5个)
      items.push(1, 2, 3, 4, totalPages)
    } else if (currentPage === totalPages) {
      // 最后一个：xxxxo (5个)
      items.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else if (currentPage === 2) {
      // 第二个：xoxxx (5个)
      items.push(1, 2, 3, 4, totalPages)
    } else if (currentPage === totalPages - 1) {
      // 倒数第二个：xxxox (5个)
      items.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      // 中间位置：xoxxx 或 xxoxx (6个)
      // 如果当前页靠左（距离左边界的距离小于等于距离右边界的距离）
      if (currentPage - 1 <= totalPages - currentPage) {
        // xoxxx 模式 (6个)
        items.push(
          1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3,
          totalPages
        )
      } else {
        // xxoxx 模式 (6个)
        items.push(
          1,
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          totalPages
        )
      }
    }

    // 添加省略号（如果需要）
    // 检查第一个数字是否与第1页有间隔
    if (items.length > 0 && typeof items[0] === "number" && items[0] > 1) {
      items.unshift("ellipsis")
    }
    // 检查最后一个数字是否与最后1页有间隔
    const lastItem = items[items.length - 1]
    if (
      items.length > 0 &&
      typeof lastItem === "number" &&
      lastItem < totalPages
    ) {
      items.push("ellipsis")
    }

    // 检查中间是否有间隔需要省略号
    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i]
      const next = items[i + 1]
      if (
        typeof current === "number" &&
        typeof next === "number" &&
        next - current > 1
      ) {
        // 在当前位置插入省略号
        items.splice(i + 1, 0, "ellipsis")
        i++ // 跳过刚插入的省略号
      }
    }
  }

  return items
}

// Pager 组件
interface PagerProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showPreviousNext?: boolean
}

const Pager = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPreviousNext = true,
}: PagerProps) => {
  const paginationItems = generatePaginationItems(currentPage, totalPages)

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center p-6", className)}
    >
      <ul className="flex flex-row items-center gap-1 text-foreground/50">
        {showPreviousNext && (
          <li>
            <button
              onClick={handlePrevious}
              disabled={currentPage <= 1}
              className={cn(
                "flex h-9 w-9 items-center justify-center bg-transparent text-sm font-medium transition-colors hover:text-foreground/80 disabled:pointer-events-none disabled:opacity-50",
                "text-foreground/50"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </li>
        )}

        {paginationItems.map((item, index) => (
          <li key={index}>
            {item === "ellipsis" ? (
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(item)}
                className={cn(
                  "flex h-9 w-9 items-center justify-center text-sm font-medium transition-colors hover:text-foreground/80",
                  item === currentPage
                    ? "bg-secondary text-white hover:bg-secondary/80 rounded-sm"
                    : "bg-transparent text-foreground/50"
                )}
              >
                {item}
              </button>
            )}
          </li>
        ))}

        {showPreviousNext && (
          <li>
            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages}
              className={cn(
                "flex h-9 w-9 items-center justify-center bg-transparent text-sm font-medium transition-colors hover:text-foreground/80 disabled:pointer-events-none disabled:opacity-50",
                "text-foreground/50"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}

export { Pager }
