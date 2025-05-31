import * as Joi from 'joi';

export const configSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1h'),
  JWT_EMAIL_VERIFICATION_SECRET: Joi.string().required(),
  JWT_EMAIL_VERIFICATION_EXPIRES_IN: Joi.string().default('1d'),
  JWT_RESET_PASS_SECRET: Joi.string().required(),
  JWT_RESET_PASS_SECRET_EXPIRES_IN: Joi.string().default('1h'),
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().required(),
  FRONTEND_URL: Joi.string().required(),
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_KEY: Joi.string().required(),
});
