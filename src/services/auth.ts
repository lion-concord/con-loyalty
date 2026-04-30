import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import type { ConfirmationResult, User } from "firebase/auth";
import { auth } from "./firebase";

// Email авторизация
export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// Phone авторизация
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function initRecaptcha(containerId: string) {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
      callback: () => {
        console.log("reCAPTCHA solved");
      },
    });
  }
  return recaptchaVerifier;
}

export async function sendPhoneCode(
  phoneNumber: string
): Promise<ConfirmationResult> {
  if (!recaptchaVerifier) {
    throw new Error("reCAPTCHA not initialized");
  }

  const formattedPhone = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+${phoneNumber}`;

  return await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
}

export async function verifyPhoneCode(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<User> {
  const result = await confirmationResult.confirm(code);
  return result.user;
}

// Выход
export async function signOut() {
  await firebaseSignOut(auth);
}

// Текущий пользователь
export function getCurrentUser() {
  return auth.currentUser;
}

// Слушатель изменений авторизации
export function onAuthStateChanged(callback: (user: User | null) => void) {
  return auth.onAuthStateChanged(callback);
}
