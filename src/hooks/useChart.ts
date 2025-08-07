import { useEffect, useRef } from "react"
import ReactECharts from "echarts-for-react"

export const useChart = () => {
  const chartRef = useRef<ReactECharts>(null)
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return { chartRef }
}
