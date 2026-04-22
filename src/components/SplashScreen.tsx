import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [particles] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 300 - 150,
      y: Math.random() * 300 - 150,
      delay: Math.random() * 0.3,
      duration: 1.5 + Math.random() * 0.5,
    }))
  );

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      {}
      <div style={{ position: 'absolute', inset: 0 }}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0, 
              scale: 0,
              x: 0,
              y: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: particle.x,
              y: particle.y,
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              fontSize: '24px',
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.34, 1.56, 0.64, 1],
        }}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{
            boxShadow: [
              '0 0 0px rgba(255, 107, 53, 0)',
              '0 0 40px rgba(255, 107, 53, 0.6)',
              '0 0 0px rgba(255, 107, 53, 0)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
            borderRadius: '50%',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: '4px',
            }}
          >
            КОН
          </span>
        </motion.div>
      </motion.div>

      {}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          color: '#fff',
          fontSize: '18px',
          marginTop: '30px',
          fontWeight: '300',
          letterSpacing: '2px',
          position: 'relative',
zIndex: 1,
        }}
      >
        Программа лояльности
      </motion.p>

      {}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '200px' }}
        transition={{ delay: 0.8, duration: 1.5, ease: 'easeInOut' }}
        style={{
          height: '3px',
          background: 'linear-gradient(90deg, #ff6b35 0%, #f7931e 100%)',
          marginTop: '40px',
          borderRadius: '2px',
          position: 'relative',
          zIndex: 1,
        }}
      />
    </motion.div>
  );
};
