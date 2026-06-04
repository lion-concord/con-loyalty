import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRouter from './api/orders.js';
import { startBot } from './bot/index.js';
import { initDb } from './db/init.js';

dotenv.config();

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
});

export default app;
