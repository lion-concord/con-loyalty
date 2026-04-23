interface Props {
  current: number;   // 0..5
  total: number;     // обычно 6
  labels?: string[]; // названия шагов
}

export default function StepProgress({ current, total, labels }: Props) {
  const label = labels?.[current];
  return (
    <div>
      <div className="sem-steps">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={
              "sem-steps__dot " +
              (i < current ? "sem-steps__dot--done" : i === current ? "sem-steps__dot--active" : "")
            }
          />
        ))}
      </div>
      {label && (
        <div className="sem-steps__label">
          Шаг {current + 1} из {total} · {label}
        </div>
      )}
    </div>
  );
}
