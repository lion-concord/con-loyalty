require('dotenv/config');
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.KON_LOYALTY_BOT_TOKEN;
const WEBAPP_URL = process.env.KON_WEBAPP_URL || 'https://con-loyalty.vercel.app';

if (!BOT_TOKEN) {
  console.error('❌ KON_LOYALTY_BOT_TOKEN не установлен в .env');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const welcomeText =
  '👋 <b>Добро пожаловать в КОН!</b>\n\n' +
  '🪙 Программа лояльности на блокчейне TON.\n\n' +
  '<b>✨ Возможности:</b>\n' +
  '• Баллы КОН за покупки у партнёров\n' +
  '• Уровни KYC и кэшбэк\n' +
  '• Конвертация КОН ↔ TON\n' +
  '• Лидерборд участников\n\n' +
  '🚀 Нажмите кнопку и начните копить КОН!';

const opts = {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [[
      { text: '🪙 Открыть КОН', web_app: { url: WEBAPP_URL } }
    ]]
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, welcomeText, opts);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id,
    'ℹ️ <b>Помощь</b>\n\nОткройте Mini App кнопкой ниже:',
    opts
  );
});

bot.on('polling_error', (e) => console.error('Poll err:', e.message));

console.log('✅ Bot @kon_loyalty_bot running');
