import { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import './LoginScreen.css';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await login();
    } catch (err: any) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-container">
        <div className="login-logo">
          <h1>КОН</h1>
          <p>Программа лояльности</p>
        </div>

        <div className="login-content">
          <h2>Добро пожаловать!</h2>
          <p className="login-description">
            Войдите, чтобы получать баллы за покупки, участвовать в акциях и обменивать бонусы на награды
          </p>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-button vk-button"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Загрузка...</span>
            ) : (
              <>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.785 16.241s.288-.032.436-.193c.136-.148.132-.425.132-.425s-.019-1.297.574-1.487c.584-.187 1.334 1.253 2.128 1.806.602.419 1.06.327 1.06.327l2.127-.03s1.112-.07.585-.956c-.043-.072-.308-.658-1.588-1.86-1.34-1.257-1.16-1.054.453-3.228.983-1.324 1.376-2.132 1.253-2.478-.117-.33-.84-.243-.84-.243l-2.396.015s-.178-.024-.309.056c-.128.078-.21.26-.21.26s-.376.998-.877 1.846c-1.055 1.787-1.478 1.882-1.65 1.77-.4-.26-.3-1.043-.3-1.6 0-1.737.26-2.462-.507-2.65-.255-.062-.442-.103-1.093-.11-.835-.008-1.541.003-1.94.202-.266.132-.471.426-.346.443.154.02.503.095.688.35.239.328.23 1.066.23 1.066s.137 2.046-.32 2.3c-.314.175-.744-.182-1.668-1.812-.473-.827-.83-1.74-.83-1.74s-.069-.17-.192-.261c-.15-.11-.359-.145-.359-.145l-2.276.015s-.342.01-.468.16c-.112.134-.009.41-.009.41s1.765 4.17 3.764 6.27c1.833 1.926 3.915 1.8 3.915 1.8h.944z"/>
                </svg>
                Войти через VK ID
              </>
            )}
          </button>

          <p className="login-terms">
            Нажимая кнопку, вы соглашаетесь с условиями использования
          </p>
        </div>
      </div>
    </div>
  );
}
