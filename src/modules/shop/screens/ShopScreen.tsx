import { useState } from "react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../../../shared/types/models";

const PRODUCTS: Product[] = [
  {
    id: "coffee-1",
    title: "Капучино",
    description: "Напиток за баллы в КОН Coffee",
    priceKon: 150,
  },
  {
    id: "dessert-1",
    title: "Десерт дня",
    description: "Сладкий бонус из магазина наград",
    priceKon: 230,
  },
];

export default function ShopScreen() {
  const [lastOrder, setLastOrder] = useState<Product | null>(null);

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2>Магазин</h2>
        <p className="lk-muted">Товары и награды за баллы КОН.</p>
      </div>

      {lastOrder && (
        <div
          className="lk-card"
          style={{ background: "#ecfdf5", borderColor: "#86efac" }}
        >
          Вы выбрали: <strong>{lastOrder.title}</strong>
        </div>
      )}

      {PRODUCTS.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onBuy={(item: Product) => setLastOrder(item)}
        />
      ))}
    </div>
  );
}
