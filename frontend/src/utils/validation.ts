import * as yup from 'yup';

export const schemas = {
  login: yup.object({
    email: yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required'),
  }),

  inventory: yup.object({
    name: yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    quantity: yup.number()
      .min(0, 'Quantity cannot be negative')
      .required('Quantity is required'),
    price: yup.number()
      .min(0, 'Price cannot be negative')
      .required('Price is required'),
  }),

  user: yup.object({
    email: yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    firstName: yup.string()
      .min(2, 'First name must be at least 2 characters')
      .required('First name is required'),
    lastName: yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .required('Last name is required'),
    role: yup.string()
      .required('Role is required'),
  }),
};

export const validateForm = async <T>(
  schema: yup.ObjectSchema<any>,
  data: T
): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};
