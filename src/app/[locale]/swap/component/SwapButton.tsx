import { Button } from "~/components/button";

interface SwapButtonProps {
  amount: string;
  isSwapping: boolean;
  isApproving: boolean;
  isCheckingApproval: boolean;
  needsApproval: boolean;
  onSwap: () => Promise<void>;
}

export default function SwapButton({
  amount,
  isSwapping,
  isApproving,
  isCheckingApproval,
  needsApproval,
  onSwap,
}: SwapButtonProps) {
  return (
    <div className="flex items-center w-full box-border justify-between">
      {needsApproval && (
        <Button
          clipDirection="topRight-bottomLeft"
          className="font-mono w-[50%]"
          onClick={onSwap}
          variant={
            !amount ||
            parseFloat(amount) <= 0 ||
            isApproving ||
            isCheckingApproval ||
            !needsApproval
              ? "disabled"
              : "primary"
          }
          disabled={
            !amount ||
            parseFloat(amount) <= 0 ||
            isApproving ||
            isCheckingApproval ||
            !needsApproval
          }
        >
          {isCheckingApproval
            ? "检查授权"
            : isApproving
              ? "授权中..."
              : needsApproval
                ? "授权"
                : "授权"}
        </Button>
      )}
      <Button
        clipDirection="topRight-bottomLeft"
        className={`${needsApproval ? "w-[calc(50%-5px)]" : "w-full"} `}
        onClick={onSwap}
        variant={
          !amount ||
          parseFloat(amount) <= 0 ||
          isSwapping ||
          isCheckingApproval ||
          needsApproval
            ? "disabled"
            : "primary"
        }
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          isSwapping ||
          isCheckingApproval ||
          needsApproval
        }
      >
        {isSwapping ? "兑换中..." : "兑换"}
      </Button>
    </div>
  );
}
