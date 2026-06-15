import { bot } from './index.js';
import { InlineKeyboard } from 'grammy';

const FALLBACK_MANAGER_ID = 1543534046;

export async function sendOrderNotification(order: {
  id: number;
  orderNumber: string;
  userId: number;
  partner: string;
  amount: number;
  konSpent: number;
  contactName?: string;
  contactPhone?: string;
  deliveryRegion?: string;
  deliveryMethod?: string;
  deliveryAddress?: string;
}) {
  const MANAGER_CHAT_ID = Number(process.env.MANAGER_CHAT_ID || FALLBACK_MANAGER_ID);
  console.log('notify called, bot:', !!bot, 'MANAGER_CHAT_ID:', MANAGER_CHAT_ID);
  if (!bot) { console.error('Bot is null!'); return; }
  if (!MANAGER_CHAT_ID) { console.error('MANAGER_CHAT_ID is 0!'); return; }

  const konEarned = 10;
  const cashback = Math.round(order.amount * 0.03);

  const kb = new InlineKeyboard().text(
    '\u2705 Подтвердить оплату (+' + konEarned + ' КОН, +' + cashback + ' \u20BD кешбэк)',
    'pay_' + order.id
  );

  const lines = [
    '\u{1F6D2} Новый заказ #' + order.orderNumber,
    'Партнёр: ' + order.partner,
    'Сумма: ' + order.amount.toLocaleString('ru-RU') + ' \u20BD',
    'Списано баллов КОН: ' + order.konSpent,
    '',
    '\u{1F464} Клиент:',
    '  Имя: ' + (order.contactName || '—'),
    '  Телефон: ' + (order.contactPhone || '—'),
    '',
    '\u{1F4E6} Доставка:',
    '  Регион: ' + (order.deliveryRegion || '—'),
    '  Способ: ' + (order.deliveryMethod || '—'),
    '  Адрес: ' + (order.deliveryAddress || '—'),
    '',
    '\u{1F4B0} Начислить: ' + konEarned + ' КОН + ' + cashback + ' \u20BD кешбэк',
  ];

  try {
    await bot.api.sendMessage(MANAGER_CHAT_ID, lines.join('\n'), { reply_markup: kb });
    console.log('Notification sent OK!');
  } catch (e: any) {
    console.error('Notify error:', e?.message || e);
  }
}
