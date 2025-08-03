import { useUnmount } from "ahooks"
import { useMockStore } from "~/store/mock"

export const durationOptions = [7, 30, 90, 180, 360]
export const amountOptions = [
  { value: 100, desc: "7 Days" },
  { value: 200, desc: "14 Days" },
  { value: 300, desc: "30 Days" },
]

export const useMock = () => {
  const { amount, duration } = useMockStore()
  const setDuration = (duration?: number) => {
    useMockStore.setState({ duration })
  }
  const setAmount = (amount?: number) => {
    useMockStore.setState({ amount })
  }
  useUnmount(() => {
    useMockStore.setState({
      amount: undefined,
      duration: undefined,
    })
  })
  return { amount, duration, setDuration, setAmount }
}
