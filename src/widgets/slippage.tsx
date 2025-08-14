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
  const [slipple, setSlipple] = useState('0.5');
  return (
    <View className='bg-[#22285E] font-mono flex flex-col md:flex-row cl justify-start  md:justify-between md:items-center p-4 gap-2'>
      <h3 className='text-sm font-semibold'>{t('allowableSlippage')}</h3>
      <div className='flex space-x-2 items-center'>
        <RadioGroup value={value} onChange={onChange} options={options} />
        <div className='!w-[60px] rounded-full h-[18px] cursor-pointer flex px-2 items-center justify-center border-gray-400 border-2 hover:border-0   text-foreground/50 hover:gradient'>
          <Input.Number
            value={slipple}
            onChange={value => {
              setSlipple(value);
              onChange(value);
            }}
            placeholder='0.1'
            step={0.000001}
            maxDecimals={2}
            className='font-mono border-gray-400 text-xs hover:text-white'
          />
          <span className='text-xs'>%</span>
        </div>
      </div>
    </View>
  );
};
