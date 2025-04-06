import Joi from 'joi';

class InvoiceValidation {
  createInvoice = {
    body: Joi.object({
      number: Joi.string().required(),
      date: Joi.date().required(),
      dueDate: Joi.date().required(),
      amount: Joi.number().required().min(0),
      status: Joi.string().valid('draft', 'sent', 'paid', 'overdue').required(),
      company: Joi.string().required(),
      items: Joi.array().items(
        Joi.object({
          description: Joi.string().required(),
          quantity: Joi.number().required().min(0),
          unitPrice: Joi.number().required().min(0),
          total: Joi.number().required().min(0)
        })
      ).required()
    })
  };

  updateInvoice = {
    params: Joi.object({
      id: Joi.string().required()
    }),
    body: Joi.object({
      number: Joi.string(),
      date: Joi.date(),
      dueDate: Joi.date(),
      amount: Joi.number().min(0),
      status: Joi.string().valid('draft', 'sent', 'paid', 'overdue'),
      company: Joi.string(),
      items: Joi.array().items(
        Joi.object({
          description: Joi.string().required(),
          quantity: Joi.number().required().min(0),
          unitPrice: Joi.number().required().min(0),
          total: Joi.number().required().min(0)
        })
      )
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

export const invoiceValidation = new InvoiceValidation(); 