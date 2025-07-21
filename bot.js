require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getSignal } = require('./utils/signalLogic');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "✅ Signal bot activated. You’ll get alerts here.");
});

// Fetch signal every minute
setInterval(async () => {
  try {
    const signal = await getSignal();
    if (signal) {
      bot.sendMessage(process.env.CHAT_ID, `📈 Olymp Signal: *${signal}*`, { parse_mode: 'Markdown' });
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}, 60 * 1000);
