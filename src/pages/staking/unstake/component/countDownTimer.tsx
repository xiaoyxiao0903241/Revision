// components/CountdownTimer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
interface Props {
  time: string;
}
export default function CountdownTimer({ time }: Props) {
  const t = useTranslations('common');
  const getDiffSeconds = useCallback(() => {
    const now = dayjs();
    const target = dayjs(time, 'YYYY-MM-DD HH:mm:ss').add(24, 'hour');
    return Math.max(target.unix() - now.unix(), 0);
  }, [time]);

  const [diffSeconds, setDiffSeconds] = useState(getDiffSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      setDiffSeconds(getDiffSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, [getDiffSeconds]);

  // 计算小时、分钟、秒
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  if (diffSeconds === 0) {
    return <div>{t('expired')}</div>;
  }

  return (
    <div>
      {hours >= 10 ? hours : '0' + hours}
      {t('time.hours')} {minutes >= 10 ? minutes : '0' + minutes}
      {t('time.minutes')} {seconds >= 10 ? seconds : '0' + seconds}
      {t('time.seconds')}
    </div>
  );
}
