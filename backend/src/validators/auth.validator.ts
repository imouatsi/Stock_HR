import { body } from 'express-validator';
import { ROLES } from '../../../shared/config';
import { validatePassword } from '../utils/passwordValidator';

// Name validation regex
const NAME_REGEX = /^[a-zA-Z\s-]+$/;
const NAME_ERROR_MESSAGE = 'Name can only contain letters, spaces, and hyphens';

// Custom password validator using our enhanced validation
const validatePasswordField = (value: string) => {
  const result = validatePassword(value);
  if (!result.isValid) {
    throw new Error(result.error);
  }
  return true;
};

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const registerValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .custom(validatePasswordField),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(NAME_REGEX)
    .withMessage(NAME_ERROR_MESSAGE),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(NAME_REGEX)
    .withMessage(NAME_ERROR_MESSAGE),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.keys(ROLES))
    .withMessage('Invalid role'),
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body('password')
    .custom(validatePasswordField),
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isLength({ min: 32, max: 32 })
    .withMessage('Invalid reset token'),
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .custom(validatePasswordField),
];

export const updateProfileValidator = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(NAME_REGEX)
    .withMessage(NAME_ERROR_MESSAGE),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(NAME_REGEX)
    .withMessage(NAME_ERROR_MESSAGE),
]; 