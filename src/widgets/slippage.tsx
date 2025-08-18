import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { Input, RadioGroup, View } from '~/components';

export const Slippage: FC<{
  options: {
    value: string;
    label: string;
  }[];
  value?: string | number;
  onChange: (value: string) => void;
}> = ({ options, value, onChange }) => {
  const t = useTranslations('swap');
  const [slipple, setSlipple] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  return (
    <View className='bg-[#22285E] font-mono flex flex-col md:flex-row cl justify-start  md:justify-between md:items-center p-4 gap-2'>
      <h3 className='text-sm font-chakraPetch font-semibold'>
        {t('allowableSlippage')}
      </h3>
      <div className='flex space-x-2 items-center'>
        <div
          onClick={() => {
            setIsFocus(false);
          }}
        >
          <RadioGroup value={value} onChange={onChange} options={options} />
        </div>
        <div
          className='relative !w-[60px] rounded-full h-[18px] cursor-pointer flex  items-center justify-center text-foreground/50'
          onClick={() => {
            setIsFocus(true);
          }}
        >
          <Input.Number
            value={slipple}
            onChange={value => {
              setSlipple(value);
              onChange(value);
            }}
            placeholder='0.0'
            step={0.000001}
            maxDecimals={2}
            className={`!w-[55px]  pr-3  h-[18px] font-mono text-xs hover:text-white border border-gray-400 rounded-full px-2 focus:outline-none  focus:ring-0  transition-colors ${
              isFocus ? 'border-[#B408D7]' : 'border-gray-400'
            }`}
          />
          <span className='text-xs absolute right-2'>%</span>
        </div>
      </div>
    </View>
  );
};
