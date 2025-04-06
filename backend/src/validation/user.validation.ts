import Joi from 'joi';

export const userValidation = {
  createUser: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('admin', 'user').default('user')
  }),

  updateUser: Joi.object({
    username: Joi.string().min(3),
    role: Joi.string().valid('admin', 'user'),
    isActive: Joi.boolean(),
    isAuthorized: Joi.boolean()
  }).min(1) // At least one field is required for update
}; 