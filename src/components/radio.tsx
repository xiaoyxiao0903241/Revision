import { FC } from 'react';
import { cn } from '~/lib/utils';

export const RadioGroup: FC<{
  value?: string | number;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}> = ({ value, onChange, options }) => {
  console.log(value, '22222');
  return (
    <div className='flex gap-2'>
      {options.map(option => (
        <div
          key={option.value}
          className={cn(
            'rounded-[2px] h-[18px] cursor-pointer flex px-4 items-center justify-center border-gray-400 text-xs border-[1px]',
            {
              'text-foreground/50': Number(value) !== Number(option.value),
              gradient: Number(value) === Number(option.value),
            }
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
