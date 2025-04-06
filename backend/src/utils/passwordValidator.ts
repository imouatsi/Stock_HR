import { typedLogger } from './logger';

export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    hasMinLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    hasNoSpaces: boolean;
    isNotCommon: boolean;
    score: number;
  };
}

// Common weak passwords to check against
const COMMON_PASSWORDS = new Set([
  'password', 'password123', '123456', '12345678', 'qwerty',
  'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon',
  'football', 'baseball', 'master', 'login', 'admin123'
]);

// Special characters allowed in passwords
const SPECIAL_CHARS = /[!@#$%^&*(),.?":{}|<>]/;

// Password validation configuration
const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  minScore: 3,
};

// Calculate password strength score (0-5)
const calculatePasswordScore = (password: string): number => {
  let score = 0;

  // Length score
  if (password.length >= PASSWORD_CONFIG.minLength) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Character variety score
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = SPECIAL_CHARS.test(password);

  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  // Deduct points for patterns
  if (/(.)\1{2,}/.test(password)) score--; // Repeated characters
  if (/^[a-zA-Z]+$/.test(password)) score--; // Only letters
  if (/^[0-9]+$/.test(password)) score--; // Only numbers

  return Math.max(0, Math.min(5, score));
};

export const validatePassword = (
  password: string,
  options: {
    minLength?: number;
    maxLength?: number;
    minScore?: number;
    checkCommonPasswords?: boolean;
  } = {}
): PasswordValidationResult => {
  try {
    const {
      minLength = PASSWORD_CONFIG.minLength,
      maxLength = PASSWORD_CONFIG.maxLength,
      minScore = PASSWORD_CONFIG.minScore,
      checkCommonPasswords = true,
    } = options;

    const details = {
      hasMinLength: password.length >= minLength,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: SPECIAL_CHARS.test(password),
      hasNoSpaces: !/\s/.test(password),
      isNotCommon: !checkCommonPasswords || !COMMON_PASSWORDS.has(password.toLowerCase()),
      score: calculatePasswordScore(password),
    };

    // Check for spaces
    if (!details.hasNoSpaces) {
      return {
        isValid: false,
        error: 'Password cannot contain spaces',
        details,
      };
    }

    // Check minimum length
    if (!details.hasMinLength) {
      return {
        isValid: false,
        error: `Password must be at least ${minLength} characters long`,
        details,
      };
    }

    // Check maximum length
    if (password.length > maxLength) {
      return {
        isValid: false,
        error: `Password cannot be longer than ${maxLength} characters`,
        details,
      };
    }

    // Check for uppercase letters
    if (!details.hasUpperCase) {
      return {
        isValid: false,
        error: 'Password must contain at least one uppercase letter',
        details,
      };
    }

    // Check for lowercase letters
    if (!details.hasLowerCase) {
      return {
        isValid: false,
        error: 'Password must contain at least one lowercase letter',
        details,
      };
    }

    // Check for numbers
    if (!details.hasNumber) {
      return {
        isValid: false,
        error: 'Password must contain at least one number',
        details,
      };
    }

    // Check for special characters
    if (!details.hasSpecialChar) {
      return {
        isValid: false,
        error: 'Password must contain at least one special character',
        details,
      };
    }

    // Check for common passwords
    if (!details.isNotCommon) {
      return {
        isValid: false,
        error: 'This password is too common. Please choose a stronger password',
        details,
      };
    }

    // Check password strength score
    if (details.score < minScore) {
      return {
        isValid: false,
        error: 'Password is too weak. Please choose a stronger combination of characters',
        details,
      };
    }

    return {
      isValid: true,
      details,
    };
  } catch (error) {
    typedLogger.error('Password validation error', { error });
    return {
      isValid: false,
      error: 'An error occurred while validating the password',
    };
  }
}; 