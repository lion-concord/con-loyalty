import type { Boat } from "../types";

interface Props {
  boat: Boat;
  onSelect: (boat: Boat) => void;
}

export default function BoatCard({ boat, onSelect }: Props) {
  return (
    <div className="sem-boat" onClick={() => onSelect(boat)}>
      {boat.tag && <div className="sem-boat__tag">{boat.tag}</div>}

      {boat.image ? (
        <div className="sem-boat__image-wrap">
          <img 
            src={boat.image} 
            alt={boat.name}
            className="sem-boat__image"
          />
        </div>
      ) : (
        <div className="sem-boat__emoji">{boat.emoji}</div>
      )}

      <div className="sem-boat__info">
        <div className="sem-boat__name">{boat.name}</div>
        <div className="sem-boat__specs">
          📏 {boat.length} м &nbsp;·&nbsp; 👥 до {boat.capacity} чел.
          <br />
          ⚙ до {boat.maxMotor} л.с. &nbsp;·&nbsp; ⚖ {boat.weight} кг
        </div>
      </div>

      <div className="sem-boat__price-row">
        <div className="sem-boat__price">{boat.price.toLocaleString("ru-RU")} ₽</div>
        <button className="sem-boat__btn">Выбрать →</button>
      </div>
    </div>
  );
}
