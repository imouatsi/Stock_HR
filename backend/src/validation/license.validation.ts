import Joi from 'joi';

export const licenseValidation = {
  createLicense: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    status: Joi.string().valid('active', 'expired', 'revoked').required(),
    company: Joi.string().required()
  }),

  updateLicense: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    status: Joi.string().valid('active', 'expired', 'revoked'),
    company: Joi.string()
  }).min(1)
}; 