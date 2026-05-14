import "./styles/semrek.css";
import { useState } from "react";
import type { PartnerModuleProps } from "./types";
import type { CartItem } from "./types";
import type { OrderData } from "./screens/CheckoutScreen";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import SuccessScreen from "./screens/SuccessScreen";
import AboutScreen from "./screens/AboutScreen";
import ServicesScreen from "./screens/ServicesScreen";
import PartnerCardScreen from "./screens/PartnerCardScreen";
import { products } from "./data/store";

export default function SemrekApp({ onBack, konBalance = 0, onAddKon }: PartnerModuleProps) {
  const [screen, setScreen] = useState<"home"|"catalog"|"product"|"cart"|"checkout"|"success"|"about"|"services"|"card">("home");
  const [selId, setSelId] = useState<string|null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastOrder, setLastOrder] = useState<{orderId:string;data:OrderData;items:CartItem[];total:number}|null>(null);

  const addToCart = (id:string, name:string, price:number, image:string) => {
    setCart(p => {
      const ex = p.find(i => i.id === id);
      if (ex) return p.map(i => i.id === id ? {...i, qty: i.qty + 1} : i);
      return [...p, {id, name, price, qty: 1, image}];
    });
  };

  const updateQty = (id:string, qty:number) => {
    setCart(p => p.map(i => i.id === id ? {...i, qty} : i).filter(i => i.qty > 0));
  };

  const removeItem = (id:string) => {
    setCart(p => p.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const selProduct = products.find(p => p.id === selId) || null;

  const handleCheckoutSubmit = (data: OrderData) => {
    const orderId = `SR${Date.now()}`;
    const total = cartTotal - data.cashbackUsed;
    setLastOrder({ orderId, data, items: [...cart], total });
    setCart([]);
    setScreen("success");
  };

  return (
    <div className="sr-app">
      {screen === "home" && (
        <HomeScreen
          konBalance={konBalance}
          cartCount={cart.reduce((s, i) => s + i.qty, 0)}
          onOpenCatalog={() => setScreen("catalog")}
          onOpenServices={() => setScreen("services")}
          onOpenAbout={() => setScreen("about")}
          onOpenCart={() => setScreen("cart")}
          onOpenCard={() => setScreen("card")}
          onClose={onBack}
        />
      )}
      {screen === "catalog" && <CatalogScreen initialCategory="all" onBack={() => setScreen("home")} onOpenProduct={(id) => { setSelId(id); setScreen("product"); }} />}
      {screen === "product" && selProduct && <ProductScreen productId={selProduct.id} onBack={() => setScreen("catalog")} onAddToCart={() => addToCart(selProduct.id, selProduct.name, selProduct.price, selProduct.image)} />}
      {screen === "cart" && <CartScreen items={cart} onBack={() => setScreen("home")} onUpdateQty={updateQty} onRemove={removeItem} onCheckout={() => setScreen("checkout")} />}
      {screen === "checkout" && <CheckoutScreen items={cart} onBack={() => setScreen("cart")} onSubmit={handleCheckoutSubmit} />}
      {screen === "success" && lastOrder && (
        <SuccessScreen
          orderData={{
            orderId: lastOrder.orderId,
total: lastOrder.total,
            items: lastOrder.items.map(i => ({
              name: i.name,
              qty: i.qty,
              price: i.price,
            })),
          }}
          onClose={() => setScreen("home")}
          onAddKon={onAddKon}
        />
      )}
      {screen === "card" && <PartnerCardScreen onBack={() => setScreen("home")} />}
      {screen === "about" && <AboutScreen onBack={() => setScreen("home")} />}
      {screen === "services" && <ServicesScreen onBack={() => setScreen("home")} />}
    </div>
  );
}
