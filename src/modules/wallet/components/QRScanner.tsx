import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";

interface QRScannerProps {
  onScan: (text: string) => void;
  onCancel: () => void;
}

export default function QRScanner({ onScan, onCancel }: QRScannerProps) {
  const [mode, setMode] = useState<"camera" | "file" | "manual">("camera");
  const [manualText, setManualText] = useState("");
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (mode !== "camera") { stopCamera(); return; }
    setError("");
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        const tick = () => {
          if (!canvasRef.current || !videoRef.current) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imgData.data, canvas.width, canvas.height);
              if (code && code.data) {
                stopCamera();
                onScan(code.data);
                return;
              }
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      })
      .catch(() => setError("Нет доступа к камере. Разрешите в настройках или используйте загрузку фото."));
    return () => stopCamera();
  }, [mode, onScan, stopCamera]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, canvas.width, canvas.height);
        if (code && code.data) {
          onScan(code.data);
        } else {
          setError("QR-код не найден. Попробуйте другое фото.");
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleManual = () => {
    const text = manualText.trim();
    if (!text) { setError("Введите данные чека"); return; }
    onScan(text);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a1929 0%, #0d1f33 100%)", color: "#fff", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "#7cc1ff", fontSize: 16, cursor: "pointer" }}>← Назад</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>📷 Сканировать чек</div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={() => setMode("camera")} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: mode === "camera" ? "#3b82f6" : "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>Камера</button>
        <button onClick={() => { stopCamera(); setMode("file"); }} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: mode === "file" ? "#3b82f6" : "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>Фото</button>
        <button onClick={() => { stopCamera(); setMode("manual"); }} style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: mode === "manual" ? "#3b82f6" : "rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer" }}>Вручную</button>
      </div>

      {mode === "camera" && (
        <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "#000", aspectRatio: "3/4" }}>
          <video ref={videoRef} style={{ width: "100%", height: "100%", objectFit: "cover" }} playsInline muted />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 200, height: 200, border: "2px dashed rgba(120,170,255,0.5)", borderRadius: 12 }} />
          </div>
        </div>
      )}

      {mode === "file" && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <input type="file" accept="image/*" onChange={handleFile} id="qr-file" style={{ display: "none" }} />
          <label htmlFor="qr-file" style={{ display: "inline-block", padding: "16px 32px", borderRadius: 16, background: "#3b82f6", color: "#fff", fontWeight: 600, cursor: "pointer" }}>📁 Выбрать фото чека</label>
        </div>
      )}

      {mode === "manual" && (
        <div>
          <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Вставьте текст QR-кода или данные чека..."
            style={{ width: "100%", minHeight: 100, padding: 14, borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", resize: "vertical" }} />
          <button onClick={handleManual} style={{ marginTop: 12, width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Добавить</button>
        </div>
      )}

      {error && <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 14 }}>{error}</div>}
    </div>
  );
}
