import React from "react";
import { useState, useEffect } from "react";
import { blocks as blocksNum } from "~/wallet/constants/tokens";
import { useTranslations } from "next-intl";

interface CountdownFormat {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

interface CountdownpProps {
  isShowDay?: boolean,
  isShowHour?: boolean,
  blocks: bigint,
  type?: string
}

const useCountdown = (seconds: number) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [formatted, setFormatted] = useState<CountdownFormat>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    setTimeLeft(seconds);

    if (seconds <= 0) {
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  useEffect(() => {
    const days = Math.floor(timeLeft / (24 * 60 * 60));
    const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
    const seconds = Math.floor(timeLeft % 60);
    setFormatted({
      days: days < 10 ? `0${days}` : `${days}`,
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    });
  }, [timeLeft]);

  return { formatted, timeLeft };
};

export const CountdownDisplay = ({ blocks, isShowDay = true, isShowHour = true, type = "default" }: CountdownpProps) => {
  const t = useTranslations("common");
  const remainingSeconds = Number(blocks) * blocksNum;
  const { formatted, timeLeft } = useCountdown(remainingSeconds);

  if (timeLeft <= 0) {
    return <span>
      {
        type == 'default' && t("expired")
      }
      {
        (type == 'longTerm' ||  type == 'myBonds') && t("releaseOver")
      }
    </span>;
  }

  return (
    <span>
      {
        isShowDay ? <>{formatted.days} {t("time.days")}</> : null
      }
      {
        isShowHour ? <>{formatted.hours}  {t("time.hours")}</> : null
      }

      {formatted.minutes}
      {t("time.minutes")} {formatted.seconds}
      {t("time.seconds")}
    </span>
  );
};
