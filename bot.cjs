const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot('8784843130:AAGdJoQbyAY5Y_wn-zWtSHs0SCtc8LW4VWI', {polling: true})
bot.onText(/\/start/, (msg) => {
  const opts = {reply_markup: {inline_keyboard: [[{text: 'Open KON', web_app: {url: 'https://con-loyalty.vercel.app'}}]]}}
  bot.sendMessage(msg.chat.id, 'Welcome to KON!', opts)
})
console.log('Bot OK')
