import { db } from './init.js';
import type { User, Order, PartnerCashback, KonHistory } from './init.js';

export function ensureUser(telegramId: number, username?: string): User {
  db.read();
  let user = db.data!.users.find((u: User) => u.telegram_id === telegramId);
  if (!user) {
    user = {
      telegram_id: telegramId,
      username,
      kon_balance: 0,
      created_at: new Date().toISOString(),
    };
    db.data!.users.push(user);
    db.write();
  }
  return user;
}

export function getUser(telegramId: number): User | undefined {
  db.read();
  return db.data!.users.find((u: User) => u.telegram_id === telegramId);
}

export function createOrder(orderData: {
  orderNumber: string;
  userId: number;
  partner: string;
  amount: number;
  items: string;
  konSpent: number;
}): number {
  db.read();
  const id = db.data!.orders.length > 0 ? Math.max(...db.data!.orders.map((o: Order) => o.id)) + 1 : 1;
  const order: Order = {
    id,
    order_number: orderData.orderNumber,
    user_id: orderData.userId,
    partner: orderData.partner,
    amount: orderData.amount,
    items: orderData.items,
    kon_spent: orderData.konSpent,
    kon_earned: 0,
    cashback_rubles: 0,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  db.data!.orders.push(order);
  db.write();
  return id;
}

export function getOrder(id: number): Order | undefined {
  db.read();
  return db.data!.orders.find((o: Order) => o.id === id);
}

export function markOrderPaid(id: number, konEarned: number, cashbackRubles: number): boolean {
  db.read();
  const order = db.data!.orders.find((o: Order) => o.id === id);
  if (!order || order.status !== 'pending') return false;

  order.status = 'paid';
  order.kon_earned = konEarned;
  order.cashback_rubles = cashbackRubles;
  order.paid_at = new Date().toISOString();

  const user = db.data!.users.find((u: User) => u.telegram_id === order.user_id);
  if (user) {
    user.kon_balance += konEarned;
  }

  const historyId = db.data!.kon_history.length > 0 ? Math.max(...db.data!.kon_history.map((h: KonHistory) => h.id)) + 1 : 1;
db.data!.kon_history.push({
    id: historyId,
    user_id: order.user_id,
    amount: konEarned,
    type: 'earn',
    description: 'Cashback from order #' + order.order_number,
    order_id: order.id,
    created_at: new Date().toISOString(),
  });

  let pc = db.data!.partner_cashback.find((p: PartnerCashback) => p.user_id === order.user_id && p.partner === order.partner);
  if (!pc) {
    const pcId = db.data!.partner_cashback.length > 0 ? Math.max(...db.data!.partner_cashback.map((p: PartnerCashback) => p.id)) + 1 : 1;
    pc = {
      id: pcId,
      user_id: order.user_id,
      partner: order.partner,
      balance: 0,
    };
    db.data!.partner_cashback.push(pc);
  }
  pc.balance += cashbackRubles;

  db.write();
  return true;
}

export function getPendingOrders(): Order[] {
  db.read();
  return db.data!.orders.filter((o: Order) => o.status === 'pending');
}

export function addKon(
  userId: number,
  amount: number,
  type: string,
  description?: string,
  orderId?: number
): void {
  db.read();
  const id = db.data!.kon_history.length > 0 ? Math.max(...db.data!.kon_history.map((h: KonHistory) => h.id)) + 1 : 1;
  db.data!.kon_history.push({
    id,
    user_id: userId,
    amount,
    type,
    description,
    order_id: orderId,
    created_at: new Date().toISOString(),
  });

  const user = db.data!.users.find((u: User) => u.telegram_id === userId);
  if (user) {
    user.kon_balance += amount;
  }

  db.write();
}
