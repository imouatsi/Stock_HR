import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET'];
const optionalEnvVars = { NODE_ENV: 'development' }; // Default to 'development'

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1); // Exit if a required variable is missing
  }
});

Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
  if (!process.env[key]) {
    console.warn(`Optional environment variable ${key} not set. Using default: ${defaultValue}`);
    process.env[key] = defaultValue;
  }
});
