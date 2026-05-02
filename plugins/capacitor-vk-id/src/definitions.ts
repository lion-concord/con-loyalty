export interface VkIdPlugin {

  login(): Promise<VkIdLoginResult>;

  logout(): Promise<void>;

  getCurrentUser(): Promise<VkIdUser | null>;
}

export interface VkIdLoginResult {
  user: VkIdUser;
  accessToken: string;
  expiresIn: number;
}

export interface VkIdUser {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  email?: string;
}
