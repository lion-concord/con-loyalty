import { useState } from "react";
import pkg from "../../package.json";

const DEVELOPER = "Капутский Лев Петрович";
const SUPPORT_EMAIL = "concord_tocen@list.ru";
const APP_NAME_CRYPTO = "Токен КОН — Лояльность на КОН";
const APP_NAME_RUSTORE = "КОН — Программа лояльности";

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const isCrypto = import.meta.env.VITE_ENABLE_CRYPTO === "true";
  const appName = isCrypto ? APP_NAME_CRYPTO : APP_NAME_RUSTORE;
  const version = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? (pkg as { version?: string }).version ?? "0.0.0";
  const year = new Date().getFullYear();

  const linkStyle: React.CSSProperties = {
    color: "#cbd5e1",
    textDecoration: "none",
    cursor: "pointer",
    borderBottom: "1px dashed rgba(203,213,225,0.3)",
  };

  return (
    <>
      <footer
        style={{
          padding: "20px 16px 90px",
          color: "#94a3b8",
          fontSize: 12,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#cbd5e1", marginBottom: 4 }}>
          {appName}
        </div>
        <div style={{ opacity: 0.75, marginBottom: 10 }}>
          Версия {version}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
          <span onClick={() => setShowAbout(true)} style={linkStyle}>
            О приложении
          </span>
          <span onClick={() => setShowPrivacy(true)} style={linkStyle}>
            Конфиденциальность
          </span>
          <a href={`mailto:${SUPPORT_EMAIL}`} style={linkStyle}>
            Поддержка
          </a>
        </div>

        <div style={{ opacity: 0.7 }}>
          © {year} {DEVELOPER}
        </div>
        <div style={{ opacity: 0.6, marginTop: 2 }}>
          Все права защищены
        </div>
      </footer>

      {showAbout && (
        <Modal title="О приложении" onClose={() => setShowAbout(false)}>
          <p><b>{appName}</b></p>
          <p>Версия: {version}</p>
          <p>
            {isCrypto
              ? "Приложение программы лояльности с интеграцией TonConnect, котировками криптовалют и конвертером."
              : "Программа лояльности кофейни «КОН Coffee»: начисление баллов КОН, уровни, кешбэк, лидерборд."}
          </p>
          <p style={{ marginTop: 12 }}>
            <b>Разработчик:</b><br />
            {DEVELOPER}
          </p>
          <p>
            <b>Контакт:</b><br />
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#60a5fa" }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p style={{ opacity: 0.7, fontSize: 12, marginTop: 16 }}>
            © {year} {DEVELOPER}
          </p>
        </Modal>
      )}

      {showPrivacy && (
        <Modal title="Политика конфиденциальности" onClose={() => setShowPrivacy(false)}>
          <p style={{ opacity: 0.85, fontSize: 13 }}>
            <b>Редакция от {year} года</b>
          </p>
          <p>
            Настоящая политика описывает порядок обработки данных пользователей
            приложения «{appName}».
          </p>
          <p><b>1. Собираемые данные</b></p>
          <p>
            Приложение хранит на устройстве пользователя баланс баллов лояльности,
            историю покупок и уровень в программе. Эти данные не передаются третьим лицам.
</p>
          <p><b>2. Использование данных</b></p>
          <p>
            Данные используются исключительно для функционирования программы
            лояльности: начисления кешбэка, отображения прогресса и истории.
          </p>
          <p><b>3. Передача данных третьим лицам</b></p>
          <p>
            Приложение не передаёт персональные данные третьим лицам, за исключением
            случаев, предусмотренных законодательством РФ.
          </p>
          <p><b>4. Контакты</b></p>
          <p>
            По всем вопросам обработки данных обращайтесь:<br />
            <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "#60a5fa" }}>
              {SUPPORT_EMAIL}
            </a>
          </p>
          <p style={{ opacity: 0.6, fontSize: 11, marginTop: 16 }}>
            Это предварительная версия документа. Полный текст политики
            будет опубликован на сайте разработчика.
          </p>
        </Modal>
      )}
    </>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          maxHeight: "80vh",
          overflowY: "auto",
          background: "#0f172a",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: 16,
          padding: 20,
          color: "#e2e8f0",
          fontSize: 13,
          lineHeight: 1.6,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700 }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(148,163,184,0.3)",
              color: "#cbd5e1",
              borderRadius: 8,
              width: 30,
              height: 30,
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
        <button
          onClick={onClose}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "none",
            background: "#334155",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
