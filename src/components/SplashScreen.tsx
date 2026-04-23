import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2300); // 500ms появление + 1500ms пульсация + 300ms исчезновение
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'splashFadeOut 0.3s ease-out 2s forwards'
    }}>
      <style>{`
        @keyframes splashFadeOut {
          to { opacity: 0; }
        }
        @keyframes logoAppear {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes logoPulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 20px rgba(251,191,36,0.4));
          }
          50% { 
            transform: scale(1.05);
            filter: drop-shadow(0 0 30px rgba(251,191,36,0.6));
          }
        }
      `}</style>
      <div style={{
        fontSize: 120,
        fontWeight: 900,
        color: '#fbbf24',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        animation: 'logoAppear 0.5s ease-out, logoPulse 1.5s ease-in-out 0.5s'
      }}>
        К
      </div>
    </div>
  );
}
