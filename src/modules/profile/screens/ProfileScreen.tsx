import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Button from "../../../shared/ui/Button";
import { useAuth } from "../../auth/context/AuthProvider";
import { signOut } from "../../../services/auth";

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

export default function ProfileScreen() {
  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setAvatarUrl(user?.avatarUrl ?? "");
  }, [user]);

  const initials = useMemo(
    () => getInitials(firstName, lastName),
    [firstName, lastName]
  );

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingAvatar(true);
    try {
      const base64 = await fileToCompressedBase64(file);
      setAvatarUrl(base64);
      console.log("Avatar updated");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Не удалось загрузить фото");
    } finally {
      setIsLoadingAvatar(false);
    }
  }

  function handleSave() {
    console.log("Profile saved:", { firstName, lastName, avatarUrl });
    alert("Профиль сохранён");
  }

  async function handleLogout() {
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <h1>Профиль</h1>
      </div>

      <div className="profile-content">
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
            {isLoadingAvatar && (
<div className="profile-avatar-loading">Загрузка...</div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />

          <div className="profile-avatar-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileRef.current?.click()}
              disabled={isLoadingAvatar}
            >
              Изменить фото
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setAvatarUrl("")}
              >
                Удалить фото
              </Button>
            )}
          </div>
        </div>

        <div className="profile-form">
          <div className="profile-info">
            <p className="profile-contact">
              {user?.phone || user?.email}
            </p>
          </div>

          <div className="form-field">
            <label>Имя</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Введите имя"
            />
          </div>

          <div className="form-field">
            <label>Фамилия</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Введите фамилию"
            />
          </div>

          <Button type="button" onClick={handleSave}>
            Сохранить
          </Button>

          <Button type="button" variant="secondary" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}
