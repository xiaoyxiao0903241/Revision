import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { Button, Card, Input, List, Slider, View } from '~/components';
import {
  formatCurrency,
  formatDecimal,
  formatNumbedecimalScale,
} from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';

export const Unlockcalculator: FC<{
  rateEnabled?: boolean;
}> = ({ rateEnabled = false }) => {
  const t = useTranslations('staking');
  const { allnetReabalseNum, AllolyStakeNum, olyPrice } = useNolockStore();
  // 计算器状态
  const [amount, setAmount] = useState('');
  const [stakingDuration, setStakingDuration] = useState(1);
  const [rebaseApy, setRebaseApy] = useState(0.3);
  const [currentOlyPrice, setOlyPrice] = useState(60);
  const [addAmount, setAddAmount] = useState(0.02);
  const [nowOlyPrice, setNowOlyPrice] = useState(2);
  const [apy, setApy] = useState<string>('0');

  // 计算模拟收益
  const calculateRewards = () => {
    const num = Number(amount) / olyPrice;
    const rebaseProfit =
      num *
      (Math.pow(1 + Number(rebaseApy) / 100, 2 * stakingDuration * 30) - 1);
    const myProfitUsdt =
      (rebaseProfit + num) * currentOlyPrice - Number(amount);

    const durationInMonths = stakingDuration;
    const roi = (myProfitUsdt / Number(amount)) * 100;
    const apr = (roi / stakingDuration) * 12;
    return {
      duration: `${durationInMonths} ${t('months')}`,
      rebaseApy: `${rebaseApy}%`,
      yourStake: formatCurrency(Number(amount)),
      yourReward: formatCurrency(myProfitUsdt),
      roi: `${formatDecimal(roi)}%`,
      apr: `${formatDecimal(apr)}%`,
    };
  };

  const results = calculateRewards();
  //计算下一次爆块收益率
  useEffect(() => {
    if (allnetReabalseNum && AllolyStakeNum) {
      const rate = formatNumbedecimalScale(
        (allnetReabalseNum / AllolyStakeNum) * 100,
        4
      );
      setApy(rate);
      setRebaseApy(Number(rate));
    }
  }, [allnetReabalseNum, AllolyStakeNum]);

  useEffect(() => {
    setOlyPrice(Number(formatNumbedecimalScale(olyPrice, 2)));
    setNowOlyPrice(Number(formatNumbedecimalScale(olyPrice, 2)));
  }, [olyPrice]);
  return (
    <Card className='p-6'>
      {/* 金额输入 */}
      <View className='space-y-2 bg-secondary/20 p-4'>
        <label className='text-sm font-medium text-white'>{t('amount')}</label>
        <div className='flex gap-2'>
          <Input.Number
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
            placeholder='0.0'
            step={0.000001}
            className='flex-1 text-white text-3xl font-bold font-mono'
          />
        </div>
        <p className='text-sm text-foreground/50 text-right'>
          {t('latestOlyPrice', { amount: formatDecimal(olyPrice) })}
        </p>
      </View>
      <View className='flex flex-col space-y-9 bg-secondary/20 p-4'>
        {/* 质押期限滑块 */}
        <div className='flex flex-col space-y-4'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium text-white'>
              {t('stakingDuration')}
            </label>
            {rateEnabled && (
              <div className='flex items-center gap-2'>
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => {
                    if (addAmount > 0.02) {
                      setAddAmount(addAmount - 0.01);
                    }
                  }}
                  className='w-8 h-8 p-0'
                >
                  -
                </Button>
                <span className='text-sm border-2 border-[#576AF4]/50 px-2 text-white min-w-[40px] text-center shadow-[inset_0_0_10px_rgba(87,106,244,0.4)]'>
                  x{addAmount.toFixed(2)}
                </span>
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => {
                    if (addAmount < 0.09) {
                      setAddAmount(addAmount + 0.01);
                    }
                  }}
                  className='w-8 h-8 p-0'
                >
                  +
                </Button>
              </div>
            )}
          </div>
          <Slider
            value={[stakingDuration]}
            onValueChange={value => setStakingDuration(value[0])}
            max={12}
            min={1}
            step={1}
            indicators={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => ({
              value: item,
              label: `${item}`,
            }))}
          />
        </div>

        {/* 重基APY滑块 */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white'>
            {t('rebaseApy', { value: rebaseApy })}
            {Number(apy) === rebaseApy ? `(当前)` : null}
          </label>
          <Slider
            value={[rebaseApy]}
            onValueChange={value => setRebaseApy(value[0])}
            min={0.3}
            max={1.0}
            step={0.01}
            indicators={[0.3, 0.5, 0.7, 0.9, 1.0].map(item => ({
              value: item,
              label: `${item}%`,
            }))}
          />
        </div>

        {/* OLY价格滑块 */}
        <div className='space-y-4'>
          <label className='text-sm font-medium text-white'>
            {t('olyPrice', { value: currentOlyPrice })}
            {currentOlyPrice === nowOlyPrice ? '(当前)' : ''}
          </label>
          <Slider
            value={[currentOlyPrice]}
            onValueChange={value => setOlyPrice(value[0])}
            max={100}
            min={1}
            step={0.01}
            indicators={[1, 20, 40, 60, 80, 100].map(item => ({
              value: item,
              label: `$${formatDecimal(item, 0)}`,
            }))}
          />
        </div>

        {/* 计算结果 */}
        <div className='space-y-3 pt-6'>
          <List>
            <List.Item>
              <List.Label>{t('duration')}</List.Label>
              <List.Value>{results.duration}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t('rebaseApyLabel')}</List.Label>
              <List.Value className='text-success'>
                {results.rebaseApy}
              </List.Value>
            </List.Item>

            <List.Item>
              <List.Label>{t('yourStake')}</List.Label>
              <List.Value>{results.yourStake}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t('yourReward')}</List.Label>
              <List.Value>{results.yourReward}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t('roi')}</List.Label>
              <List.Value>{results.roi}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t('apr')}</List.Label>
              <List.Value>{results.apr}</List.Value>
            </List.Item>
          </List>
        </div>
      </View>
    </Card>
  );
};
