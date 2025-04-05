import Joi from 'joi';

export const companySchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  nif: Joi.string().required(),
  phone: Joi.string(),
  email: Joi.string().email(),
  website: Joi.string().uri(),
  bankDetails: Joi.object({
    bankName: Joi.string(),
    accountNumber: Joi.string(),
    iban: Joi.string(),
  }),
}); 