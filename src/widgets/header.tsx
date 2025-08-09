"use client";
import { useLocale } from "next-intl";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "~/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu";
// import { useMock } from "~/hooks/useMock"
import NetWork from "~/components/common/netWork";
import ConnectWalletButton from "~/components/web3/ConnectWalletButton";

export function Header() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  // const t = useTranslations("common")
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ];

  const handleLanguageChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <header className="flex h-20 items-center justify-between px-9">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/images/widgets/site-logo.png"
          alt="logo"
          width={106}
          height={60}
        />
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Icon
                name="sphere"
                size={32}
                className="text-foreground pointer-events-none"
              />
              <Icon
                name="arrow"
                size={20}
                className="text-foreground/50 pointer-events-none"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={locale === language.code ? "text-foreground" : ""}
              >
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <NetWork />
        <ConnectWalletButton></ConnectWalletButton>
      </div>
    </header>
  );
}
