import { useAuth } from './context/AuthProvider';
import LoginScreen from './screens/LoginScreen';
import LkRouter from '../../app/LkRouter';

export default function AuthRouter() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <LkRouter />;
}
