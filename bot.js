require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getSignal } = require('./signalLogic');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Olymp Trade Signal Bot activated! You’ll start receiving alerts here.");
});

setInterval(async () => {
  try {
    const signal = await getSignal();
    if (signal) {
      const msg = `📢 *Olymp Trade Signal*\n\nDirection: *${signal}*\nTimeframe: 1 min\n\n⚠️ Use proper risk management.\n#TradeSafe`;
      bot.sendMessage(process.env.CHAT_ID, msg, { parse_mode: 'Markdown' });
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}, 60 * 1000); // every 1 minute
