import Joi from 'joi';

export const authValidation = {
  signup: Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('user', 'admin').default('user')
  }),

  login: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().required().email()
  }),

  resetPassword: Joi.object({
    password: Joi.string().required().min(8),
    passwordConfirm: Joi.string().required().valid(Joi.ref('password'))
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required().min(8),
    newPasswordConfirm: Joi.string().required().valid(Joi.ref('newPassword'))
  }),

  updateProfile: Joi.object({
    username: Joi.string().pattern(/^[SUA]\d{5}$/)
  })
}; 