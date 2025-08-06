import { useState, useEffect } from "react";
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useTranslations } from "next-intl"
import {
  Card,
  CardTitle,
  Pager,
} from "~/components"
import { dayjs, formatHash, formatte2Num } from "~/lib/utils"
import { useQuery } from '@tanstack/react-query';
import List from "~/assets/list.svg"
import { inviteHisList } from "~/services/auth/invite";
import Link from "next/link";

interface InviteDataSource {
  address: string;
  createdAt: string;
  performance: string;
  stakedAmount: string;
}
const InviteRecord = () => {
  const t = useTranslations("community")
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dataSource, setDataSource] = useState<InviteDataSource[]>([])
  const [total, setTotal] = useState<number>(0)
  const common = useTranslations()
  const { userAddress } = useUserAddress()
  const pageSize = 10

  const {
    data: inviteListData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['inviteRecords', currentPage, pageSize, userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await inviteHisList(currentPage, pageSize, userAddress);
      return response;
    },
    enabled: !!userAddress,
    refetchInterval: 38000,
  })

  useEffect(() => {
    if (inviteListData) {
      setDataSource(inviteListData?.records);
      setTotal(inviteListData?.total);
    }
  }, [inviteListData])

  return (
    <Card>
      <div className="flex justify-between items-center">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <List className="w-6 h-6" />
          {t("referralList")}
        </CardTitle>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-white">{total} {t("records")}</span>
          <span className="text-xs text-foreground/50">
            {dayjs().fromNow()}
          </span>
        </div>
      </div>
      {dataSource.length === 0 && !isLoading && !isError &&
        <div className='text-white text-center py-8'>
          {common('common.nodata')}
        </div>
      }
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="space-y-2">
            {dataSource.map((item, index) => (
              <tr
                key={index}
                className="grid grid-cols-4  p-6 bg-foreground/5 rounded-md"
              >
                <td className="py-3 px-4 flex flex-col gap-1">
                  <span className="text-xs text-foreground/50">
                    {t("address")}
                  </span>
                  <Link className="text-blue-400 cursor-pointer hover:underline font-mono" href={`https://bscscan.com/address/${item?.address}`} target="_blank">
                    {formatHash(item?.address)}
                  </Link>
                </td>
                <td className="py-3 px-4 text-white font-mono flex flex-col gap-1">
                  <span className="text-xs text-foreground/50">
                    {t("netHolding")}
                  </span>
                  <span>
                    {formatte2Num.format(Number(item?.stakedAmount || 0))}{" "}
                    <span className="gradient-text"> OLY</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-white font-mono flex flex-col gap-1">
                  <span className="text-xs text-foreground/50">
                    {t("totalCommunityPerformance")}
                  </span>
                  <span>
                    {formatte2Num.format(Number(item?.performance || 0))}{" "}
                    <span className="gradient-text"> OLY</span>
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300 font-mono flex flex-col gap-1">
                  <span className="text-xs text-foreground/50">
                    {t("joinTime")}
                  </span>
                  <span>{dayjs(item?.createdAt).format("YYYY/MM/DD HH:mm:ss")}</span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="col-span-4">
            <tr>
              <td colSpan={4} className="text-center">
                {total > pageSize &&
                  <Pager
                    currentPage={currentPage}
                    totalPages={total ? Math.ceil(total / pageSize) : 0}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                }
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Card>
  )
}

export default InviteRecord;