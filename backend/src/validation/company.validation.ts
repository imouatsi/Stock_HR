import Joi from 'joi';

export const companyValidation = {
  createCompany: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    taxNumber: Joi.string().required()
  }),

  updateCompany: Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
    taxNumber: Joi.string()
  }).min(1) // At least one field is required for update
}; 