import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
  Locale,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { http, custom } from 'viem';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  // bscTestnet,
  bsc,
  mainnet,
  polygon,
  arbitrum,
  base,
  linea,
} from 'wagmi/chains';
import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '~/i18n/LanguageProvider';

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

  // 动态创建 transports，SSR 阶段只能用 http，CSR 阶段优先用 window.ethereum
  const transports = useMemo(() => {
    if (
      typeof window !== 'undefined' &&
      typeof (window as any).okxwallet === 'object' &&
      (window as any).okxwallet?.isOKExWallet
    ) {
      console.log('okxwallet');
      console.log(window);
      return {
        // [bsc.id]: custom(window.ethereum),
        [bsc.id]: http(
          'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        ),
        // [bscTestnet.id]: custom(window.ethereum),
        [mainnet.id]: custom(window.ethereum),
        [polygon.id]: custom(window.ethereum),
        [arbitrum.id]: custom(window.ethereum),
        [base.id]: custom(window.ethereum),
        [linea.id]: custom(window.ethereum),
        // [bsc.id]: http(
        //   'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        // ),
        // [bscTestnet.id]: http(
        //   'https://bnb-testnet.g.alchemy.com/v2/U6TYKzMUzYgeLnljgneV2'
        // ),
        // [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
        // [polygon.id]: http('https://polygon-rpc.com'),
        // [arbitrum.id]: http('https://1rpc.io/arb'),
        // [base.id]: http('https://base-rpc.publicnode.com'),
        // [linea.id]: http('https://1rpc.io/linea'),
      };
    }

    if (
      typeof window !== 'undefined' &&
      typeof (window as any).ethereum === 'object' &&
      (window as any).ethereum?.isMetaMask
    ) {
      return {
        // [bsc.id]: custom(window.ethereum),
        // [bsc.id]: http(
        //   'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        // ),
        [bsc.id]: custom(window.ethereum),
        [mainnet.id]: custom(window.ethereum),
        [polygon.id]: custom(window.ethereum),
        [arbitrum.id]: custom(window.ethereum),
        [base.id]: custom(window.ethereum),
        [linea.id]: custom(window.ethereum),
        // [bsc.id]: http(
        //   'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        // ),
        // [bscTestnet.id]: http(
        //   'https://bnb-testnet.g.alchemy.com/v2/U6TYKzMUzYgeLnljgneV2'
        // ),
        // [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
        // [polygon.id]: http('https://polygon-rpc.com'),
        // [arbitrum.id]: http('https://1rpc.io/arb'),
        // [base.id]: http('https://base-rpc.publicnode.com'),
        // [linea.id]: http('https://1rpc.io/linea'),
      };
    }

    if (typeof window !== 'undefined' && window.ethereum) {
      return {
        [bsc.id]: custom(window.ethereum),
        // [bscTestnet.id]: custom(window.ethereum),
        [mainnet.id]: custom(window.ethereum),
        [polygon.id]: custom(window.ethereum),
        [arbitrum.id]: custom(window.ethereum),
        [base.id]: custom(window.ethereum),
        [linea.id]: custom(window.ethereum),
      };
    } else {
      return {
        [bsc.id]: http(
          'https://go.getblock.io/dafa5eaedfa54feea3fbd733aa1e3950'
        ),
        // [bscTestnet.id]: http(
        //   'https://bnb-testnet.g.alchemy.com/v2/U6TYKzMUzYgeLnljgneV2'
        // ),
        [mainnet.id]: http('https://ethereum-rpc.publicnode.com'),
        [polygon.id]: http('https://polygon-rpc.com'),
        [arbitrum.id]: http('https://1rpc.io/arb'),
        [base.id]: http('https://base-rpc.publicnode.com'),
        [linea.id]: http('https://1rpc.io/linea'),
      };
    }
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
