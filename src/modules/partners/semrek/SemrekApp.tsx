import { useState } from "react";
import type { SemrekScreen } from "./types";
import HomeScreen from "./screens/HomeScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ProductScreen from "./screens/ProductScreen";
import ServicesScreen from "./screens/ServicesScreen";
import AboutScreen from "./screens/AboutScreen";
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

  const navigate = (s: SemrekScreen) => setScreen(s);

  const goBack = () => {
    if (screen === "product") {
      setScreen("catalog");
    } else if (screen === "catalog") {
      setScreen("home");
    } else if (screen === "services" || screen === "about") {
      setScreen("home");
    } else {
      onClose();
    }
  };

  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setScreen("product");
  };

  const openCatalog = (category?: string) => {
    if (category) setSelectedCategory(category);
    setScreen("catalog");
  };

  return (
    <div className="sr-app">
      {screen === "home" && (
        <HomeScreen
          konBalance={konBalance}
          onOpenCatalog={openCatalog}
          onOpenServices={() => navigate("services")}
          onOpenAbout={() => navigate("about")}
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
        />
      )}
      {screen === "services" && (
        <ServicesScreen onBack={goBack} />
      )}
      {screen === "about" && (
        <AboutScreen onBack={goBack} />
      )}
    </div>
  );
}
