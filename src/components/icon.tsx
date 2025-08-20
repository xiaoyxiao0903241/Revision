import React from 'react';
import { cn } from '~/lib/utils';

// 从 iconfont.json 中提取的所有图标名称
export type IconFontName =
  | 'analytics'
  | 'community'
  | 'dashboard'
  | 'event'
  | 'lp-bonds'
  | 'locked-staking'
  | 'swap'
  | 'cooling-pool'
  | 'staking'
  | 'dao'
  | 'treasury-bonds'
  | 'turbine'
  | 'documents'
  | 'bnb'
  | 'unstake'
  | 'calculator'
  | 'claim'
  | 'stake'
  | 'clock'
  | 'record'
  | 'setting'
  | 'refresh'
  | 'arrow'
  | 'sphere'
  | 'pie'
  | 'blocks'
  | 'diamond'
  | 'water'
  | 'usdt'
  | 'medal'
  | 'bag'
  | 'copy'
  | 'share';

// 图标映射表 - 从 iconfont.css 中提取的 unicode 编码
export const ICON_MAP: Record<IconFontName, string> = {
  analytics: '\ue726',
  community: '\ue727',
  dashboard: '\ue725',
  event: '\ue728',
  'lp-bonds': '\ue729',
  'locked-staking': '\ue747',
  swap: '\ue72b',
  'cooling-pool': '\ue72c',
  staking: '\ue746',
  dao: '\ue72e',
  'treasury-bonds': '\ue72f',
  turbine: '\ue730',
  documents: '\ue731',
  bnb: '\ue732',
  unstake: '\ue733',
  record: '\ue734',
  calculator: '\ue735',
  claim: '\ue736',
  stake: '\ue737',
  clock: '\ue738',
  setting: '\ue73b',
  refresh: '\ue73c',
  arrow: '\ue73d',
  sphere: '\ue739',
  pie: '\ue740',
  blocks: '\ue741',
  diamond: '\ue742',
  water: '\ue743',
  usdt: '\ue73a',
  medal: '\ue73e',
  bag: '\ue73f',
  copy: '\ue745',
  share: '\ue744',
};

interface IconFontProps {
  /** 图标名称 */
  name: IconFontName;
  /** 自定义样式类名 */
  className?: string;
  /** 图标大小，可以是数字（px）或CSS尺寸字符串 */
  size?: number | string;
  /** 图标颜色 */
  color?: string;
  /** 点击事件处理函数 */
  onClick?: () => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义样式对象 */
  style?: React.CSSProperties;
}

export function Icon({
  name,
  className,
  size = 16,
  color,
  onClick,
  disabled = false,
  style,
  ...props
}: IconFontProps) {
  const iconCode = ICON_MAP[name];

  if (!iconCode) {
    console.warn(`Icon "${name}" not found in icon resources`);
    return null;
  }

  // 处理尺寸
  const sizeStyle = typeof size === 'number' ? `${size}px` : size;

  // 合并样式
  const combinedStyle: React.CSSProperties = {
    fontSize: sizeStyle,
    color: color,
    cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  return (
    <i
      className={cn('iconfont', className)}
      style={combinedStyle}
      onClick={disabled ? undefined : onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={e => {
        if (onClick && !disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      {iconCode}
    </i>
  );
}

// 导出所有图标名称的数组，方便使用
export const ICON_NAMES = Object.keys(ICON_MAP) as IconFontName[];

// 导出图标数量
export const ICON_COUNT = ICON_NAMES.length;
