// v2
import { Router } from "express";
import { createOrder, getOrder, markOrderPaid, getPendingOrders } from "../db/queries.js";
import { sendOrderNotification } from "../bot/notify.js";

const router = Router();

router.post("/", async (req, res) => {
  const { orderNumber, userId, partner, amount, items, konSpent } = req.body;

  if (!orderNumber || !userId || !partner || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const orderId = createOrder({
      orderNumber,
      userId: Number(userId),
      partner,
      amount: Number(amount),
      items: JSON.stringify(items || []),
      konSpent: Number(konSpent || 0),
    });

    const order = getOrder(Number(orderId));

    // Отправляем уведомление менеджеру
    await sendOrderNotification({
      id: Number(orderId),
      orderNumber,
      userId: Number(userId),
      partner,
      amount: Number(amount),
      konSpent: Number(konSpent || 0),
    });

    res.json({ success: true, order });
  } catch (e) {
    console.error("Create order error:", e);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/pending", (_req, res) => {
  try {
    const orders = getPendingOrders();
    res.json({ orders });
  } catch (e) {
    res.status(500).json({ error: "DB error" });
  }
});

router.post("/:id/pay", (req, res) => {
  const { konEarned, cashbackRubles } = req.body;
  const ok = markOrderPaid(Number(req.params.id), Number(konEarned), Number(cashbackRubles));
  if (!ok) return res.status(400).json({ error: "Order not found or already paid" });
  res.json({ success: true });
});
export default router;


