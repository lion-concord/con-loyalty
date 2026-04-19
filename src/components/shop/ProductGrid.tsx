import { useState, useMemo } from "react";
import type { Product, Category } from "../../shop/types";
import { CATEGORY_LABELS } from "../../shop/products";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  cashbackPct: number;
  onProductClick?: (product: Product) => void;
};

export default function ProductGrid({
  products,
  cashbackPct,
  onProductClick,
}: Props) {
  const [selected, setSelected] = useState<Category | "all">("all");

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return Array.from(set) as Category[];
  }, [products]);

  const filtered = useMemo(() => {
if (selected === "all") return products;
    return products.filter((p) => p.category === selected);
  }, [products, selected]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        <button
          onClick={() => setSelected("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === "all"
              ? "bg-purple-500 text-white"
              : "bg-slate-800 text-slate-300 border border-slate-700"
          }`}
        >
          Все
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelected(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selected === cat
                ? "bg-purple-500 text-white"
                : "bg-slate-800 text-slate-300 border border-slate-700"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          В этой категории пока нет товаров
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cashbackPct={cashbackPct}
              onClick={onProductClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
