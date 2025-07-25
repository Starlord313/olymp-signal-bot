const axios = require('axios');
const ti = require('technicalindicators');

async function getSignal() {
  try {
    const res = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: 'BTCUSDT',
        interval: '1m',
        limit: 100
      }
    });

    const candles = res.data.map(c => ({
      open: parseFloat(c[1]),
      high: parseFloat(c[2]),
      low: parseFloat(c[3]),
      close: parseFloat(c[4]),
    }));

    const closes = candles.map(c => c.close);

    // RSI
    const rsi = ti.RSI.calculate({ values: closes, period: 14 });
    const lastRSI = rsi[rsi.length - 1];

    // EMA
    const ema5 = ti.EMA.calculate({ values: closes, period: 5 });
    const ema13 = ti.EMA.calculate({ values: closes, period: 13 });
    const lastEma5 = ema5[ema5.length - 1];
    const lastEma13 = ema13[ema13.length - 1];

    // MACD
    const macdInput = {
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    const macd = ti.MACD.calculate(macdInput);
    const lastMacd = macd[macd.length - 1];

    // Signal logic
    if (
      lastRSI < 30 &&
      lastEma5 > lastEma13 &&
      lastMacd.MACD > lastMacd.signal
    ) {
      return "CALL (BUY)";
    } else if (
      lastRSI > 70 &&
      lastEma5 < lastEma13 &&
      lastMacd.MACD < lastMacd.signal
    ) {
      return "PUT (SELL)";
    }

    return null;

  } catch (err) {
    console.error("Signal logic error:", err.message);
    return null;
  }
}

module.exports = { getSignal };
