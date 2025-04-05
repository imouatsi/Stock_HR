import Joi from 'joi';

export const invoiceSchema = Joi.object({
  type: Joi.string().valid('proforma', 'final').required(),
  client: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    nif: Joi.string(),
  }).required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
      barcode: Joi.string(),
    })
  ).min(1).required(),
  paymentTerms: Joi.string().required(),
  dueDate: Joi.date().greater('now').required(),
  signature: Joi.string(),
  qrCode: Joi.string(),
}); 