import { FC } from "react";
import { Button } from "~/components";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TOKEN_ADDRESSES } from "~/wallet/constants/tokens";

export const AddToWallet: FC = () => {
  const t = useTranslations("common");
  const token = {
    address: TOKEN_ADDRESSES.OLY,
    symbol: "OLY",
    decimals: 9,
  };
  const handleAddToken = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: token.address,
              symbol: token.symbol,
              decimals: token.decimals,
            },
          },
        });
      } catch (error) {
        console.log("error", error);
        toast.error(t("add_tip"));
      }
    } else {
      toast.error("请先安装钱包插件");
    }
  };
  return (
    <Button
      variant="accent"
      size="sm"
      clipSize={8}
      className="gap-2"
      clipDirection="topLeft-bottomRight"
      onClick={handleAddToken}
    >
      <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
        <Image
          src="/images/widgets/logo.png"
          alt="logo"
          width={16}
          height={16}
        />
      </div>
      <span className="text-black">{t("addToken")}</span>
    </Button>
  );
};
