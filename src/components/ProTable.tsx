import { useQuery, useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { Button, Pager } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { cn, dayjs, formatHash } from '~/lib/utils';

export type valueType = 'text' | 'date' | 'dateTime' | 'hash';

export type targetType = '_blank' | '_parent' | '_self' | '_top' | string;

export interface ProTableRender<T> {
  link?: boolean;
  target?: targetType;
  href?:
    | string
    | ((
        value: string | number | undefined,
        record: T,
        index: number
      ) => string);
  valueType?: valueType;
  icon?: React.ReactNode;
  render?: (
    value: string | number | boolean | undefined,
    record: T,
    index: number
  ) => React.ReactNode;
}

export interface ProTableColumn<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  dataSource?: Array<Record<string, unknown>>;
  render?:
    | ProTableRender<T>
    | ((
        value: string | number | boolean | undefined,
        record: T,
        index: number
      ) => React.ReactNode);
}

export interface ProTableData<T> {
  dataSource: T[];
  records?: T[];
  total: number;
}

export type ProTableDataType = {
  dataSource: [];
  records?: [];
  total: number;
};

export type ProTableRef = {
  refresh: () => void;
};

export interface ProTableProps<T> {
  columns: ProTableColumn<T>[]; // 表格列配置
  pageSize?: number; // 每页条数，默认为10
  showPagination?: boolean; // 是否开启分页功能
  rowKey?: keyof T; // 行的唯一标识，默认为 'address'
  queryFn: (params: Record<string, unknown>) => Promise<ProTableData<T>>; // 自定义请求
  formatResult?: (data: ProTableData<T>) => void; // 自定义返回结果
  notDataText?: string;
  appendNotDataText?: string; // 暂无数据顶部追加文案
  params?: Record<string, unknown>; // 参数
  manualRequest?: boolean; // 是否手动请求
  onSuccess?: (data: ProTableData<T>) => void; // 数据获取成功回调
  onRefreshRef?: React.Ref<(() => void) | undefined>;
}
/**
 * ProTable通用表格组件
 * 提供分页、数据格式化、链接渲染等功能
 *
 * @template T 数据类型
 * @param columns 表格列配置
 * @param queryFn 数据请求函数
 * @param params 请求参数
 * @param rowKey 行唯一标识字段
 * @param showPagination 是否显示分页
 * @param pageSize 每页显示条数
 * @param formatResult 数据结果格式化函数
 * @param manualRequest 是否手动触发请求
 * @param appendNotDataText 暂无数据顶部追加文案
 */
const ProTable = forwardRef(
  <T extends Record<string, any>>({
    columns,
    queryFn,
    params,
    rowKey = 'address' as keyof T,
    showPagination = true,
    pageSize: pageSizeProp = 10,
    formatResult,
    manualRequest = false,
    appendNotDataText: appendNotDataText = '',
    notDataText,
    onSuccess,
    onRefreshRef,
  }: ProTableProps<T>) => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const common = useTranslations();
    const userAddress = useUserAddress();
    // 保存上一次的params用于比较
    const [prevParams, setPrevParams] = useState<
      Record<string, unknown> | undefined
    >(params);
    const queryClient = useQueryClient();

    // 监听params变化，如果变化则重置到第一页
    useEffect(() => {
      if (!_.isEqual(params, prevParams)) {
        setCurrentPage(1);
        setPrevParams(params);
      }
    }, [params, prevParams]);

    // , isLoading, isError, error
    const { data } = useQuery({
      queryKey: ['proTable', params, currentPage, pageSizeProp],
      queryFn: () => queryFn({ ...params, currentPage, pageSizeProp }),
      enabled: !manualRequest,
    });

    useEffect(() => {
      if (data && onSuccess) {
        onSuccess(data);
      }
    }, [data, onSuccess]);

    // 格式化值的函数
    const formatValue = (value: unknown, valueType?: valueType): string => {
      if (value === null || value === undefined) return '';
      const strValue = String(value);
      switch (valueType) {
        case 'date':
          return dayjs(strValue).format('YYYY/MM/DD');
        case 'dateTime':
          return dayjs(strValue).format('YYYY/MM/DD HH:mm:ss');
        case 'hash':
          return formatHash(strValue);
        case 'text':
        default:
          return strValue;
      }
    };

    // 渲染表格数据
    const processedData = data
      ? formatResult
        ? (formatResult(data) as unknown as ProTableData<T>)
        : (data as ProTableData<T>)
      : null;

    const tableData = processedData?.dataSource || processedData?.records || [];
    const total = processedData?.total || data?.total || 0;

    const refresh = useCallback(() => {
      // 重新获取数据的方法
      queryClient.invalidateQueries({
        queryKey: ['proTable', params, currentPage, pageSizeProp],
      });
    }, [queryClient, params, currentPage, pageSizeProp]);

    // 将刷新方法暴露给父组件
    useEffect(() => {
      if (onRefreshRef) {
        if (typeof onRefreshRef === 'function') {
          onRefreshRef(refresh);
        } else if ('current' in onRefreshRef) {
          onRefreshRef.current = refresh;
        }
      }

      // 清理函数，组件卸载时清理引用
      return () => {
        if (onRefreshRef && 'current' in onRefreshRef) {
          onRefreshRef.current = undefined;
        }
      };
    }, [onRefreshRef, refresh]);

    return (
      <div className='md:overflow-x-auto'>
        <table className='w-full'>
          <tbody className='space-y-2 w-full'>
            {tableData.map((record: T, index: number) => {
              const key = record[rowKey] || index;
              return (
                <tr
                  key={`${key}-${index}`}
                  className={cn(
                    'grid p-6 grid-cols-2 md:flex bg-foreground/5 rounded-md'
                  )}
                >
                  {columns.map((column, colIndex) => {
                    // 获取单元格的值
                    const value = record[column.dataIndex];

                    // 处理渲染逻辑
                    let renderedValue: React.ReactNode =
                      value === null || value === undefined
                        ? null
                        : String(value);

                    if (column.render) {
                      // 如果是函数形式的render
                      if (typeof column.render === 'function') {
                        const safeValue = value as
                          | string
                          | number
                          | boolean
                          | undefined;
                        renderedValue = column.render(safeValue, record, index);
                      }
                      // 如果是ProTableRender配置对象
                      else if (typeof column.render === 'object') {
                        const renderConfig = column.render;

                        // 使用自定义render函数
                        if (renderConfig.render) {
                          const safeValue = value as
                            | string
                            | number
                            | boolean
                            | undefined;
                          renderedValue = renderConfig.render(
                            safeValue,
                            record,
                            index
                          );
                        }
                        // 处理链接类型
                        else if (renderConfig.link) {
                          const href =
                            typeof renderConfig.href === 'function'
                              ? renderConfig.href(
                                  typeof value === 'string' ||
                                    typeof value === 'number'
                                    ? value
                                    : undefined,
                                  record,
                                  index
                                )
                              : renderConfig.href;

                          const formattedValue = formatValue(
                            value,
                            renderConfig.valueType
                          );

                          renderedValue = (
                            <Link
                              href={href || '#'}
                              target={renderConfig.target || '_blank'}
                              className='text-blue-400 cursor-pointer hover:underline'
                            >
                              {formattedValue}
                              {renderConfig.icon && (
                                <span className='ml-1'>
                                  {renderConfig.icon}
                                </span>
                              )}
                            </Link>
                          );
                        }
                        // 格式化值类型
                        else {
                          const formattedValue = formatValue(
                            value,
                            renderConfig.valueType
                          );
                          if (renderConfig.icon) {
                            renderedValue = (
                              <span className='flex items-center'>
                                {formattedValue}
                                <span className='ml-1'>
                                  {renderConfig.icon}
                                </span>
                              </span>
                            );
                          } else {
                            renderedValue = formattedValue;
                          }
                        }
                      }
                    }

                    return (
                      <td
                        key={column.key}
                        className='py-3 px-4 flex flex-col gap-1 flex-1'
                      >
                        <span className='text-xs text-foreground/50'>
                          {column.title}
                        </span>
                        <span
                          className={
                            colIndex === 1 || colIndex === 2
                              ? 'text-white font-mono'
                              : colIndex === 3
                                ? 'text-gray-300 font-mono'
                                : ''
                          }
                        >
                          {renderedValue}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {tableData.length === 0 && (
              <tr className='w-full p-6'>
                <td
                  colSpan={5}
                  className='flex flex-col w-full items-center justify-center text-foreground/50 bg-foreground/5 rounded-lg p-5 gap-2 mt-2'
                >
                  {!userAddress ? (
                    <>
                      {common('walletNotConnected')}
                      <Button
                        clipDirection='topRight-bottomLeft'
                        className='w-auto'
                      >
                        {common('connectWallet')}
                      </Button>
                    </>
                  ) : (
                    <>
                      {appendNotDataText && appendNotDataText}
                      <Button
                        clipDirection='topRight-bottomLeft'
                        className='flex-wrap text-wrap'
                        style={{
                          whiteSpace: 'wrap',
                          height: 'auto',
                        }}
                      >
                        {notDataText || common('common.nodata')}
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
          {showPagination && total > pageSizeProp && (
            <tfoot className='col-span-4'>
              <tr>
                <td colSpan={columns.length} className='text-center'>
                  <Pager
                    currentPage={currentPage}
                    totalPages={total ? Math.ceil(total / pageSizeProp) : 0}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    );
  }
);
ProTable.displayName = 'ProTable';
export default ProTable;
