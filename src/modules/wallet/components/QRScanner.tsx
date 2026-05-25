import { useState, useRef, useEffect, useCallback } from "react";
import jsQR from "jsqr";

interface QRScannerProps {
  onScan: (text: string) => void;
  onCancel: () => void;
}

export default function QRScanner({ onScan, onCancel }: QRScannerProps) {
  const [mode, setMode] = useState<"camera" | "file" | "manual">("file");
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
      .catch(() => setMode("file"));
    return () => stopCamera();
  }, [mode, onScan, stopCamera]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("Обработка...");
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Пробуем оригинал и уменьшенную версию
        const tryDecode = (w: number, h: number) => {
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return null;
          ctx.drawImage(img, 0, 0, w, h);
          const imgData = ctx.getImageData(0, 0, w, h);
          // Grayscale + контраст
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
            data[i] = data[i+1] = data[i+2] = gray;
          }
          ctx.putImageData(imgData, 0, 0);
          return jsQR(data, w, h, { inversionAttempts: "attemptBoth" });
        };

        // Пробуем оригинал
        let code = tryDecode(img.width, img.height);
        // Пробуем уменьшенный (часто QR лучше читается при downscale)
        if (!code) code = tryDecode(Math.floor(img.width * 0.5), Math.floor(img.height * 0.5));
        // Пробуем увеличенный
        if (!code) code = tryDecode(Math.floor(img.width * 1.5), Math.floor(img.height * 1.5));
        // Пробуем 800px по ширине
        if (!code) {
          const ratio = 800 / img.width;
          code = tryDecode(800, Math.floor(img.height * ratio));
        }

        if (code && code.data) {
          setError("");
          onScan(code.data);
        } else {
          setError("QR-код не найден на фото. Попробуйте режим «Вручную» и вставьте текст QR.");
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
          <textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Описание траты, например: такси, автобус, продукты"
            style={{ width: "100%", minHeight: 100, padding: 14, borderRadius: 12, border: "1px solid rgba(120,170,255,0.2)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: 14, outline: "none", resize: "vertical" }} />
          <button onClick={handleManual} style={{ marginTop: 12, width: "100%", padding: "14px", borderRadius: 12, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Добавить</button>
        </div>
      )}

      {error && <div style={{ marginTop: 16, padding: 12, borderRadius: 12, background: "rgba(239,68,68,0.15)", color: "#f87171", fontSize: 14 }}>{error}</div>}
    </div>
  );
}
