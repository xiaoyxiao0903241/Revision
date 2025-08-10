"use client";
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { formatAddress } from "~/lib/utils";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { chainId as chainIdConstant } from "~/wallet/constants/tokens";
import ClipboardJS from "clipboard";
import Image from "next/image";

import { Button } from "~/components";
import { WalletDropdown } from "~/widgets";

export default function ConnectWalletButton({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations();
  const tcopy = useTranslations("invite");
  const { setUserAddress, isSigned, setIsSigned, clearSignature, sign } =
    useUserAddress();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [copeA, setcopeA] = useState(1);
  const [copeB, setcopeB] = useState(1);

  const chainId = useChainId();
  const addressRef = useRef<HTMLButtonElement>(null);
  const addressClipboardRef = useRef<ClipboardJS | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 添加点击外部区域关闭菜单的功能
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 监听账户变化，保持按钮收起状态
  useEffect(() => {
    setIsOpen(false);
  }, [address]);

  const { switchChain } = useSwitchChain();

  useEffect(() => {
    if (isConnected && chainId !== chainIdConstant) {
      switchChain({ chainId: chainIdConstant });
    }
  }, [isConnected, chainId, switchChain]);
  // 监听连接状态变化
  useEffect(() => {
    if (!isConnected) {
      setUserAddress(null);
      setIsSigned(false);
    }
  }, [isConnected, setUserAddress, setIsSigned]);

  const handleSignIn = async () => {
    if (!address) return;
    try {
      setIsSigning(true);
      await sign(address);
      setIsOpen(false);
    } catch (error) {
      console.error("Sign in failed:", error);
      disconnect();
    } finally {
      setIsSigning(false);
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

  const handleDisconnect = () => {
    if (address) {
      clearSignature(address);
    }
    setIsSigned(false);
    setUserAddress(null);
    disconnect();
    setIsOpen(false);
  };

  if (!isConnected) {
    return (
      <Button
        clipDirection="topRight-bottomLeft"
        onClick={openConnectModal}
        className="md:px-6 md:h-12 md:text-base px-3 h-8 text-sm font-normal"
      >
        连接钱包
      </Button>
    );
  }

  if (isConnected && !isSigned) {
    return (
      <Button
        clipDirection="topRight-bottomLeft"
        onClick={handleSignIn}
        disabled={isSigning}
        className={`px-4 py-2 bg-[#7238EF] text-[14px] text-white rounded-md  ${className}`}
      >
        {isSigning
          ? t("common.wallet.signing")
          : t("common.wallet.please_sign")}
      </Button>
    );
  }

  const shortAddress = address ? formatAddress(address) : "";

  return (
    <WalletDropdown handleDisconnect={handleDisconnect}>
      <div className="relative md:block hidden" ref={menuRef}>
        <Button
          clipDirection="topRight-bottomLeft"
          onClick={() => setIsOpen(!isOpen)}
          className="gap-2"
        >
          <div className="flex items-center gap-2">
            <Image
              src="/imgs/common/wallet.png"
              width={32}
              height={32}
              alt=""
            ></Image>
            <span className="text-[#0D0EC9] font-bold">{shortAddress}</span>
          </div>
          <ChevronDown
            color="black"
            className={`w-4 h-4 transition-transform  ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
        <Image
          src="/images/icon/wallet.png"
          alt="wallet"
          width={25}
          height={25}
          className="block md:hidden"
        />
      </div>
    </WalletDropdown>
  );
}
