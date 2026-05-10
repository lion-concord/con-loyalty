export type LkTab =
  | "home"
  | "partners"
  | "qr"
  | "history"
  | "notifications"
  | "profile";

interface Props {
  activeTab: LkTab;
  onChange: (tab: LkTab) => void;
}

const tabs: Array<{ key: LkTab; label: string; icon: string }> = [
  { key: "home", label: "Главная", icon: "⌂" },
  { key: "partners", label: "Партнёры", icon: "✦" },
  { key: "qr", label: "QR", icon: "▣" },
  { key: "history", label: "История", icon: "◷" },
  { key: "notifications", label: "Уведомления", icon: "◉" },
  { key: "profile", label: "Профиль", icon: "☺" },
];

export default function TabBar({ activeTab, onChange }: Props) {
  return (
    <div className="lk-tabbar lg-nav">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          className={
            tab.key === activeTab
              ? "lk-tabbar__item is-active lg-button"
              : "lk-tabbar__item lg-button"
          }
          onClick={() => onChange(tab.key)}
        >
          <span className="lk-tabbar__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="lk-tabbar__label">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
