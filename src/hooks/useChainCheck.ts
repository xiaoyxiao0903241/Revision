import { useAccount, useChainId } from 'wagmi';
import { useCallback, useState } from 'react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';

interface UseChainCheckProps {
  requiredChainId: number;
  onChainMismatch?: () => void;
}

export function useChainCheck({
  requiredChainId,
  onChainMismatch,
}: UseChainCheckProps) {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { openChainModal } = useChainModal();
  const { openConnectModal } = useConnectModal();
  const [isSwitching, setIsSwitching] = useState(false);

  const isCorrectChain = useCallback(() => {
    return chainId === requiredChainId;
  }, [chainId, requiredChainId]);

  const checkAndSwitchChain = useCallback(async () => {
    if (isSwitching) return false;

    if (!isConnected) {
      if (!openConnectModal) {
        console.error(
          'Wallet not connected and connect modal is not available'
        );
        return false;
      }
      openConnectModal();
      return false;
    }

    if (!isCorrectChain()) {
      onChainMismatch?.();
      if (!openChainModal) {
        console.error('Chain mismatch and chain modal is not available');
        return false;
      }
      setIsSwitching(true);
      openChainModal();
      // 等待一段时间让用户完成切换
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSwitching(false);
      return false;
    }

    return true;
  }, [
    isConnected,
    isCorrectChain,
    onChainMismatch,
    openChainModal,
    openConnectModal,
    isSwitching,
  ]);

  return {
    isCorrectChain,
    checkAndSwitchChain,
    currentChainId: chainId,
    requiredChainId,
    isSwitching,
  };
}
