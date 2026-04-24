import Button from "../../../shared/ui/Button";
import type { Product } from "../../../shared/types/models";

interface Props {
  product: Product;
  onBuy?: (product: Product) => void;
}

export default function ProductCard({ product, onBuy }: Props) {
  return (
    <div className="lk-card">
      <h3 style={{ marginTop: 0 }}>{product.title}</h3>
      <p className="lk-muted">{product.description}</p>
      <div style={{ fontWeight: 700, marginBottom: 12 }}>
        {product.priceKon} баллов КОН
      </div>
      <Button variant="primary" onClick={() => onBuy?.(product)}>
        Купить
      </Button>
    </div>
  );
}
