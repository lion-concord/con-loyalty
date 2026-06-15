import express from 'express';
import { getPartnerCashback, getAllPartnerCashbacks } from '../db/queries.js';

export const cashbackRouter = express.Router();

cashbackRouter.get('/partner-cashback/:userId/:partner', (req, res) => {
  const userId = Number(req.params.userId);
  const partner = req.params.partner;
  if (!userId || !partner) return res.status(400).json({ error: 'Bad params' });
  const balance = getPartnerCashback(userId, partner);
  res.json({ userId, partner, balance });
});

cashbackRouter.get('/partner-cashback/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) return res.status(400).json({ error: 'Bad userId' });
  const list = getAllPartnerCashbacks(userId);
  res.json({ userId, cashbacks: list });
});
