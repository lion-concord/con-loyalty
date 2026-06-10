const API_URL = import.meta.env.VITE_API_URL || 'https://con-loyalty-lev1985.amvera.io';

export interface CreateOrderPayload {
  orderNumber: string;
  userId: number;
  partner: string;
  amount: number;
  items: string;
  konSpent: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: number;
    order_number: string;
    status: string;
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch(API_URL + '/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}
