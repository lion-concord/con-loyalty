import type { Product } from '../../shop/types';

const emojiMap: Record<string, string> = {
  'эспрессо': '☕', 'капучино': '🫖', 'латте': '🥛',
  'раф': '🍮', 'флэт': '☕', 'матча': '🍵', 'чай': '🍵',
  'десерт': '🍰', 'выпечка': '🥐', 'еда': '🥪',
};

const pickEmoji = (name: string) => {
  const lower = name.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lower.includes(key)) return emoji;
  }
  return '☕';
};

const gradientFor = (name: string) => {
  const palette = [
    'linear-gradient(135deg, #78350f, #a16207)',
    'linear-gradient(135deg, #7c2d12, #c2410c)',
    'linear-gradient(135deg, #422006, #854d0e)',
    'linear-gradient(135deg, #451a03, #9a3412)',
    'linear-gradient(135deg, #713f12, #d97706)',
  ];
  const hash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return palette[hash % palette.length];
};

interface Props {
  product: Product;
  onBuy?: (p: Product) => void;
}

export function ProductCard({ product, onBuy }: Props) {
  const cashback = +(product.price * 0.02 / 12.9).toFixed(1);

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
        background: gradientFor(product.name),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, flexShrink: 0,
        boxShadow: '0 8px 20px -4px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
        border: '2px solid rgba(254,243,226,0.1)',
      }}>
        {pickEmoji(product.name)}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: '#fef3e2', marginBottom: 2 }}>
            {product.name}
</div>
          <div style={{ fontSize: 11, color: '#a8927b', lineHeight: 1.3 }}>
            {(product as any).description || 'Классический напиток'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, gap: 8 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#fef3e2' }}>
              {product.price} ₽
            </div>
            <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700 }}>
              или {(product.price / 12.9).toFixed(1)} КОН
            </div>
          </div>

          <div style={{
            padding: '4px 10px', borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(251,146,60,0.15))',
            border: '1px solid rgba(249,115,22,0.4)',
            fontSize: 10, fontWeight: 800, color: '#fb923c', whiteSpace: 'nowrap',
          }}>
            +{cashback} ⭐
          </div>

          <button onClick={() => onBuy?.(product)} style={{
            padding: '8px 14px', borderRadius: 12,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            border: 'none', color: '#fff', fontWeight: 800, fontSize: 12,
            cursor: 'pointer', boxShadow: '0 6px 16px -4px rgba(249,115,22,0.5)',
          }}>
            Купить
          </button>
        </div>
      </div>
    </div>
  );
}
