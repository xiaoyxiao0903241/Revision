import { createConfig, http } from 'wagmi';
// import { mainnet, sepolia, bsc, bscTestnet, polygon, polygonMumbai, arbitrum, arbitrumSepolia, optimism, optimismSepolia, base, baseSepolia, avalanche, avalancheFuji } from 'wagmi/chains'
import { polygon } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
export const config = createConfig({
  ssr: true,
  chains: [polygon],
  connectors: [
    injected({
      shimDisconnect: true,
      target: () => {
        const provider =
          typeof window !== 'undefined' ? window.ethereum : undefined;
        if (provider && /TokenPocket/i.test(navigator.userAgent)) {
          return {
            id: 'tokenpocket',
            name: 'TokenPocket',
            provider,
          };
        }
        return undefined;
      },
    }),

    injected({
      shimDisconnect: true,
      target: () => {
        const provider =
          typeof window !== 'undefined' ? window.ethereum : undefined;
        if (provider && /BitKeep/i.test(navigator.userAgent)) {
          return {
            id: 'bitkeep',
            name: 'BitKeep',
            provider,
          };
        }
        return undefined;
      },
    }),

    injected({
      shimDisconnect: true,
      target: () => {
        const provider =
          typeof window !== 'undefined' ? window.ethereum : undefined;
        return provider
          ? {
              id: 'injected',
              name: 'Injected',
              provider,
            }
          : undefined;
      },
    }),
    injected({
      shimDisconnect: true,
    }),
    // walletConnect({
    //   projectId: "9120d1fc51d664ce5f801f5198b72769", // 需要从 WalletConnect 官网获取
    //   metadata: {
    //     name: "Your App Name",
    //     description: "Your App Description",
    //     url: "https://your-app-url.com",
    //     icons: ["https://your-app-url.com/icon.png"],
    //   },
    // }),
  ],
  transports: {
    [polygon.id]: http(),
  },
});
