import Joi from 'joi';

export const inventoryValidation = {
  createInventory: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().required().min(0),
    unit: Joi.string().required(),
    price: Joi.number().required().min(0)
  }),

  updateInventory: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    quantity: Joi.number().min(0),
    unit: Joi.string(),
    price: Joi.number().min(0)
  }).min(1)
}; 