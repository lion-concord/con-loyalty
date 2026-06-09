import { bot } from './index.js';

const FALLBACK_MANAGER_ID = 1543534046;

export async function sendOrderNotification(order: {
  id: number;
  orderNumber: string;
  userId: number;
  partner: string;
  amount: number;
  konSpent: number;
}) {
  const MANAGER_CHAT_ID = Number(process.env.MANAGER_CHAT_ID || FALLBACK_MANAGER_ID);
  console.log('notify called, bot:', !!bot, 'MANAGER_CHAT_ID:', MANAGER_CHAT_ID);
  if (!bot) { console.error('Bot is null!'); return; }
  if (!MANAGER_CHAT_ID) { console.error('MANAGER_CHAT_ID is 0!'); return; }

  const konEarned = 10;
  const cashback = Math.round(order.amount * 0.03);

  try {
    await bot.api.sendMessage(
      MANAGER_CHAT_ID,
      '🛒 Новый заказ #' + order.orderNumber + '\n' +
      'Партнёр: ' + order.partner + '\n' +
      'Сумма: ' + order.amount + ' ₽\n' +
      'Списано баллов КОН: ' + order.konSpent + '\n\n' +
      'Начислить ' + konEarned + ' баллов КОН и ' + cashback + ' ₽ кешбэка?\n' +
      'Ответьте: /pay_' + order.id
    );
    console.log('Notification sent OK!');
  } catch (e: any) {
    console.error('Notify error:', e?.message || e);
  }
}
