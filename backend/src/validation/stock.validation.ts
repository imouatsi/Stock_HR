import Joi from 'joi';

class StockValidation {
  createStock = {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      quantity: Joi.number().required().min(0),
      unit: Joi.string().required(),
      unitPrice: Joi.number().required().min(0),
      category: Joi.string().required(),
      supplier: Joi.string(),
      reorderPoint: Joi.number().min(0),
      location: Joi.string()
    })
  };

  updateStock = {
    params: Joi.object({
      id: Joi.string().required()
    }),
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      quantity: Joi.number().min(0),
      unit: Joi.string(),
      unitPrice: Joi.number().min(0),
      category: Joi.string(),
      supplier: Joi.string(),
      reorderPoint: Joi.number().min(0),
      location: Joi.string()
    })
  };

  delete = {
    params: Joi.object({
      id: Joi.string().required()
    })
  };

  getOne = {
    params: Joi.object({
      id: Joi.string().required()
    })
  };
}

export const stockValidation = new StockValidation(); 