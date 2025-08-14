import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/zh';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { twMerge } from 'tailwind-merge';

// 扩展 dayjs 以支持时区
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.extend(relativeTime);

export { dayjs };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getClipPath(clipDirection: string, clipSize: number) {
  if (clipDirection === 'none' || clipSize === 0) {
    return undefined;
  }

  if (clipDirection === 'topLeft-bottomRight') {
    return `polygon(${clipSize}px 0, 100% 0, 100% calc(100% - ${clipSize}px), calc(100% - ${clipSize}px) 100%, 0 100%, 0 ${clipSize}px)`;
  }

  if (clipDirection === 'topRight-bottomLeft') {
    return `polygon(0 0, calc(100% - ${clipSize}px) 0, 100% ${clipSize}px, 100% 100%, ${clipSize}px 100%, 0 calc(100% - ${clipSize}px))`;
  }

  return undefined;
}

export function getCookieLanguage() {
  if (typeof window === 'undefined') return 'en'; // 服务端渲染时返回默认语言

  const browserLang = window.navigator.language.toLowerCase();
  const defaultLang = browserLang.startsWith('en')
    ? browserLang === 'zh-hk' || browserLang === 'zh-hk'
      ? 'zh-hk'
      : 'en'
    : 'en';
  const lang = document.cookie.match(/NEXT_LOCALE=([^;]*)/)?.[1] || defaultLang;
  return lang;
}

export function setCookieLanguage(lang: string) {
  if (typeof window === 'undefined') return; // 服务端渲染时不执行

  const oneYear = 365 * 24 * 60 * 60 * 1000;
  const expiryDate = new Date(Date.now() + oneYear).toUTCString();
  document.cookie = `NEXT_LOCALE=${lang}; path=/; expires=${expiryDate}`;
}

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
// 格式化时间，将秒转换为 dd:hh:mm:ss
export function formatTime(seconds: number): string {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (days > 0) {
    return `${days}d ${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}
// 讲金额转换为千分位
export function formatNumber(
  num: number | string,
  decimalScale: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalScale,
    maximumFractionDigits: decimalScale,
  }).format(Number(num));
}
// 地址格式化
export function formatAddress(address: string): string {
  return address.slice(0, 6) + '...' + address.slice(-4);
}
// 日期格式化YYYY-MM-DD HH:mm:ss
export function formatDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

interface TextRangeElement extends HTMLInputElement {
  createTextRange(): {
    collapse: (toStart: boolean) => void;
    select: () => void;
  };
}

export const fallbackCopyText = async (text: string): Promise<boolean> => {
  // 创建临时input元素（优化iOS兼容性）
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly'); // 防止iOS键盘弹出[3](@ref)
  input.style.position = 'fixed';
  input.style.opacity = '0';
  input.style.left = '-9999px';
  input.style.top = '-9999px';
  input.value = text;
  document.body.appendChild(input);

  try {
    // 华为/Vivo设备特殊处理：权限预请求
    if (/huawei|vivo/i.test(navigator.userAgent)) {
      try {
        // 主动请求剪贴板权限（华为设备必需）[6](@ref)
        await navigator.permissions?.query({
          name: 'clipboard-write' as PermissionName,
        });
      } catch {
        console.log('权限预请求失败，继续执行复制');
      }
    }

    // 方法1: execCommand（兼容旧设备）
    let success = false;
    try {
      // 增强选择逻辑（兼容iOS）[3](@ref)
      if ('createTextRange' in input) {
        const range = (input as TextRangeElement).createTextRange();
        range.collapse(true);
        range.select();
      } else {
        input.select();
        input.setSelectionRange(0, 99999);
      }
      success = document.execCommand('copy');
    } catch (e) {
      console.warn('execCommand复制失败:', e);
    }

    // 方法2: Clipboard API（现代方法）
    if (!success && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        success = true;
      } catch (e) {
        console.warn('clipboard.writeText失败:', e);
      }
    }

    // 方法3: Selection API（富文本备用方案）
    if (!success) {
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(input);
        selection?.removeAllRanges();
        selection?.addRange(range);
        success = document.execCommand('copy');
        selection?.removeAllRanges();
      } catch (e) {
        console.warn('Selection API复制失败:', e);
      }
    }

    // 方法4: 长文本分段复制（>2KB时）[1](@ref)
    if (!success && text.length > 2048) {
      try {
        for (let i = 0; i < text.length; i += 1000) {
          const chunk = text.slice(i, i + 1000);
          await navigator.clipboard.writeText(chunk);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        success = true;
      } catch (e) {
        console.warn('分段复制失败:', e);
      }
    }

    return success;
  } catch (err) {
    console.error('复制操作异常:', err);
    return false;
  } finally {
    // 关键清理操作（解决输入法冲突）[5](@ref)
    (document.activeElement as HTMLElement)?.blur();
    if (input.parentNode) {
      document.body.removeChild(input);
    }
  }
};
// 格式化url
// 格式化URL，保留前面21个字符和后面8个字符，中间用...替代
export const formatUrl = (url: string): string => {
  if (!url) return '';

  // 如果字符串长度小于等于29（21+8），则直接返回原字符串
  if (url.length <= 29) {
    return url;
  }

  // 获取前21个字符
  const prefix = url.substring(0, 16);

  // 获取后8个字符
  const suffix = url.substring(url.length - 8);

  // 返回格式化后的字符串
  return `${prefix}...${suffix}`;
};
//格式化时间 格式化这样的时间2025-05-03T14:23:50转换为2025-05-03 14:23:50
export function formatTime2(time: string): string {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  const second = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export const SIGNATURE_STORAGE_KEY =
  process.env.NEXT_PUBLIC_SIGNATURE_STORAGE_KEY || 'olywallet_signatures';
// 清除这个地址对应的 token
export const clearToken = (address: string) => {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(SIGNATURE_STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  delete parsed[address];
  localStorage.setItem(SIGNATURE_STORAGE_KEY, JSON.stringify(parsed));
};
export const getToken = (address: string) => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(SIGNATURE_STORAGE_KEY);
  const parsed = stored ? JSON.parse(stored) : {};
  return parsed[address]?.token || null;
};

//转成周几
export const getWeekday = (dateStr: string) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateStr.replace(/-/g, '/'));
  return days[date.getDay()];
};
//获取今天和前六天的日期

export const getFirEndDate = () => {
  const today = new Date();
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6);
  return {
    from: formatDateOther(sixDaysAgo) + ' 00:00:00',
    to: formatDateOther(today) + ' 23:59:59',
  };
};

function formatDateOther(date: Date) {
  //2025-09-01
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 写一个方法保留 4 位小数
export const formatNumbedecimalScale = (
  num: number | string,
  decimalScale: number = 4
): string => {
  const n =
    Math.floor(Number(num) * Math.pow(10, decimalScale)) /
    Math.pow(10, decimalScale);
  return n.toFixed(decimalScale);
};

//转成千分位
export const formatterNum = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
  useGrouping: true,
});

//转成千分位 保留一位小数点
export const formatter1Num = new Intl.NumberFormat('en', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  useGrouping: true,
});
// 转千分位保留2位小数
export const formatte2Num = new Intl.NumberFormat('en', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});
// 需要转成千分位，并且保留两位小数，需要K M B
export const formatterNum2 = new Intl.NumberFormat('en', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

// 数字格式化为 K/M 结尾
export function formatKM(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2).replace(/\.00$/, '') + 'K';
  }
  return num.toString();
}

let scrollPosition = 0;

export function disableScroll() {
  // 保存当前滚动位置
  scrollPosition = window.pageYOffset;

  // 设置 body 样式
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
}

export function enableScroll() {
  // 恢复 body 样式
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.paddingRight = '';

  // 恢复滚动位置
  window.scrollTo(0, scrollPosition);
}

// 使用函数处理各种链接类型
export const openLink = (url: string, isExternal = false) => {
  // 检查URL是否有效
  if (!url) return;

  // 检查是否为特殊协议
  const isSpecialProtocol = /^(mailto:|tel:|sms:|file:|data:)/.test(url);

  if (isExternal || isSpecialProtocol) {
    // 安全打开外部链接
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    // 内部导航
    window.location.href = url;
  }
};
//格式化时间 格式化这样的时间2025-06-02 15:08:45转换为2025-05-03 14:23:50 本地时间
export function formatTimeToLocal(
  time: string,
  needSecond: boolean = true
): string {
  if (!time) return '';

  try {
    // 将输入时间解析为 UTC 时间，然后转换为本地时间
    const date = dayjs.utc(time).tz(dayjs.tz.guess());
    if (!date.isValid()) {
      console.warn('Invalid date:', time);
      return '--';
    }

    if (needSecond) {
      return date.format('YYYY-MM-DD HH:mm:ss');
    }
    return date.format('YYYY-MM-DD HH:mm');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '--';
  }
}

export const formatCurrency = (value: number, symbolShown = true) => {
  if (!value) {
    return symbolShown ? '$0.00' : '0.00';
  }
  if (symbolShown) {
    return Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(value)
    .replace('$', '');
};

export const formatDecimal = (value: number, decimals = 2) => {
  if (!value) {
    return '0.00';
  }
  return Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatHash = (hash: string) => {
  return hash.length > 10 ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : hash;
};
