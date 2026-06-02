import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';

export type User = {
  telegram_id: number;
  username?: string;
  kon_balance: number;
  created_at: string;
};

export type Order = {
  id: number;
  order_number: string;
  user_id: number;
  partner: string;
  amount: number;
  items: string;
  kon_spent: number;
  kon_earned: number;
  cashback_rubles: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at?: string;
};

export type PartnerCashback = {
  id: number;
  user_id: number;
  partner: string;
  balance: number;
};

export type KonHistory = {
  id: number;
  user_id: number;
  amount: number;
  type: string;
  description?: string;
  order_id?: number;
  created_at: string;
};

export type DbSchema = {
  users: User[];
  orders: Order[];
  partner_cashback: PartnerCashback[];
  kon_history: KonHistory[];
};

const defaultData: DbSchema = {
  users: [],
  orders: [],
  partner_cashback: [],
  kon_history: [],
};

const adapter = new JSONFileSync<DbSchema>('db.json');
export const db = new LowSync(adapter, defaultData);

export function initDb() {
  db.read();
  if (db.data === null) {
    db.data = defaultData;
  }
  db.write();
  console.log('Database initialized');
}
