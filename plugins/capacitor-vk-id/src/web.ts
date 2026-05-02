import { WebPlugin } from '@capacitor/core';

import type { VkIdPlugin, VkIdLoginResult, VkIdUser } from './definitions';

export class VkIdWeb extends WebPlugin implements VkIdPlugin {
  async login(): Promise<VkIdLoginResult> {
    throw this.unimplemented('VK ID login is not implemented for web. Use @vkid/sdk directly.');
  }

  async logout(): Promise<void> {
    throw this.unimplemented('VK ID logout is not implemented for web.');
  }

  async getCurrentUser(): Promise<VkIdUser | null> {
    throw this.unimplemented('VK ID getCurrentUser is not implemented for web.');
  }
}
