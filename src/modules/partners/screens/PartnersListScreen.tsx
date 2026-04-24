import { useState } from "react";
import PartnerCard from "../components/PartnerCard";
import { usePartners } from "../hooks/usePartners";
import type { Partner } from "../../../shared/types/models";

export default function PartnersListScreen() {
  const { partners } = usePartners();
  const [selected, setSelected] = useState<Partner | null>(null);

  if (selected) {
    return (
      <div className="lk-screen">
        <div className="lk-card">
          <button
type="button"
            className="lk-btn lk-btn--ghost"
            onClick={() => setSelected(null)}
          >
            Назад
          </button>

          <h2 style={{ marginTop: 12 }}>{selected.title}</h2>
          <p className="lk-muted">{selected.subtitle}</p>

          <div className="lk-card" style={{ marginTop: 12 }}>
            {selected.hasModule ? (
              <p>
                Для этого партнёра предусмотрен отдельный модуль. Следующим шагом
                подключим открытие партнёрского экрана.
              </p>
            ) : (
              <p>
                Обычная карточка партнёра: здесь будут условия, акции, адреса и
                правила начисления баллов.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lk-screen">
      <div className="lk-card">
        <h2>Партнёры</h2>
        <p className="lk-muted">
          Каталог партнёров программы лояльности.
        </p>
      </div>

      {partners.map((partner) => (
        <PartnerCard
          key={partner.id}
          partner={partner}
          onOpen={(item) => setSelected(item)}
        />
      ))}
    </div>
  );
}
