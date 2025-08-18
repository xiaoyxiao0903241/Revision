import { useTranslations } from 'next-intl';
import { Button } from '~/components/button';

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
  const t = useTranslations('swap');
  return (
    <div className='flex items-center w-full box-border justify-between gap-x-4'>
      {needsApproval && (
        <Button
          clipDirection='topRight-bottomLeft'
          className='font-mono w-[50%]'
          onClick={onSwap}
          variant={
            !amount ||
            parseFloat(amount) <= 0 ||
            isApproving ||
            isCheckingApproval ||
            !needsApproval
              ? 'disabled'
              : 'primary'
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
            ? t('checking_approval')
            : isApproving
              ? t('approving')
              : needsApproval
                ? t('approve')
                : t('approve')}
        </Button>
      )}
      <Button
        clipDirection='topRight-bottomLeft'
        className={`${needsApproval ? 'w-[calc(50%-5px)]' : 'w-full'} `}
        onClick={onSwap}
        variant={
          !amount ||
          parseFloat(amount) <= 0 ||
          isSwapping ||
          isCheckingApproval ||
          needsApproval
            ? 'disabled'
            : 'primary'
        }
        disabled={
          !amount ||
          parseFloat(amount) <= 0 ||
          isSwapping ||
          isCheckingApproval ||
          needsApproval
        }
      >
        {isSwapping ? t('swapping') : t('swap')}
      </Button>
    </div>
  );
}
