import { object, string } from 'yup';

export const companySchema = object({
  name: string().required('Company name is required').trim(),
  address: string().required('Company address is required').trim(),
  phone: string().required('Company phone is required').trim(),
  email: string()
    .required('Company email is required')
    .email('Please enter a valid email address')
    .trim()
    .lowercase(),
  website: string()
    .url('Please enter a valid URL')
    .trim()
    .optional(),
  logo: string().optional(),
  taxId: string().trim().optional(),
}); 