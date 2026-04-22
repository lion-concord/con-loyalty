import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'splashFadeOut 0.5s ease-out 1.5s forwards'
    }}>
      <style>{`
        @keyframes splashFadeOut {
          to { opacity: 0; }
        }
        @keyframes logoScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(251,191,36,0.5)); }
          50% { filter: drop-shadow(0 0 40px rgba(251,191,36,0.8)); }
        }
      `}</style>
      <div style={{
        fontSize: 80,
        animation: 'logoScale 2s ease-in-out infinite, glow 2s ease-in-out infinite'
      }}>
        🪙
      </div>
    </div>
  );
}
