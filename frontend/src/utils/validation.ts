import * as yup from 'yup';
import { LoginCredentials, RegisterData, UserProfile } from '@/types/user';

// Password validation configuration
const PASSWORD_CONFIG = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true
};

// Common weak passwords to check against
const COMMON_PASSWORDS = [
  'password', 'password123', '123456', '12345678', 'qwerty',
  'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon',
  'football', 'baseball', 'master', 'login', 'admin123'
];

// Email validation schema
export const emailSchema = yup
  .string()
  .email('Invalid email address')
  .required('Email is required');

// Password validation schema
export const passwordSchema = yup
  .string()
  .min(PASSWORD_CONFIG.minLength, `Password must be at least ${PASSWORD_CONFIG.minLength} characters`)
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
  .required('Password is required');

// Login validation schema
export const loginSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema
});

// Registration validation schema
export const registerSchema = yup.object().shape({
  email: emailSchema,
  password: passwordSchema,
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  role: yup.string().oneOf(['admin', 'manager', 'employee', 'guest']).required('Role is required')
});

// User profile validation schema
export const userProfileSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: emailSchema,
  phone: yup.string().nullable(),
  address: yup.string().nullable(),
  departmentId: yup.string().nullable(),
  positionId: yup.string().nullable()
});

// Common validation schemas
const nameSchema = yup.string()
  .min(2, 'Must be at least 2 characters')
  .max(50, 'Must be at most 50 characters')
  .matches(/^[a-zA-Z\s-]+$/, 'Can only contain letters, spaces, and hyphens')
  .required('This field is required')
  .trim();

// Type-safe schemas
export const schemas = {
  login: loginSchema,
  register: registerSchema,
  updateProfile: userProfileSchema,
  changePassword: yup.object({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: yup.string()
      .oneOf([yup.ref('newPassword')], 'Passwords must match')
      .required('Please confirm your password'),
  }),
  inventory: yup.object({
    name: yup.string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be at most 100 characters')
      .required('Name is required')
      .trim(),
    quantity: yup.number()
      .integer('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative')
      .required('Quantity is required'),
    price: yup.number()
      .min(0, 'Price cannot be negative')
      .required('Price is required')
      .test('decimal', 'Price can have at most 2 decimal places', 
        value => value === undefined || /^\d+(\.\d{0,2})?$/.test(value.toString())),
    description: yup.string()
      .max(500, 'Description must be at most 500 characters')
      .optional(),
    category: yup.string()
      .required('Category is required'),
    sku: yup.string()
      .matches(/^[A-Z0-9-]+$/, 'SKU must contain only uppercase letters, numbers, and hyphens')
      .required('SKU is required'),
  }),
};

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export const validateForm = async <T extends Record<string, any>>(
  schema: yup.ObjectSchema<any>,
  data: T
): Promise<ValidationResult<T>> => {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
    return { 
      isValid: true,
      data: validatedData as T
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { 
        isValid: false,
        errors,
      };
    }
    return { 
      isValid: false,
      errors: { general: 'Validation failed' }
    };
  }
};

// Generic validation function
export const validateField = async (
  schema: yup.AnySchema,
  fieldName: string,
  value: unknown
): Promise<string | null> => {
  try {
    await schema.validateAt(fieldName, { [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};
