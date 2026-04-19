require('dotenv/config');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const { validateInitData } = require('./validateInitData.cjs');

const BOT_TOKEN = process.env.KON_LOYALTY_BOT_TOKEN;
const WEBAPP_URL = process.env.KON_WEBAPP_URL || 'https://con-loyalty.vercel.app';
const PORT = process.env.PORT || 80;

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

// ===== Express API =====
const app = express();
app.use(cors());
app.use(express.json());

function requireTelegramAuth(req, res, next) {
  const initData = req.headers['x-telegram-init-data'];
  const data = validateInitData(initData, BOT_TOKEN);
  if (!data) {
    return res.status(401).json({ error: 'Invalid initData' });
  }
  req.tgUser = data.user;
  req.tgData = data;
  next();
}

app.get('/health', (req, res) => res.json({ ok: true, bot: '@kon_loyalty_bot' }));

app.get('/api/me', requireTelegramAuth, (req, res) => {
  res.json({ user: req.tgUser });
});

app.get('/api/balance', requireTelegramAuth, (req, res) => {
  const userId = req.tgUser.id;
  // TODO: читать баланс из БД по userId
  res.json({ userId: userId, kon: 142, level: 'bronze' });
});

app.post('/api/earn', requireTelegramAuth, (req, res) => {
  const userId = req.tgUser.id;
  const amount = req.body.amount;
  console.log('User ' + userId + ' earned ' + amount + ' KON');
  // TODO: запись в БД
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log('🌐 API server running on port ' + PORT);
});
