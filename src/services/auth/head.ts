export const bnbPrice = async () => {
  const res = await fetch(
    'https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT'
  );
  const data = await res.json();
  return data.price;
};
