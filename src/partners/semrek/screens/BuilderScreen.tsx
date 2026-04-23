import { useState, useMemo } from "react";
import StepProgress from "../components/StepProgress";
import {
  COLORS,
  MOTORS,
  FLOORS,
  EXTRAS,
  BASE_PRICE_BY_LENGTH,
} from "../data/boats";
import type { BuilderState, BuilderStep } from "../types";

const LENGTHS = [3.0, 3.3, 3.6, 4.0];
const STEP_LABELS = ["Длина", "Цвет", "Мотор", "Настил", "Доп.", "Итог"];

interface Props {
  onComplete: (config: BuilderState, price: number, name: string) => void;
}

export default function BuilderScreen({ onComplete }: Props) {
  const [state, setState] = useState<BuilderState>({
    step: 0,
    length: null,
    color: null,
    motor: null,
    floor: null,
    extras: [],
  });

  const price = useMemo(() => {
    let p = state.length ? BASE_PRICE_BY_LENGTH[state.length] || 0 : 0;
    p += MOTORS.find((m) => m.id === state.motor)?.price || 0;
    p += FLOORS.find((f) => f.id === state.floor)?.price || 0;
    p += state.extras.reduce(
      (sum, id) => sum + (EXTRAS.find((e) => e.id === id)?.price || 0),
      0
    );
    return p;
  }, [state]);

  const boatName = state.length ? `Семирек ${Math.round(state.length * 100)} Custom` : "Семирек Custom";

  const canNext = () => {
    switch (state.step) {
      case 0: return state.length !== null;
      case 1: return state.color !== null;
      case 2: return state.motor !== null;
      case 3: return state.floor !== null;
      case 4: return true; // доп. необязательны
      case 5: return true;
      default: return false;
    }
  };

  const go = (delta: 1 | -1) => {
    const next = Math.max(0, Math.min(5, state.step + delta)) as BuilderStep;
    setState({ ...state, step: next });
  };

  const toggleExtra = (id: string) => {
    setState({
      ...state,
      extras: state.extras.includes(id)
        ? state.extras.filter((x) => x !== id)
        : [...state.extras, id],
    });
  };

  return (
    <div>
      <div className="sem-h2">🛠 Конструктор лодки</div>
      <StepProgress current={state.step} total={6} labels={STEP_LABELS} />

      {}
      {state.step === 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Выберите длину лодки
          </div>
          <div>
            {LENGTHS.map((l) => (
              <button
                key={l}
                className={"sem-chip " + (state.length === l ? "sem-chip--active" : "")}
                onClick={() => setState({ ...state, length: l })}
              >
                {l} м · от {BASE_PRICE_BY_LENGTH[l].toLocaleString("ru-RU")} ₽
              </button>
            ))}
          </div>
        </div>
      )}

      {}
      {state.step === 1 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Цвет корпуса
          </div>
          <div>
            {COLORS.map((c) => (
              <button
                key={c.id}
                className={"sem-chip " + (state.color === c.id ? "sem-chip--active" : "")}
                onClick={() => setState({ ...state, color: c.id })}
              >
                <span
                  style={{
                    width: 16, height: 16, borderRadius: "50%",
                    background: c.hex, border: "1px solid rgba(255,255,255,0.3)",
                  }}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>
)}

      {}
      {state.step === 2 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Мотор
          </div>
          {MOTORS.map((m) => (
            <div
              key={m.id}
              className={"sem-check " + (state.motor === m.id ? "sem-check--active" : "")}
              onClick={() => setState({ ...state, motor: m.id })}
            >
              <div className="sem-check__box">{state.motor === m.id ? "✓" : ""}</div>
              <div className="sem-check__label">{m.label}</div>
              <div className="sem-check__price">
                {m.price ? "+" + m.price.toLocaleString("ru-RU") + " ₽" : "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {state.step === 3 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Настил пола
          </div>
          {FLOORS.map((f) => (
            <div
              key={f.id}
              className={"sem-check " + (state.floor === f.id ? "sem-check--active" : "")}
              onClick={() => setState({ ...state, floor: f.id })}
            >
              <div className="sem-check__box">{state.floor === f.id ? "✓" : ""}</div>
              <div className="sem-check__label">{f.label}</div>
              <div className="sem-check__price">
                {f.price ? "+" + f.price.toLocaleString("ru-RU") + " ₽" : "—"}
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {state.step === 4 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Аксессуары (можно несколько)
          </div>
          {EXTRAS.map((e) => (
            <div
              key={e.id}
              className={"sem-check " + (state.extras.includes(e.id) ? "sem-check--active" : "")}
              onClick={() => toggleExtra(e.id)}
            >
              <div className="sem-check__box">{state.extras.includes(e.id) ? "✓" : ""}</div>
              <div className="sem-check__label">
                {e.emoji} {e.label}
              </div>
              <div className="sem-check__price">
                +{e.price.toLocaleString("ru-RU")} ₽
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {state.step === 5 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Ваша конфигурация
          </div>
          <div className="sem-card">
            <div className="sem-row">
              <span className="sem-row__label">Модель</span>
              <span className="sem-row__value">{boatName}</span>
            </div>
            <div className="sem-row">
              <span className="sem-row__label">Длина</span>
              <span className="sem-row__value">{state.length} м</span>
            </div>
            <div className="sem-row">
              <span className="sem-row__label">Цвет</span>
              <span className="sem-row__value">
                {COLORS.find((c) => c.id === state.color)?.label}
              </span>
            </div>
            <div className="sem-row">
              <span className="sem-row__label">Мотор</span>
              <span className="sem-row__value">
                {MOTORS.find((m) => m.id === state.motor)?.label}
              </span>
            </div>
            <div className="sem-row">
              <span className="sem-row__label">Настил</span>
              <span className="sem-row__value">
{FLOORS.find((f) => f.id === state.floor)?.label}
              </span>
            </div>
            {state.extras.length > 0 && (
              <div className="sem-row">
                <span className="sem-row__label">Аксессуары</span>
                <span className="sem-row__value">
                  {state.extras
                    .map((id) => EXTRAS.find((e) => e.id === id)?.label)
                    .join(", ")}
                </span>
              </div>
            )}
            <div className="sem-row sem-row--total">
              <span className="sem-row__label">Итого</span>
              <span className="sem-row__value">
                {price.toLocaleString("ru-RU")} ₽
              </span>
            </div>
          </div>
        </div>
      )}

      {}
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        {state.step > 0 && (
          <button className="sem-btn sem-btn--ghost" onClick={() => go(-1)}>
            ← Назад
          </button>
        )}
        {state.step < 5 ? (
          <button className="sem-btn" onClick={() => go(1)} disabled={!canNext()}>
            Далее →
          </button>
        ) : (
          <button
            className="sem-btn"
            onClick={() => onComplete(state, price, boatName)}
          >
            Оформить заказ →
          </button>
        )}
      </div>
    </div>
  );
}
