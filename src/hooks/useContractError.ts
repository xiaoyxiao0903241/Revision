import { useTranslations } from 'next-intl';
import { errorMap } from '@/src/lib/web3/contractErrors';

/**
 * 处理合约错误的Hook
 * @returns 处理合约错误的函数
 */
export const useContractError = () => {
  const t = useTranslations('contract.error');

  /**
   * 处理合约错误
   * @param error 错误对象或错误消息
   * @returns 处理后的错误信息
   */
  const handleContractError = (error: Error | string): string => {
    // 如果是错误对象，尝试获取错误消息
    const errorMessage = typeof error === 'object' ? error.message : error;
    // 如果errorMessage包含errorMap里的key，则返回翻译后的错误消息
    const errorKey = Object.keys(errorMap).find(key =>
      errorMessage.includes(key)
    );
    if (errorKey) {
      return t(errorMap[errorKey]);
    }
    // // 查找对应的错误键
    // const errorKey = errorMap[errorMessage];

    // if (errorKey) {
    //   // 使用i18n获取翻译后的错误消息
    //   return t(errorKey);
    // }

    // 如果没有找到对应的错误键，返回原始错误消息
    return errorMessage;
  };

  /**
   * 检查是否是合约错误
   * @param error 错误对象或错误消息
   * @returns 是否是合约错误
   */
  const isContractError = (error: Error | string): boolean => {
    const errorMessage = typeof error === 'object' ? error.message : error;
    // 判断 errorMessage 是否包含errorMap里的key
    const errorKey = Object.keys(errorMap).find(key =>
      errorMessage.includes(key)
    );
    if (errorKey) {
      return true;
    }
    return false;
  };

  return {
    handleContractError,
    isContractError,
  };
};
