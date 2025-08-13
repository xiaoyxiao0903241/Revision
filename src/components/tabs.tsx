'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';

import { cn } from '~/lib/utils';

export const NavigationTabs: FC<{
  data: { label: string; href: string }[];
  activeIndex?: number;
  children?: React.ReactNode;
  className?: string;
  indicatorClassName?: string;
  activeClassName?: string;
  labelClassName?: string;
}> = ({
  data,
  activeIndex = 0,
  children,
  className,
  indicatorClassName,
  activeClassName,
  labelClassName,
}) => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  useEffect(() => {
    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };
    setTabPosition();
  }, [activeIndex]);

  return (
    <div
      className={cn(
        'relative flex w-full h-12 gap-8 mx-auto border-b border-border/20 flew-row backdrop-blur-sm overflow-x-auto',
        className
      )}
    >
      <span
        className='absolute bottom-0 flex overflow-hidden transition-all duration-300 -z-10'
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span
          className={cn(
            'w-full h-[2px] bg-gradient-to-r from-[#B408D7] to-[#576AF4]',
            indicatorClassName
          )}
        />
      </span>
      {data.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <Link
            href={tab.href}
            key={index}
            ref={el => {
              tabsRef.current[index] = el;
            }}
            className={cn(
              'cursor-pointer font-lg text-base md:text-2xl uppercase select-none text-nowrap',
              {
                'hover:text-neutral-300': !isActive,
                [activeClassName ?? 'text-gradient font-bold']: isActive,
              },
              labelClassName
            )}
          >
            {tab.label}
          </Link>
        );
      })}
      {children}
    </div>
  );
};

export const Tabs: FC<{
  data: { label: string; href: string }[];
  activeIndex?: number;
  children?: React.ReactNode;
  className?: string;
  indicatorClassName?: string;
  activeClassName?: string;
  labelClassName?: string;
  onChange?: (index: number) => void;
}> = ({
  data,
  activeIndex = 0,
  children,
  className,
  indicatorClassName,
  onChange,
  activeClassName,
  labelClassName,
}) => {
  const tabsRef = useRef<(HTMLElement | null)[]>([]);
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  useEffect(() => {
    const setTabPosition = () => {
      const currentTab = tabsRef.current[activeIndex] as HTMLElement;
      setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
      setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
    };
    setTabPosition();
  }, [activeIndex]);

  return (
    <div
      className={cn(
        'relative flex w-full h-12 gap-8 mx-auto border-b border-border/20 flew-row backdrop-blur-sm',
        className
      )}
    >
      <span
        className='absolute bottom-0 flex overflow-hidden transition-all duration-300 -z-10'
        style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
      >
        <span
          className={cn(
            'w-full h-[2px] bg-gradient-to-r from-[#B408D7] to-[#576AF4]',
            indicatorClassName
          )}
        />
      </span>
      {data.map((tab, index) => {
        const isActive = activeIndex === index;
        return (
          <div
            key={index}
            onClick={() => onChange?.(index)}
            ref={el => {
              tabsRef.current[index] = el;
            }}
            className={cn(
              'my-auto cursor-pointer font-lg select-none text-nowrap font-semibold rounded-full text-center',
              {
                'hover:text-neutral-300 text-foreground/50': !isActive,
                [activeClassName ?? 'text-gradient']: isActive,
              },
              labelClassName
            )}
          >
            {tab.label}
          </div>
        );
      })}
      {children}
    </div>
  );
};

export const AnimatedTabs: FC<{
  data: string[];
  value: string;
  onChange: (v: string) => void;
}> = ({ data, onChange, value }) => {
  return (
    <div className='flex space-x-1 bg-card rounded-full h-12 border overflow-x-auto'>
      {data.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`${
            value === tab ? '' : 'hover:text-white'
          } relative rounded-full flex-1 px-6 py-1.5 text-sm font-medium text-white/60 outline-sky-400 transition focus-visible:outline-2`}
          style={{
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {value === tab && (
            <motion.span
              layoutId='bubble'
              className='absolute inset-0 z-10 bg-primary mix-blend-difference'
              style={{ borderRadius: 9999 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          {tab}
        </button>
      ))}
    </div>
  );
};
