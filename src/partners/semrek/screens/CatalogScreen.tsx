import BoatCard from "../components/BoatCard";
import { BOATS } from "../data/boats";
import type { Boat } from "../types";

interface Props {
  onSelectBoat: (boat: Boat) => void;
}

export default function CatalogScreen({ onSelectBoat }: Props) {
  return (
    <div>
      <div className="sem-h2">🛥 Каталог лодок</div>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16, lineHeight: 1.5 }}>
        Готовые модели в наличии. Выбирайте, оформляйте — и&nbsp;на&nbsp;воду!
      </div>

      {BOATS.map((boat) => (
        <BoatCard key={boat.id} boat={boat} onSelect={onSelectBoat} />
      ))}

      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: 12,
          opacity: 0.6,
          lineHeight: 1.6,
        }}
      >
        Не нашли подходящую? <br />
        Соберите свою в&nbsp;🛠&nbsp;конструкторе.
      </div>
    </div>
  );
}
