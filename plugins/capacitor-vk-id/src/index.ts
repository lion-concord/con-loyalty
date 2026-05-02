import { registerPlugin } from '@capacitor/core';

import type { VkIdPlugin } from './definitions';

const VkId = registerPlugin<VkIdPlugin>('VkId', {
  web: () => import('./web').then(m => new m.VkIdWeb()),
});

export * from './definitions';
export { VkId };
