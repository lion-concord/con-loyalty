import type { Boat } from "../types";

interface Props {
  boat: Boat;
  onSelect: (boat: Boat) => void;
}

export default function BoatCard({ boat, onSelect }: Props) {
  return (
    <div className="sem-boat" onClick={() => onSelect(boat)}>
      {boat.tag && <div className="sem-boat__tag">{boat.tag}</div>}
      <div className="sem-boat__top">
        <div className="sem-boat__emoji">{boat.emoji}</div>
        <div>
          <div className="sem-boat__name">{boat.name}</div>
          <div className="sem-boat__specs">
            📏 {boat.length} м &nbsp;·&nbsp; 👥 до {boat.capacity} чел.
            <br />
            ⚙ до {boat.maxMotor} л.с. &nbsp;·&nbsp; ⚖ {boat.weight} кг
          </div>
        </div>
      </div>
      <div className="sem-boat__price-row">
        <div className="sem-boat__price">{boat.price.toLocaleString("ru-RU")} ₽</div>
        <button className="sem-boat__btn">Выбрать →</button>
      </div>
    </div>
  );
}
