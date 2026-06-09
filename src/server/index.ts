import express from 'express';
import cors from 'cors';
import ordersRouter from './api/orders.js';
import { startBot } from './bot/index.js';
import { initDb } from './db/init.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/orders', ordersRouter);

initDb();
startBot();

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('MANAGER_CHAT_ID at start:', process.env.MANAGER_CHAT_ID);
});

export default app;
