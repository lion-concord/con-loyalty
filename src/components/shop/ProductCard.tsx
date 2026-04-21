import type { Product } from '../../shop/types';

interface Props {
  product: Product;
  cashbackPct?: number;
  onClick?: (p: Product) => void;
}

export function ProductCard({ product, cashbackPct = 2, onClick }: Props) {
  const cashbackKon = +(product.priceKon * cashbackPct / 100).toFixed(1);

  return (
    <div style={{
      display: 'flex', gap: 14, padding: 14, borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(26,18,16,0.9), rgba(15,10,8,0.9))',
      border: '1px solid rgba(249,115,22,0.15)',
      boxShadow: '0 8px 24px -8px rgba(0,0,0,0.5)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 80, height: 80,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: product.gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, flexShrink: 0,
        boxShadow: '0 8px 20px -4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
        border: '2px solid rgba(254,243,226,0.1)',
      }}>
        {product.emoji}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fef3e2', marginBottom: 2 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: '#a8927b', lineHeight: 1.3 }}>
            {product.description}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#fef3e2' }}>
              {product.priceRub} ₽
            </div>
            <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700 }}>
              или {product.priceKon} КОН
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
            <div style={{
              padding: '3px 8px', borderRadius: 6,
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              fontSize: 10, fontWeight: 700, color: '#fbbf24',
            }}>
              +{cashbackKon} {'\u2B50'}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); alert("[CARD] клик: " + product.name); onClick?.(product); }}
              style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#fff',
fontWeight: 700,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 12px -2px rgba(249,115,22,0.5)',
              }}
            >
              Купить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
