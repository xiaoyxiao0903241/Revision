import {
  darkTheme,
  getDefaultConfig,
  Locale,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import {
  metaMaskWallet,
  okxWallet,
  tokenPocketWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { custom, http } from 'viem';
import { WagmiProvider } from 'wagmi';
import {
  arbitrum,
  base,
  bsc,
  bscTestnet,
  linea,
  mainnet,
  polygon,
} from 'wagmi/chains';
import { useLanguage } from '~/i18n/LanguageProvider';

// 定义钱包接口类型，兼容 viem 的 EthereumProvider
interface WalletProvider {
  isMetaMask?: boolean;
  isOKExWallet?: boolean;
  request: (...args: any) => Promise<any>;
  on?: (event: string, listener: (...args: any[]) => void) => void;
  removeListener?: (event: string, listener: (...args: any[]) => void) => void;
}

interface ExtendedWindow extends Window {
  ethereum?: WalletProvider;
  okxwallet?: WalletProvider;
}

const queryClient = new QueryClient();

const customTheme = darkTheme({
  accentColor: '#FF8908',
  accentColorForeground: 'white',
  borderRadius: 'large',
  fontStack: 'system',
  overlayBlur: 'small',
});
// 测试
const getRainbowLocale = (locale: string): Locale => {
  switch (locale) {
    case 'zh':
    case 'zh-CN':
      return 'zh-CN';
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'fr':
      return 'fr';
    case 'de':
      return 'de';
    case 'es':
      return 'es';
    case 'pt':
      return 'pt';
    case 'ru':
      return 'ru';
    case 'tr':
      return 'tr';
    case 'vi':
      return 'vi';
    case 'th':
      return 'th';
    case 'zh-hk':
      return 'zh-HK';
    case 'en':
    default:
      return 'en';
  }
};

export function RainbowProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLanguage();
  const [currentLang, setCurrentLang] = useState(locale);

  useEffect(() => {
    setCurrentLang(locale);
  }, [locale]);

  const rainbowLocale = getRainbowLocale(currentLang || 'en');

  /**
   * 动态创建 transports，优先使用注入钱包而非 WalletConnect
   * SSR 阶段只能用 http，CSR 阶段优先检测并使用注入的钱包
   */
  const transports = useMemo(() => {
    // 首先检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      // SSR 环境，只使用 HTTP transports
      return {
        [bsc.id]: http(
          'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        ),
        [bscTestnet.id]: http(
          'https://bnb-testnet.g.alchemy.com/v2/U6TYKzMUzYgeLnljgneV2'
        ),
        [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
        [polygon.id]: http('https://polygon-rpc.com'),
        [arbitrum.id]: http('https://1rpc.io/arb'),
        [base.id]: http('https://base-rpc.publicnode.com'),
        [linea.id]: http('https://1rpc.io/linea'),
      };
    }

    const extendedWindow = window as ExtendedWindow;

    // 优先检测 OKX 钱包注入
    if (
      typeof extendedWindow.okxwallet === 'object' &&
      extendedWindow.okxwallet?.isOKExWallet
    ) {
      return {
        [bsc.id]: http(
          'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        ),
        [bscTestnet.id]: custom(extendedWindow.okxwallet),
        [mainnet.id]: custom(extendedWindow.okxwallet),
        [polygon.id]: custom(extendedWindow.okxwallet),
        [arbitrum.id]: custom(extendedWindow.okxwallet),
        [base.id]: custom(extendedWindow.okxwallet),
        [linea.id]: custom(extendedWindow.okxwallet),
      };
    }

    // 检测 MetaMask 钱包注入
    if (
      typeof extendedWindow.ethereum === 'object' &&
      extendedWindow.ethereum?.isMetaMask
    ) {
      return {
        [bsc.id]: custom(extendedWindow.ethereum),
        [bscTestnet.id]: custom(extendedWindow.ethereum),
        [mainnet.id]: custom(extendedWindow.ethereum),
        [polygon.id]: custom(extendedWindow.ethereum),
        [arbitrum.id]: custom(extendedWindow.ethereum),
        [base.id]: custom(extendedWindow.ethereum),
        [linea.id]: custom(extendedWindow.ethereum),
      };
    }

    // 检测其他注入的钱包（通用 ethereum 对象）
    if (extendedWindow.ethereum) {
      return {
        [bsc.id]: custom(extendedWindow.ethereum),
        [bscTestnet.id]: custom(extendedWindow.ethereum),
        [mainnet.id]: custom(extendedWindow.ethereum),
        [polygon.id]: custom(extendedWindow.ethereum),
        [arbitrum.id]: custom(extendedWindow.ethereum),
        [base.id]: custom(extendedWindow.ethereum),
        [linea.id]: custom(extendedWindow.ethereum),
      };
    }

    // 没有检测到注入钱包时，使用 HTTP transports 作为后备方案
    return {
      [bsc.id]: http('https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'),
      [bscTestnet.id]: http(
        'https://bnb-testnet.g.alchemy.com/v2/U6TYKzMUzYgeLnljgneV2'
      ),
      [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
      [polygon.id]: http('https://polygon-rpc.com'),
      [arbitrum.id]: http('https://1rpc.io/arb'),
      [base.id]: http('https://base-rpc.publicnode.com'),
      [linea.id]: http('https://1rpc.io/linea'),
    };
  }, []);

  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: 'OLYONE Finance',
        projectId: '7dca20fa6560d3a1c1957bbed71fc580',
        chains: [mainnet, bsc, polygon, arbitrum, base, linea],
        transports,
        ssr: true,
        appDescription: 'OLYONE Finance DApp',
        appUrl: 'https://app.olyonedao.com',
        appIcon: '/favicon.ico',
        wallets: [
          {
            groupName: 'Recommended',
            wallets: [
              metaMaskWallet,
              tokenPocketWallet,
              okxWallet,
              walletConnectWallet,
              // imTokenWallet,
            ],
          },
        ],
      }),
    [transports]
  );

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={customTheme}
          initialChain={bsc}
          appInfo={{
            appName: 'OLYONE Finance',
            learnMoreUrl: 'https://walletguide.walletconnect.network/',
          }}
          locale={rainbowLocale}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
