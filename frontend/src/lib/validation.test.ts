import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from './validation';

describe('Validation', () => {
  describe('validateEmail', () => {
    it.each([
      'test@example.com',
      'user.name@domain.co.uk',
      'a@b.c',
    ])('accepts valid email: %s', (email) => {
      expect(validateEmail(email)).toBe(true);
    });

    it.each([
      'invalid',
      'test@',
      '@example.com',
      'test @example.com',
      '',
    ])('rejects invalid email: %s', (email) => {
      expect(validateEmail(email)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('accepts valid password with all requirements', () => {
      expect(validatePassword('12Ukrain34!')).toEqual({ valid: true });
    });

    it('accepts 8 character password at minimum', () => {
      expect(validatePassword('A1b2c3d!')).toEqual({ valid: true });
    });

    it('accepts 30 character password at maximum', () => {
      expect(validatePassword('A'.repeat(15) + 'a'.repeat(5) + '1'.repeat(5) + '!')).toEqual({ valid: true });
    });

    it('rejects password shorter than 8 characters', () => {
      const result = validatePassword('A1b2c3!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('минимум 8 символов');
    });

    it('rejects password longer than 30 characters', () => {
      const result = validatePassword('A'.repeat(16) + 'a'.repeat(5) + '1'.repeat(5) + '!!!!!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('не более 30 символов');
    });

    it('rejects password without uppercase letter', () => {
      const result = validatePassword('a1b2c3d!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('заглавная буква');
    });

    it('rejects password without lowercase letter', () => {
      const result = validatePassword('A1B2C3D!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('строчная буква');
    });

    it('rejects password without digit', () => {
      const result = validatePassword('Abcdefg!');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('цифра');
    });

    it('rejects password without special character', () => {
      const result = validatePassword('Abcdefg1');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('спецсимвол');
    });

    it('accepts password with hyphen', () => {
      expect(validatePassword('Abcdefg1-')).toEqual({ valid: true });
    });

    it('accepts password with equals sign', () => {
      expect(validatePassword('Abcdefg1=')).toEqual({ valid: true });
    });

    it('accepts password with plus sign', () => {
      expect(validatePassword('Abcdefg1+')).toEqual({ valid: true });
    });

    it('accepts password with multiple special chars', () => {
      expect(validatePassword('A1b2c3d4&+=')).toEqual({ valid: true });
    });
  });
});
