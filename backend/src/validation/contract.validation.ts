import Joi from 'joi';

export const contractValidation = {
  createContract: Joi.object({
    number: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    amount: Joi.number().min(0).required(),
    status: Joi.string().valid('active', 'expired', 'terminated').default('active'),
    company: Joi.string().required()
  }),

  updateContract: Joi.object({
    number: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    amount: Joi.number().min(0),
    status: Joi.string().valid('active', 'expired', 'terminated'),
    company: Joi.string()
  }).min(1)
}; 