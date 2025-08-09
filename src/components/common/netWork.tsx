import Image from "next/image";
import { useChainId, useAccount } from "wagmi";
import { View } from "~/components";
import { useMemo } from "react";
import { chainId as chainIdConst } from "~/wallet/constants/tokens";
import { useTranslations } from "next-intl";
interface NetworkInfo {
  name: string;
  icon: string;
  iconBackground?: string;
  color: string;
  isSupported: boolean;
}

// 网络配置映射
const NETWORK_CONFIG: Record<
  number,
  { icon: string; iconBackground?: string }
> = {
  56: { icon: "/imgs/common/bnb_logo.svg", iconBackground: "#F3BA2F" }, // BSC Mainnet
  97: { icon: "/imgs/common/bnb_logo.svg", iconBackground: "#F3BA2F" }, // BSC Testnet
};

export default function NetWork() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  // const { openChainModal } = useChainModal();
  const t = useTranslations("netWork");
  const currentNetwork: NetworkInfo = useMemo(() => {
    if (!isConnected) {
      return {
        name: t("NotConnected"),
        icon: "/imgs/common/bnb_logo.svg",
        color: "#999999",
        isSupported: false,
      };
    }
    // 直接从 NETWORK_CONFIG 查找
    const networkConfig = NETWORK_CONFIG[chainId];
    // 从useConfig中获取icon
    if (!networkConfig && chainId !== chainIdConst) {
      return {
        name: t("noSupport"),
        icon: "/imgs/common/bnb_logo.svg",
        color: "#ff6b6b",
        isSupported: false,
      };
    }
    // 你可以自定义链名
    let name = "";
    switch (chainId) {
      case 56:
        name = "BSC";
        break;
      case 97:
        name = "BNB Smart Chain Testnet";
        break;
      case 1:
        name = "Ethereum";
        break;
      case 137:
        name = "Polygon";
        break;
      case 42161:
        name = "Arbitrum";
        break;
      case 8453:
        name = "Base";
        break;
      case 59144:
        name = "Linea";
        break;
      default:
        name = `Chain ${chainId}`;
    }
    return {
      name,
      icon: networkConfig.icon,
      iconBackground: networkConfig.iconBackground,
      color: "#10b981",
      isSupported: true,
    };
  }, [chainId, isConnected, t]);

  const getStatusColor = (): string => {
    if (!isConnected) return "#6b7280"; // 灰色 - 未连接
    return currentNetwork.isSupported ? "#10b981" : "#ef4444"; // 绿色 - 支持，红色 - 不支持
  };

  return (
    <>
      <View
        clipDirection="topRight-bottomLeft"
        className="flex items-center gap-2 h-12 px-6 bg-[#1b1f48] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer"
        border
        borderColor="#434c8c"
        borderWidth={1}
        title={isConnected ? t("changeNet") : t("connect")}
      >
        <div
          className="relative xl:w-8 xl:h-8 w-5 h-5 rounded-full overflow-hidden"
          style={{
            backgroundColor: currentNetwork.iconBackground || "transparent",
          }}
        >
          <Image
            src={currentNetwork.icon}
            width={32}
            height={32}
            alt={currentNetwork.name}
            className="w-full h-full rounded-full"
          />
        </div>
        <span
          className="ml-2  hidden xl:block font-medium transition-colors duration-200"
          style={{
            color: isConnected ? "#fff" : "#999999",
          }}
        >
          {currentNetwork.name}
        </span>

        {/* 网络状态指示器 */}
        <div
          className="w-3 h-3 rounded-full border-2 border-white transition-colors duration-200 ml-2 xl:mb-[4px]"
          style={{ backgroundColor: getStatusColor() }}
        />
        {/* 如果网络不支持，显示警告图标 */}
        {isConnected && !currentNetwork.isSupported && (
          <svg
            className="ml-2 w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-label={t("noSupport")}
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </View>
    </>
  );
}
