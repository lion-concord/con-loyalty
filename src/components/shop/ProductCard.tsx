import type { Product } from "../../shop/types";

type Props = {
  product: Product;
  cashbackPct: number;
  onClick?: (product: Product) => void;
};

export default function ProductCard({ product, cashbackPct, onClick }: Props) {
  const cashback = +(product.priceKon * (cashbackPct / 100)).toFixed(1);

  return (
    <button
      type="button"
      onClick={() => onClick?.(product)}
      className="text-left flex flex-col overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 active:scale-[0.98] transition-transform"
    >
      <div
        className={`aspect-square bg-gradient-to-br ${product.gradient} flex items-center justify-center text-6xl`}
      >
        {product.emoji}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-white line-clamp-1">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-base font-bold text-white">
            {product.priceRub} ₽
          </span>
          <span className="text-xs text-slate-400">
            / {product.priceKon} КОН
          </span>
        </div>
        <div className="mt-2 text-xs text-green-400">
          +{cashback} баллов кешбэк
        </div>
      </div>
    </button>
  );
}
