import { Config, Auth, Scheme, Languages } from '@vkid/sdk';
import type { AuthResponse } from '@vkid/sdk';

export interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
  email?: string;
}

class VKIDService {
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;

    const appId = import.meta.env.VITE_VK_APP_ID || '54574930';

    Config.init({
      app: parseInt(appId),
      redirectUrl: window.location.origin,
      state: 'con-loyalty-auth',
      scope: 'email phone',
    });

    this.isInitialized = true;
  }

  async login(): Promise<VKUser> {
    this.init();

    try {
      // Запускаем авторизацию через глобальный Auth
      const authResponse = await Auth.login({
        scheme: Scheme.LIGHT,
        lang: Languages.RUS,
      }) as AuthResponse;

      // Обмениваем код на токен
      const tokenResult = await Auth.exchangeCode(
        authResponse.code,
        authResponse.device_id
      );

      // Сохраняем токен
      localStorage.setItem('vk_token', tokenResult.access_token);
      localStorage.setItem('vk_refresh_token', tokenResult.refresh_token);

      // Получаем информацию о пользователе
      const userInfoResult = await Auth.userInfo(tokenResult.access_token);

      // Преобразуем в наш формат
      const user: VKUser = {
        id: tokenResult.user_id,
        first_name: userInfoResult.user.first_name || '',
        last_name: userInfoResult.user.last_name || '',
        avatar: userInfoResult.user.avatar,
        phone: userInfoResult.user.phone,
        email: userInfoResult.user.email,
      };

      return user;
    } catch (error) {
      console.error('VK ID login error:', error);
      throw new Error('Не удалось войти через VK ID');
    }
  }

  async logout() {
    const token = localStorage.getItem('vk_token');

    if (token) {
      try {
        await Auth.logout(token);
      } catch (error) {
        console.error('VK ID logout error:', error);
      }
    }

    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_refresh_token');
  }
}

export const vkidService = new VKIDService();
