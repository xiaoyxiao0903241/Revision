'use client';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useAccount, useSignMessage, useSwitchChain, useChainId } from 'wagmi';
import { login } from '~/services/auth/login';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
interface SignatureData {
  signature: string;
  message: string;
  timestamp: number;
  token: string;
  isActive: boolean; // 标记是否是主动断开
}
import { chainId as chainIdConstant } from '~/wallet/constants/tokens';

interface UserAddressContextType {
  userAddress: `0x${string}` | null;
  setUserAddress: (address: `0x${string}` | null) => void;
  isSigned: boolean;
  setIsSigned: (signed: boolean) => void;
  clearSignature: (address: `0x${string}`) => void;
  sign: (address: `0x${string}`) => Promise<void>;
}

const SIGNATURE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const SIGNATURE_STORAGE_KEY =
  process.env.NEXT_PUBLIC_SIGNATURE_STORAGE_KEY || 'olywallet_signatures';

const UserAddressContext = createContext<UserAddressContextType | undefined>(
  undefined
);

const getStoredSignatures = (): Record<string, SignatureData> => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(SIGNATURE_STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  const signatures: Record<string, SignatureData> = {};

  // 检查并删除过期的签名
  const now = Date.now();
  let hasChanges = false;

  Object.entries(parsed).forEach(([address, data]) => {
    const signatureData = data as SignatureData;
    if (
      !signatureData.isActive ||
      now - signatureData.timestamp > SIGNATURE_EXPIRY
    ) {
      hasChanges = true;
      // 只删除过期的地址，而不是整个对象
      delete parsed[address];
    } else {
      signatures[address] = signatureData;
    }
  });

  if (hasChanges) {
    localStorage.setItem(SIGNATURE_STORAGE_KEY, JSON.stringify(parsed));
  }

  return parsed;
};
// 设置签名缓存
const setStoredSignature = (address: string, data: SignatureData) => {
  const signatures = getStoredSignatures();
  signatures[address] = data;
  localStorage.setItem(SIGNATURE_STORAGE_KEY, JSON.stringify(signatures));
};

const isSignatureValid = (data: SignatureData): boolean => {
  return data.isActive && Date.now() - data.timestamp < SIGNATURE_EXPIRY;
};

export const UserAddressProvider = ({ children }: { children: ReactNode }) => {
  const { address: currentAddress, isConnected, isConnecting } = useAccount();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [userAddress, setUserAddress] = useState<`0x${string}` | null>(null);
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const isSigningRef = useRef(false);
  const lastAddressRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const lastSignTimeRef = useRef<number>(0);
  const t = useTranslations();
  const SIGN_TIMEOUT = 5 * 60 * 1000; // 5分钟超时

  const updateAuthState = useCallback(
    (address: `0x${string}` | null, signed: boolean) => {
      console.log('updateAuthState', { address, signed });
      setIsSigned(signed);
      if (signed) {
        setUserAddress(address);
      } else {
        setUserAddress(null);
      }
    },
    []
  );

  // 初始化时检查并恢复状态
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isConnecting) return; // 等待连接完成

    const restoreState = () => {
      console.log('restoreState', {
        isConnected,
        currentAddress,
        isConnecting,
      });
      if (isConnected && currentAddress) {
        const signatures = getStoredSignatures();
        console.log('signatures', signatures);
        const existingSignature = signatures[currentAddress];

        if (existingSignature && isSignatureValid(existingSignature)) {
          console.log('有效');
          updateAuthState(currentAddress, true);
        } else {
          console.log('无效');
          updateAuthState(currentAddress, false);
        }
      } else {
        updateAuthState(null, false);
      }
    };

    // 只在初始化时执行一次
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;
      restoreState();
    }

    // 监听 storage 变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SIGNATURE_STORAGE_KEY) {
        restoreState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isConnected, currentAddress, isConnecting, updateAuthState]);

  // 监听地址变化
  useEffect(() => {
    if (isConnecting) return; // 等待连接完成

    if (!isConnected) {
      updateAuthState(null, false);
      lastAddressRef.current = null;
      return;
    }

    if (!currentAddress) {
      return;
    }

    if (lastAddressRef.current === currentAddress) {
      return;
    }

    console.log('地址变化', {
      currentAddress,
      lastAddress: lastAddressRef.current,
    });
    lastAddressRef.current = currentAddress;
    updateAuthState(currentAddress, false);

    const signatures = getStoredSignatures();
    const existingSignature = signatures[currentAddress];
    lastSignTimeRef.current = 0;
    setIsRejected(false);
    if (existingSignature && isSignatureValid(existingSignature)) {
      console.log('地址变化 - 签名有效');
      updateAuthState(currentAddress, true);
    } else {
      console.log('地址变化 - 签名无效');

      updateAuthState(currentAddress, false);
    }
  }, [currentAddress, isConnected, isConnecting, updateAuthState]);

  const handleSign = useCallback(
    async (address: `0x${string}`) => {
      // 如果正在签名，直接返回
      if (isSigningRef.current) {
        return;
      }

      const now = Date.now();
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        isSigningRef.current = true;
        lastSignTimeRef.current = now;
        const message = `Welcome to OLY ONE!\n\nSign this message to verify your wallet ownership.\n\nTimestamp:${Date.now()}`;
        const signature = await signMessageAsync({ message });

        // 检查是否被取消
        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        const res = await login(address, signature, message);

        // 再次检查是否被取消
        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        if (res.code === '0') {
          const signatureData: SignatureData = {
            signature,
            message,
            timestamp: Date.now(),
            token: res.data.token,
            isActive: true,
          };
          setStoredSignature(address, signatureData);
          setIsRejected(false);
          lastSignTimeRef.current = 0; // 重置超时时间，允许后续签名请求
          updateAuthState(address, true);
          toast.success(t('common.wallet.sign_success'));
        } else {
          throw new Error(res.message || 'Login failed');
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // 请求被取消，不做处理
            return;
          }
          if (error.message.includes('User rejected')) {
            setIsRejected(true);
          }
          toast.error(t('common.wallet.rejectedSign'));
          console.error('Auto sign failed:', error.message);
        }
        updateAuthState(null, false);
      } finally {
        isSigningRef.current = false;
        abortControllerRef.current = null;
      }
    },
    [signMessageAsync, t, updateAuthState]
  );

  const clearSignature = useCallback(
    (address: `0x${string}`) => {
      const signatures = getStoredSignatures();
      const signatureData = signatures[address];
      if (signatureData) {
        signatureData.isActive = false;
        setStoredSignature(address, signatureData);
      }
      if (address === userAddress) {
        updateAuthState(null, false);
      }
    },
    [userAddress, updateAuthState]
  );

  const sign = useCallback(
    async (address: `0x${string}`) => {
      console.log('sign', address);
      await handleSign(address);
    },
    [handleSign]
  );

  // 定期检查签名是否过期
  useEffect(() => {
    const checkSignatures = async () => {
      if (!currentAddress || !isConnected) {
        updateAuthState(null, false);
        return;
      }
      if (isConnected && chainId !== chainIdConstant) {
        await switchChain({ chainId: chainIdConstant });
      }
      if (isSigningRef.current) {
        return;
      }
      const signatures = getStoredSignatures();
      const signatureData = signatures[currentAddress];

      // 如果用户拒绝过签名，直接返回
      if (isRejected) {
        return;
      }
      // 如果上次签名请求还在超时时间内，直接返回
      const now = Date.now();
      if (now - lastSignTimeRef.current < SIGN_TIMEOUT) {
        return;
      }
      // 如果签名数据存在且有效，则不进行签名
      if (signatureData && isSignatureValid(signatureData)) {
        return;
      }
      if (!signatureData) {
        updateAuthState(null, false);
      }
      console.log('isRejected', isRejected);
      // 如果签名过期或不存在，尝试重新签名
      handleSign(currentAddress).catch(() => {
        // 只有在重新签名失败时才清除状态
        updateAuthState(null, false);
      });
    };

    // 清除之前的定时器
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 设置新的定时器，每分钟检查一次
    intervalRef.current = setInterval(checkSignatures, 5 * 1000);

    // 立即执行一次检查
    checkSignatures();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    currentAddress,
    isConnected,
    handleSign,
    updateAuthState,
    isRejected,
    SIGN_TIMEOUT,
  ]);

  // 组件卸载时取消所有进行中的请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  return (
    <UserAddressContext.Provider
      value={{
        userAddress,
        setUserAddress,
        isSigned,
        setIsSigned,
        clearSignature,
        sign,
      }}
    >
      {children}
    </UserAddressContext.Provider>
  );
};

export const useUserAddress = () => {
  const context = useContext(UserAddressContext);
  if (context === undefined) {
    throw new Error('useUserAddress must be used within a UserAddressProvider');
  }
  return context;
};
