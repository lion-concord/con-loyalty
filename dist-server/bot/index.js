import { Bot } from 'grammy';
import { getPendingOrders, markOrderPaid, getUser } from '../db/queries.js';
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const MANAGER_CHAT_ID = Number(process.env.MANAGER_CHAT_ID || '1543534046');
export let bot = null;
if (BOT_TOKEN) {
    bot = new Bot(BOT_TOKEN);
    bot.command('orders', async (ctx) => {
        if (ctx.chat.id !== MANAGER_CHAT_ID)
            return;
        const orders = getPendingOrders();
        if (!orders.length) {
            await ctx.reply('Нет ожидающих заказов.');
            return;
        }
        for (const o of orders) {
            const user = getUser(o.user_id);
            const username = user?.username || String(o.user_id);
            const konEarned = 10;
            const cashback = Math.round(o.amount * 0.03);
            await ctx.reply('Заказ #' + o.order_number + '\n' +
                'Пользователь: @' + username + '\n' +
                'Партнёр: ' + o.partner + '\n' +
                'Сумма: ' + o.amount + '\n' +
                'Баллы КОН: ' + o.kon_spent + ' списано\n\n' +
                'Начислить ' + konEarned + ' баллов КОН и ' + cashback + ' руб кешбэка?\n' +
                'Ответьте: /pay_' + o.id);
        }
    });
    bot.hears(/^\/pay_(\d+)$/, async (ctx) => {
        if (ctx.chat.id !== MANAGER_CHAT_ID)
            return;
        const orderId = Number(ctx.match[1]);
        const orders = getPendingOrders();
        const o = orders.find((x) => x.id === orderId);
        if (!o) {
            await ctx.reply('Заказ не найден или уже оплачен.');
            return;
        }
        const konEarned = 10;
        const cashback = Math.round(o.amount * 0.03);
        const ok = markOrderPaid(orderId, konEarned, cashback);
        if (ok) {
            await ctx.reply('Заказ #' + o.order_number + ' подтверждён! +' + konEarned + ' КОН, ' + cashback + ' руб кешбэка начислено.');
        }
        else {
            await ctx.reply('Ошибка подтверждения.');
        }
    });
}
export function startBot() {
    if (!bot) {
        console.warn('BOT_TOKEN not set, bot skipped');
        return;
    }
    bot.start();
    console.log('Bot started, MANAGER_CHAT_ID:', MANAGER_CHAT_ID);
}
