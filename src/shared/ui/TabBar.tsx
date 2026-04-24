export type LkTab =
  | "home"
  | "partners"
  | "qr"
  | "history"
  | "profile"
  | "shop";

interface Props {
  activeTab: LkTab;
  onChange: (tab: LkTab) => void;
}

const tabs: Array<{ key: LkTab; label: string }> = [
  { key: "home", label: "Главная" },
  { key: "partners", label: "Партнёры" },
  { key: "qr", label: "QR" },
  { key: "history", label: "История" },
  { key: "profile", label: "Профиль" },
];

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <div className="lk-tabbar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={
            tab.key === activeTab
              ? "lk-tabbar__item is-active"
              : "lk-tabbar__item"
          }
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
