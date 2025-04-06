import { Schema } from 'yup';
import * as yup from 'yup';

export const userSchema: Schema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^(SA|UA|U)\d{5}$/,
      'Username must follow the format: SA00000 (Superadmin), UA00001 (Admin), or U00002 (User)'
    )
    .required('Username is required'),

  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .optional(),

  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters')
    .optional(),

  lastName: yup
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters')
    .optional(),

  role: yup
    .string()
    .oneOf(['superadmin', 'admin', 'user'], 'Role must be either superadmin, admin, or user')
    .optional(),

  isAuthorized: yup
    .boolean()
    .default(false)
    .optional(),

  settings: yup
    .object()
    .optional(),

  organization: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, 'Organization must be a valid MongoDB ID')
    .optional()
}); 