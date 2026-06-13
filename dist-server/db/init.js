import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
const defaultData = {
    users: [],
    orders: [],
    partner_cashback: [],
    kon_history: [],
};
const adapter = new JSONFileSync('db.json');
export const db = new LowSync(adapter, defaultData);
export function initDb() {
    db.read();
    if (db.data === null) {
        db.data = defaultData;
    }
    db.write();
    console.log('Database initialized');
}
