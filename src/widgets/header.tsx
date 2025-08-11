"use client";
// import { useTranslations } from "next-intl";
import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
import NetWork from "~/components/common/netWork";
import ConnectWalletButton from "~/components/web3/ConnectWalletButton";
import { LanguageSwitcher } from "./language-switcher";
import { Icon } from "~/components";

interface HeaderProps {
  onMenuClick?: () => void;
}
export function Header({ onMenuClick }: HeaderProps) {
  // const t = useTranslations("header")

  return (
    <header className="flex h-20 items-center justify-between md:px-9 px-4">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/widgets/site-logo.png"
          alt="logo"
          width={106}
          height={60}
          className="md:w-full md:h-full w-[60px] h-[30px]"
        />
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <NetWork />
        <ConnectWalletButton></ConnectWalletButton>
        <button
          onClick={onMenuClick}
          className="md:hidden w-[25px] h-[25px] border-[#434c8c] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] border rounded-full rotate-90 flex items-center justify-center"
        >
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </header>
  );
}
