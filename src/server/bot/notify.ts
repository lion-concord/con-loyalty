import { bot } from './index.js';

const MANAGER_CHAT_ID = Number(process.env.MANAGER_CHAT_ID || '0');

export async function sendOrderNotification(order: {
  id: number;
  orderNumber: string;
  userId: number;
  partner: string;
  amount: number;
  konSpent: number;
}) {
  if (!bot || !MANAGER_CHAT_ID) return;
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
  } catch (e) {
    console.error('Notify error:', e);
  }
}
