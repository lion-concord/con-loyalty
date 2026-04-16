const TelegramBot = require('node-telegram-bot-api')
const bot = new TelegramBot('8784843130:AAGdJoQbyAY5Y_wn-zWtSHs05CtC8LW4VWI', { polling: true })

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '👋 Добро пожаловать в систему лояльности КОН!\n\nОткрой приложение, чтобы начать:', {
    reply_markup: {
      inline_keyboard: [[
        { text: '🚀 Открыть КОН', web app: { url: 'https://con-loyalty.vercel.app' } }
      ]]
    }
  })
})

console.log('Бот запущен!')
