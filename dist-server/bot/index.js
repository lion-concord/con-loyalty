import { Bot, InlineKeyboard } from 'grammy';
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
            const kb = new InlineKeyboard().text('\u2705 Подтвердить (+' + konEarned + ' КОН, +' + cashback + ' \u20BD)', 'pay_' + o.id);
            await ctx.reply('Заказ #' + o.order_number + '\n' +
                'Пользователь: @' + username + '\n' +
                'Партнёр: ' + o.partner + '\n' +
                'Сумма: ' + o.amount + '\n' +
                'Баллы КОН: ' + o.kon_spent + ' списано', { reply_markup: kb });
        }
    });
    bot.on('callback_query:data', async (ctx) => {
        const data = ctx.callbackQuery.data;
        if (!data.startsWith('pay_'))
            return;
        if (ctx.chat?.id !== MANAGER_CHAT_ID) {
            await ctx.answerCallbackQuery({ text: 'Нет доступа', show_alert: true });
            return;
        }
        const orderId = Number(data.slice(4));
        const orders = getPendingOrders();
        const o = orders.find((x) => x.id === orderId);
        if (!o) {
            await ctx.answerCallbackQuery({ text: 'Заказ не найден или уже оплачен', show_alert: true });
            return;
        }
        const konEarned = 10;
        const cashback = Math.round(o.amount * 0.03);
        const ok = markOrderPaid(orderId, konEarned, cashback);
        if (ok) {
            await ctx.editMessageText('\u2705 Заказ #' + o.order_number + ' подтверждён!\n' +
                '+' + konEarned + ' КОН, +' + cashback + ' \u20BD кешбэка начислено клиенту.');
            await ctx.answerCallbackQuery({ text: 'Заказ подтверждён' });
        }
        else {
            await ctx.answerCallbackQuery({ text: 'Ошибка подтверждения', show_alert: true });
        }
    });
    bot.catch((err) => {
        if (err?.error?.error_code === 409) {
            console.warn('409 Conflict: another bot instance, ignoring...');
        }
        else {
            console.error('Bot error:', err);
        }
    });
}
let botStarted = false;
export function startBot() {
    if (!bot) {
        console.warn('BOT_TOKEN not set, bot skipped');
        return;
    }
    if (botStarted) {
        console.warn('Bot already started, skipping');
        return;
    }
    botStarted = true;
    bot.start({
        onStart: (info) => console.log('Bot started as @' + info.username),
    }).catch((err) => {
        if (err?.error_code === 409 || err?.message?.includes('409')) {
            console.warn('409 Conflict: another bot instance running, retrying in 10s...');
            botStarted = false;
            setTimeout(() => startBot(), 10000);
        }
        else {
            console.error('Bot start error:', err);
        }
    });
    console.log('Bot starting, MANAGER_CHAT_ID:', MANAGER_CHAT_ID);
}
