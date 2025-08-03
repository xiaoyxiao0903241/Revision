import { useUnmount } from "ahooks"
import { useMockStore } from "~/store/mock"

export const durationOptions = [7, 30, 90, 180, 360]
export const amountOptions = [
  { value: 100, desc: "7 Days" },
  { value: 200, desc: "14 Days" },
  { value: 300, desc: "30 Days" },
]

export const stakingRecords = [
  {
    id: 1,
    event: "Claim",
    transactionHash: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    amount: 1285.0,
    period: 15,
    dateTime: "2025/12/30 12:30:22",
  },
  {
    id: 2,
    event: "Unstake",
    transactionHash: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    amount: 1285.0,
    period: 0,
    dateTime: "2025/12/30 12:30:22",
  },
  {
    id: 3,
    event: "Stake1",
    transactionHash: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    amount: 1285.0,
    period: 15,
    dateTime: "2025/12/30 12:30:22",
  },
]

export const useMock = () => {
  const { amount, duration, decimal } = useMockStore()
  const setDuration = (duration?: number) => {
    useMockStore.setState({ duration })
  }
  const setAmount = (amount?: number) => {
    useMockStore.setState({ amount })
  }
  const setDecimal = (decimal?: string) => {
    useMockStore.setState({ decimal })
  }
  useUnmount(() => {
    useMockStore.setState({
      amount: undefined,
      duration: undefined,
      decimal: undefined,
    })
  })
  return { amount, duration, decimal, setDuration, setAmount, setDecimal }
}
