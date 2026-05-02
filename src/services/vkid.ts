import { Capacitor } from '@capacitor/core';
import { VkId } from 'capacitor-vk-id';
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
  private isNative = Capacitor.isNativePlatform();

  private init() {
    if (this.isInitialized) return;

    // Инициализация только для веб-версии
    if (!this.isNative) {
      const appId = import.meta.env.VITE_VK_APP_ID || '54574930';

      Config.init({
        app: parseInt(appId),
        redirectUrl: window.location.origin,
        state: 'con-loyalty-auth',
        scope: 'email phone',
      });
    }

    this.isInitialized = true;
  }

  async login(): Promise<VKUser> {
    this.init();

    if (this.isNative) {
      // Нативная авторизация через плагин
      return this.loginNative();
    } else {
      // Веб-авторизация через @vkid/sdk
      return this.loginWeb();
    }
  }

  private async loginNative(): Promise<VKUser> {
    try {
      const result = await VkId.login();

      // Сохраняем токен
      localStorage.setItem('vk_token', result.accessToken);

      // Получаем дополнительную информацию о пользователе через API
      const userInfo = await this.getUserInfoFromAPI(result.accessToken);

      const user: VKUser = {
        id: result.user.id,
        first_name: userInfo.first_name || result.user.firstName || '',
        last_name: userInfo.last_name || result.user.lastName || '',
        avatar: userInfo.avatar || result.user.avatar,
        phone: userInfo.phone || result.user.phone,
        email: userInfo.email || result.user.email,
      };

      return user;
    } catch (error) {
      console.error('Native VK ID login error:', error);
      throw new Error('Не удалось войти через VK ID');
    }
  }

  private async loginWeb(): Promise<VKUser> {
    try {
      const authResponse = await Auth.login({
        scheme: Scheme.LIGHT,
        lang: Languages.RUS,
      }) as AuthResponse;

      const tokenResult = await Auth.exchangeCode(
        authResponse.code,
        authResponse.device_id
      );

      localStorage.setItem('vk_token', tokenResult.access_token);
      localStorage.setItem('vk_refresh_token', tokenResult.refresh_token);

      const userInfoResult = await Auth.userInfo(tokenResult.access_token);

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
      console.error('Web VK ID login error:', error);
      throw new Error('Не удалось войти через VK ID');
    }
  }

  private async getUserInfoFromAPI(accessToken: string): Promise<Partial<VKUser>> {
    try {
      const params = new URLSearchParams({
        access_token: accessToken,
        fields: 'photo_200,contacts',
        v: '5.131',
      });

      const response = await fetch(`https://api.vk.com/method/users.get?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error('VK API error:', data.error);
        return {};
      }

      const vkUser = data.response[0];
      return {
        first_name: vkUser.first_name,
        last_name: vkUser.last_name,
avatar: vkUser.photo_200,
        phone: vkUser.mobile_phone || vkUser.home_phone,
      };
    } catch (error) {
      console.error('Error fetching user info from VK API:', error);
      return {};
    }
  }

  async logout() {
    const token = localStorage.getItem('vk_token');

    if (this.isNative) {
      await VkId.logout();
    } else if (token) {
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
