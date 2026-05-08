import { vkidService } from './vkid';
import type { VKUser } from './vkid';

export interface User {
  uid: string;
  phone?: string | null;
  email?: string | null;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

let currentUser: User | null = null;
let authListeners: Array<(user: User | null) => void> = [];

function mapVKUser(vkUser: VKUser): User {
  return {
    uid: vkUser.id.toString(),
    phone: vkUser.phone || null,
    email: null,
    firstName: vkUser.first_name,
    lastName: vkUser.last_name,
    avatarUrl: vkUser.avatar,
  };
}

function notifyListeners() {
  authListeners.forEach(listener => listener(currentUser));
}

// VK ID авторизация
export async function signInWithVK(): Promise<User> {
  const vkUser = await vkidService.login();
  currentUser = mapVKUser(vkUser);

  // Сохраняем в localStorage
  localStorage.setItem('vk_user', JSON.stringify(currentUser));

  notifyListeners();
  return currentUser;
}

// Выход
export async function signOut() {
  await vkidService.logout();
  currentUser = null;
  localStorage.removeItem('vk_user');
  notifyListeners();
}

// Текущий пользователь
export function getCurrentUser(): User | null {
  return currentUser;
}

// Слушатель изменений авторизации
export function onAuthStateChanged(callback: (user: User | null) => void) {
  authListeners.push(callback);

  // Сразу вызываем callback с текущим состоянием
  callback(currentUser);

  // Возвращаем функцию отписки
  return () => {
    authListeners = authListeners.filter(listener => listener !== callback);
  };
}

// Инициализация при загрузке
export function initAuth() {
  const savedUser = localStorage.getItem('vk_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      notifyListeners();
    } catch (e) {
      localStorage.removeItem('vk_user');
    }
  }
}

// Вызываем инициализацию
initAuth();
