import { useState, useCallback } from "react";
import type { SemrekScreen, CartItem } from "./types";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ProductScreen from "./screens/ProductScreen";
import ServicesScreen from "./screens/ServicesScreen";
import AboutScreen from "./screens/AboutScreen";
import CartScreen from "./screens/CartScreen";
import "./styles/semrek.css";

export interface Props {
  onClose: () => void;
  konBalance?: number;
  onAddKon?: (amount: number) => void;
  partnerCardBalance?: number;
  onAddPartnerCashback?: (amount: number) => void;
  onSpendPartnerCashback?: (amount: number) => void;
}

export default function SemrekApp({
  onClose,
  konBalance = 0,
}: Props) {
  const [screen, setScreen] = useState<SemrekScreen>("home");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const navigate = (s: SemrekScreen) => setScreen(s);

  const goBack = () => {
    if (screen === "product") setScreen("catalog");
    else if (screen === "catalog") setScreen("home");
    else if (screen === "cart") setScreen("home");
    else if (screen === "services" || screen === "about") setScreen("home");
    else onClose();
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setScreen("product");
  };

  const openCatalog = (category?: string) => {
    if (category) setSelectedCategory(category);
    setScreen("catalog");
  };

  const addToCart = useCallback((id: string, name: string, price: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id, name, price, qty: 1 }];
    });
    alert(`«${name}» добавлен в корзину`);
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCartItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="sr-app">
      {screen === "home" && (
        <HomeScreen
          konBalance={konBalance}
          cartCount={cartCount}
          onOpenCatalog={openCatalog}
          onOpenServices={() => navigate("services")}
          onOpenAbout={() => navigate("about")}
          onOpenCart={() => navigate("cart")}
          onClose={onClose}
        />
      )}
      {screen === "catalog" && (
        <CatalogScreen
          initialCategory={selectedCategory}
          onBack={goBack}
          onOpenProduct={openProduct}
        />
      )}
      {screen === "product" && selectedProductId && (
        <ProductScreen
          productId={selectedProductId}
          onBack={goBack}
          onAddToCart={addToCart}
        />
      )}
      {screen === "services" && <ServicesScreen onBack={goBack} />}
      {screen === "about" && <AboutScreen onBack={goBack} />}
      {screen === "cart" && (
        <CartScreen
          items={cartItems}
onBack={goBack}
          onUpdateQty={updateQty}
          onRemove={removeFromCart}
          onCheckout={() => alert("Заказ оформлен! Менеджер свяжется с вами.")}
        />
      )}
    </div>
  );
}
