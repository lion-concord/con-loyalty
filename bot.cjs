require('dotenv/config');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const { validateInitData } = require('./validateInitData.cjs');
const { initSchema, getOrCreateUser, addKon } = require('./db.cjs');

const BOT_TOKEN = process.env.KON_LOYALTY_BOT_TOKEN;
const WEBAPP_URL = process.env.KON_WEBAPP_URL || 'https://con-loyalty.vercel.app';
const PORT = process.env.PORT || 80;

if (!BOT_TOKEN) {
  console.error('KON_LOYALTY_BOT_TOKEN not set');
  process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const welcomeText =
  'Добро пожаловать в КОН!\n\n' +
  'Программа лояльности на блокчейне TON.\n\n' +
  'Нажмите кнопку и начните копить КОН!';

const opts = {
  reply_markup: {
    inline_keyboard: [[
      { text: 'Открыть КОН', web_app: { url: WEBAPP_URL } }
    ]]
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, welcomeText, opts);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Откройте Mini App кнопкой ниже:', opts);
});

bot.on('polling_error', (e) => console.error('Poll err:', e.message));

console.log('Bot @kon_loyalty_bot running');

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
  next();
}

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/api/me', requireTelegramAuth, (req, res) => {
  res.json({ user: req.tgUser });
});

app.get('/api/balance', requireTelegramAuth, async (req, res) => {
  try {
    const user = await getOrCreateUser(req.tgUser);
    res.json({ userId: user.telegram_id, kon: user.kon, level: user.level });
  } catch (e) {
    console.error('balance error:', e);
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/earn', requireTelegramAuth, async (req, res) => {
  const amount = Number(req.body.amount);
  const reason = req.body.reason || 'manual';
  if (!Number.isFinite(amount) || amount === 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  try {
    await getOrCreateUser(req.tgUser);
    const result = await addKon(req.tgUser.id, amount, reason);
    res.json({ ok: true, kon: result.kon, level: result.level });
  } catch (e) {
    console.error('earn error:', e);
    res.status(500).json({ error: 'DB error' });
  }
});

initSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log('API server on port ' + PORT);
    });
  })
  .catch((e) => {
    console.error('DB init failed:', e);
    process.exit(1);
  });

