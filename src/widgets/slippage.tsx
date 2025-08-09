import { useTranslations } from "next-intl";
import { FC } from "react";
import { RadioGroup, View, Input } from "~/components";
import { useState } from "react";

export const Slippage: FC<{
  options: {
    value: string;
    label: string;
  }[];
  value?: string | number;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => {
  const t = useTranslations("swap");
  const [slipple, setSlipple] = useState("0.5");
  return (
    <View className="bg-[#22285E] font-mono flex justify-between items-center p-4">
      <h3 className="text-sm font-semibold">{t("allowableSlippage")}</h3>
      <div className="flex space-x-2 items-center">
        <RadioGroup value={value} onChange={onChange} options={options} />
        <div className="!w-[60px] rounded-full h-[18px] cursor-pointer flex px-2 items-center justify-center border-gray-400 border-2 text-foreground/50">
          <Input.Number
            value={slipple}
            onChange={(value) => {
              console.log(value, "value00000");
              setSlipple(value);
              onChange(value);
            }}
            placeholder="0.1"
            step={0.000001}
            maxDecimals={2}
            className="font-mono border-gray-400 text-xs"
          />
          <span className="text-xs">%</span>
        </div>
      </div>
    </View>
  );
};
