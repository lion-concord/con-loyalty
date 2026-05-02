// VK ID SDK для веб-версии
// Для нативного Android потребуется отдельный Capacitor плагин

interface VKUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
}

interface VKAuthResponse {
  access_token: string;
  user_id: number;
  expires_in: number;
}

class VKIDService {
  private appId: string;
  private redirectUri: string;

  constructor() {
    this.appId = import.meta.env.VITE_VK_APP_ID || '';
    this.redirectUri = `vk${this.appId}://vk.com/blank.html`;
  }

  async login(): Promise<VKUser> {
    // Для веб-версии используем OAuth через popup
    const authUrl = this.getAuthUrl();

    return new Promise((resolve, reject) => {
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        authUrl,
        'vk_auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject(new Error('Popup blocked'));
        return;
      }

      // Слушаем сообщения от popup
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'vk_auth_success') {
          window.removeEventListener('message', messageHandler);
          popup.close();

          try {
            const user = await this.getUserInfo(event.data.access_token);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        } else if (event.data.type === 'vk_auth_error') {
          window.removeEventListener('message', messageHandler);
          popup.close();
          reject(new Error(event.data.error || 'VK auth failed'));
        }
      };

      window.addEventListener('message', messageHandler);

      // Проверяем, не закрыл ли пользователь popup
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('Auth cancelled'));
        }
      }, 1000);
    });
  }

  private getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      display: 'popup',
      scope: 'phone,email',
      response_type: 'token',
      v: '5.131',
    });

    return `https://oauth.vk.com/authorize?${params.toString()}`;
  }

  private async getUserInfo(accessToken: string): Promise<VKUser> {
    const params = new URLSearchParams({
      access_token: accessToken,
      fields: 'photo_200',
      v: '5.131',
    });

    const response = await fetch(`https://api.vk.com/method/users.get?${params.toString()}`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.error_msg);
    }

    const vkUser = data.response[0];
    return {
      id: vkUser.id,
      first_name: vkUser.first_name,
      last_name: vkUser.last_name,
      avatar: vkUser.photo_200,
    };
  }

  async logout() {
    // Очищаем локальное хранилище
    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_token');
  }
}

export const vkidService = new VKIDService();
export type { VKUser };
