const SPECIAL_CHARS = '[<,./\';=\\-!@#$%^&*()/*+|]';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Пароль должен содержать минимум 8 символов' };
  }
  if (password.length > 30) {
    return { valid: false, error: 'Пароль должен содержать не более 30 символов' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: '1 заглавная буква обязательна' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: '1 строчная буква обязательна' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, error: '1 цифра обязательна' };
  }
  if (!new RegExp(SPECIAL_CHARS).test(password)) {
    return { valid: false, error: '1 спецсимвол обязателен' };
  }
  return { valid: true };
}
