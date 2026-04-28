import { useRef, useState, type ChangeEvent } from "react";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";
import { useAuth } from "../context/AuthProvider";

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Не удалось загрузить изображение"));
    };

    img.src = objectUrl;
  });
}

async function fileToCompressedBase64(file: File) {
  const img = await loadImage(file);

  const maxSize = 512;
  const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Не удалось создать canvas");
  }

  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

function getInitials(firstName?: string, lastName?: string) {
  const a = firstName?.trim()?.[0] ?? "";
  const b = lastName?.trim()?.[0] ?? "";
  return (a + b).toUpperCase() || "К";
}

export default function ProfileSetupScreen() {
  const { completeProfile, phone, email, goBack } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const initials = getInitials(firstName, lastName);

  const onPickAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoadingAvatar(true);
      const base64 = await fileToCompressedBase64(file);
      setAvatarUrl(base64);
    } catch {
      // ignore
    } finally {
      setIsLoadingAvatar(false);
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  return (
    <div className="lk-screen">
      <div className="lk-card lk-profile-card">
        <h2 style={{ marginTop: 0 }}>Расскажите о себе</h2>
        <p className="lk-muted">
          Заполните профиль, чтобы пользоваться личным кабинетом.
        </p>

        <div className="lk-profile-header" style={{ marginTop: 16 }}>
          <div className="lk-avatar">
            {avatarUrl ? <img src={avatarUrl} alt="Аватар" /> : <span>{initials}</span>}
          </div>

          <div style={{ minWidth: 0 }}>
            <div className="lk-profile-name">
              {[firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || "Новый участник"}
            </div>
            <div className="lk-muted" style={{ marginTop: 4 }}>
              {phone || email || "Контакт не указан"}
            </div>
          </div>
        </div>
<div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <Input
            type="text"
            placeholder="Имя"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            type="text"
            placeholder="Фамилия"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickAvatar}
            style={{ display: "none" }}
          />

          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            {isLoadingAvatar ? "Загрузка фото..." : "Добавить фото"}
          </Button>

          <Button
            variant="primary"
            onClick={() =>
              completeProfile({
                firstName: firstName.trim(),
                lastName: lastName.trim() || undefined,
                avatarUrl: avatarUrl || undefined,
                phone: phone || undefined,
                email: email || undefined,
              })
            }
            disabled={!firstName.trim() || isLoadingAvatar}
          >
            Продолжить
          </Button>

          <Button variant="secondary" onClick={goBack}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
}
