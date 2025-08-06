import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  List,
} from "~/components"
import { useTranslations } from "next-intl"
import { FC } from "react"

export const TurbineSummary: FC<{
  data: {
    amountToSend: React.ReactNode
    minToReceive: React.ReactNode
    yakSwapFee: string
    contractSpender: string
    recipient: string
    tokenIn: string
    tokenOut: string
  }
}> = ({ data }) => {
  const t = useTranslations("turbine")
  return (
    <Accordion type="single" collapsible defaultValue="turbine-summary">
      <AccordionItem value="turbine-summary">
        <AccordionTrigger className="hover:no-underline">
          {t("swapInformation")}
        </AccordionTrigger>
        <AccordionContent>
          <List>
            <List.Item>
              <List.Label>{t("amountToSend")}</List.Label>
              <List.Value className="font-mono">{data.amountToSend}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("minToReceive")}</List.Label>
              <List.Value className="font-mono">{data.minToReceive}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("yakSwapFee")}</List.Label>
              <List.Value className="font-mono">{data.yakSwapFee}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("contractSpender")}</List.Label>
              <List.Value className="font-mono">
                {data.contractSpender}
              </List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("recipient")}</List.Label>
              <List.Value className="font-mono">{data.recipient}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("tokenIn")}</List.Label>
              <List.Value className="font-mono">{data.tokenIn}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("tokenOut")}</List.Label>
              <List.Value className="font-mono">{data.tokenOut}</List.Value>
            </List.Item>
          </List>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
