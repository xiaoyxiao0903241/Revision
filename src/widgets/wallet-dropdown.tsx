"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button, Icon, IconFontName, Segments } from "~/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu";
import {
  cn,
  formatAddress,
  fallbackCopyText,
  formatNumbedecimalScale,
} from "~/lib/utils";
import { useAccount } from "wagmi";
import ClipboardJS from "clipboard";
import { useTokenBalance } from "~/hooks/useTokenBalance";
import { TOKEN_ADDRESSES } from "~/wallet/constants/tokens";
import { useBalance } from "wagmi";
import { formatUnits } from "viem";
import { bnbPrice } from "~/services/auth/head";
import { useQuery } from "@tanstack/react-query";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { getTokenPrice } from "~/wallet/lib/web3/bond";
import { toast } from "sonner";

interface WalletAsset {
  symbol: string;
  name: string;
  balance: string;
  value: string | number;
  icon: string;
  chain: string;
}

interface PositionItem {
  type: string;
  name: string;
  amount: string;
  value: string;
  icon: IconFontName;
  className: string;
}

interface WalletDropdownProps {
  children: React.ReactNode;
  handleDisconnect: () => void;
}

export function WalletDropdown({
  children,
  handleDisconnect,
}: WalletDropdownProps) {
  const t = useTranslations("common");
  const tcopy = useTranslations("invite");

  const [activeTab, setActiveTab] = useState("wallet");
  const [copeA, setcopeA] = useState(1);
  const [copeB, setcopeB] = useState(1);
  const { address } = useAccount();
  const addressClipboardRef = useRef<ClipboardJS | null>(null);
  const { userAddress } = useUserAddress();
  const [walletAssets, setWalletAssets] = useState<WalletAsset[]>([]);

  const { balance: olyBalance } = useTokenBalance({
    tokenAddress: TOKEN_ADDRESSES.OLY as `0x${string}`,
  });

  const { balance: daiBalance } = useTokenBalance({
    tokenAddress: TOKEN_ADDRESSES.DAI as `0x${string}`,
  });

  const { data: bnbBalance } = useBalance({
    address: address as `0x${string}`,
  });

  // 模拟持仓数据
  const positionItems: PositionItem[] = [
    {
      type: "staking",
      name: t("staking"),
      amount: "5.00",
      value: "$5.00",
      icon: "staking",
      className: "bg-warning",
    },
    {
      type: "bonds",
      name: t("bonds"),
      amount: "5.00",
      value: "$5.00",
      icon: "diamond",
      className: "bg-secondary",
    },
  ];

  // 模拟奖励数据
  const rewardItems: PositionItem[] = [
    {
      type: "rebaseReward",
      name: t("rebaseReward"),
      amount: "5.00",
      value: "$5.00",
      icon: "medal",
      className: "gradient",
    },
    {
      type: "totalBonus",
      name: t("totalBonus"),
      amount: "5.00",
      value: "$5.00",
      icon: "bag",
      className: "bg-success",
    },
  ];

  //获取bnb价格
  const { data: bnbprice } = useQuery({
    queryKey: ["getBnbPrice"],
    queryFn: () => {
      if (!userAddress) return Promise.reject(new Error("Missing  address"));
      return bnbPrice();
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 30000,
  });
  // oly单价
  const { data: olyPrice } = useQuery({
    queryKey: ["olyPrice"],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 10000,
  });

  const totalValueInUSD = useMemo(() => {
    let total = 0;
    // 添加 DAI 价值
    if (daiBalance) {
      total += parseFloat(daiBalance);
    }
    // 添加 BNB 价值
    if (bnbBalance && bnbprice && Number(bnbprice) > 0) {
      total +=
        parseFloat(formatUnits(bnbBalance.value, bnbBalance.decimals)) *
        Number(bnbprice);
    }
    if (olyBalance && olyPrice) {
      total += Number(olyBalance) * Number(olyPrice);
    }
    setWalletAssets([
      {
        symbol: "USDT",
        name: "Tether USD",
        balance: formatNumbedecimalScale(daiBalance, 2),
        value: formatNumbedecimalScale(daiBalance, 2),
        icon: "/images/icon/usdt.png",
        chain: "BNB CHAIN",
      },
      {
        symbol: "BNB",
        name: "BNB",
        balance: bnbBalance
          ? formatNumbedecimalScale(
              formatUnits(bnbBalance.value, bnbBalance.decimals),
              6,
            )
          : "0",
        value: bnbBalance
          ? formatNumbedecimalScale(
              Number(formatUnits(bnbBalance.value, bnbBalance.decimals)) *
                bnbprice,
              2,
            )
          : 0,
        icon: "/images/icon/bnb.png",
        chain: "BNB CHAIN",
      },
      {
        symbol: "OLY",
        name: "OLYONE TOKEN",
        balance: formatNumbedecimalScale(olyBalance, 4),
        value:
          olyBalance && olyPrice
            ? formatNumbedecimalScale(Number(olyBalance) * Number(olyPrice), 2)
            : 0,
        icon: "/images/icon/one.png",
        chain: "BNB CHAIN",
      },
    ]);

    return total.toFixed(1);
  }, [daiBalance, bnbBalance, bnbprice, olyBalance, olyPrice]);

  const handleBuy = () => {
    console.log("Buy clicked");
  };

  const handleSell = () => {
    console.log("Sell clicked");
  };

  const handleReceive = () => {
    console.log("Receive clicked");
  };
  const addressRef = useRef<HTMLButtonElement>(null);

  const handleCopyAddress = async () => {
    if (address) {
      console.log("复制111");
      console.log(address, "address复制111");
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(address);
          setcopeB(copeB + 1);
          return;
        }
        const success = await fallbackCopyText(address);
        if (success) {
          setcopeB(copeB + 1);
          return;
        }
      } catch (error) {
        console.error(error);
        setcopeB(copeB - 1);
      }
    }
  };
  useEffect(() => {
    if (addressRef.current) {
      addressClipboardRef.current = new ClipboardJS(addressRef.current, {
        text: () => {
          console.log(
            "ClipboardJS text function called with address:",
            address,
          );
          return address as string;
        },
      });

      addressClipboardRef.current.on("success", () => {
        console.log("ClipboardJS success");
        setcopeA(copeA + 1);
      });
      addressClipboardRef.current.on("error", () => {
        console.log("ClipboardJS error");
        setcopeA(copeA - 1);
      });
    }
    return () => addressClipboardRef.current?.destroy();
  }, [address, setcopeA, copeA]);

  useEffect(() => {
    if (copeA > 1 || copeB > 1) {
      const timer = setTimeout(() => {
        toast.success(tcopy("copySuccess"));
        setcopeA(1);
        setcopeB(1);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (copeA < 1 && copeB < 1) {
      toast.error(tcopy("copyError"));
      setcopeA(1);
      setcopeB(1);
    }
  }, [copeA, copeB, tcopy, setcopeA, setcopeB]);
  const shortAddress = address ? formatAddress(address) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[412px] p-0 bg-gradient-to-b from-[#1a1d4a] to-[#0f1235] border-[#434c8c] text-white"
      >
        {/* Header */}
        <div className="flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-foreground/50">
              <Image
                src="/images/icon/fox.png"
                alt="wallet"
                width={24}
                height={24}
              />
              <span className="text-lg text-foreground font-mono">
                {shortAddress}
              </span>
              <div
                className="cursor-pointer hover:text-white/70"
                onClick={() => {
                  handleCopyAddress();
                }}
              >
                <Icon name="copy" size={16} className="pointer-events-none" />
                xx
              </div>
              <div className="cursor-pointer hover:text-white/70">
                <Icon name="share" size={16} className="pointer-events-none" />
              </div>
            </div>
            <Button
              clipDirection="topLeft-bottomRight"
              clipSize={8}
              variant="outlined"
              className="h-8"
              onClick={handleDisconnect}
            >
              <span className="text-gradient text-sm px-2 z-10">
                {t("disconnect")}
              </span>
            </Button>
          </div>

          {/* Balance */}
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold">{totalValueInUSD}</div>
            <div className="text-foreground/50 text-xs">
              {activeTab === "wallet" ? t("myWallet") : t("myAccount")}
            </div>
          </div>

          <Segments
            options={[
              { value: "wallet", label: t("mywallet") },
              { value: "account", label: t("account") },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as "wallet" | "account")}
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === "wallet" && (
            <div className="space-y-3">
              {/* Assets Header */}
              <span className="text-foreground/50 text-xs px-0">
                {t("assets")}
              </span>

              {/* Assets List */}
              <div className="">
                {walletAssets.map((asset, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center justify-between px-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={asset.icon}
                          alt={asset.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <Image
                          src="/images/icon/bnb.png"
                          alt="bnb"
                          width={16}
                          height={16}
                          className="absolute -bottom-1 -right-1 w-4 h-4"
                        />
                      </div>
                      <div>
                        <div className="font-medium space-x-2">
                          <span>{asset.symbol}</span>
                          <span className="text-white/50 text-xs">
                            {asset.name}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          {asset.chain}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium font-mono text-lg">
                        {asset.balance}
                      </div>
                      <div className="text-xs text-white/50">{asset.value}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-5 w-full text-sm font-mono">
                <Button
                  onClick={handleBuy}
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  {t("buy")}
                </Button>
                <Button
                  onClick={handleSell}
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  {t("sell")}
                </Button>
                <Button
                  onClick={handleReceive}
                  variant="outlined"
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  <span className="text-gradient text-sm px-2 z-10">
                    {t("receive")}
                  </span>
                </Button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Position Section */}
              <div className="space-y-3">
                <span className="text-white/50 text-xs px-0">
                  {t("position")}
                </span>
                <div className="space-y-2">
                  {positionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            `w-8 h-8 rounded-full flex items-center justify-center`,
                            item.className,
                          )}
                        >
                          <Icon name={item.icon} size={24} />
                        </div>
                        <div className="font-medium text-lg font-mono text-white">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg font-mono text-white">
                          {item.amount}
                        </div>
                        <div className="text-xs text-white/50">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward Section */}
              <div className="space-y-3">
                <span className="text-white/50 text-xs px-0">
                  {t("reward")}
                </span>
                <div className="space-y-2">
                  {rewardItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            `w-8 h-8 rounded-full flex items-center justify-center`,
                            item.className,
                          )}
                        >
                          <Icon name={item.icon} size={24} />
                        </div>
                        <div className="font-medium text-lg text-white">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg text-white">
                          {item.amount}
                        </div>
                        <div className="text-xs text-white/50">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
