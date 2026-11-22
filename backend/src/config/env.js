
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Always load backend/.env, independent of the terminal directory.
dotenv.config({
  path: path.resolve(currentDirectory, '../../.env'),
});

function getEnv(name, fallback = undefined) {
  const value = process.env[name];

  if (value === undefined || value.trim() === '') {
    return fallback;
  }

  return value.trim();
}

function requireEnv(name) {
  const value = getEnv(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),

  PORT: Number(getEnv('PORT', '5000')),

  CLIENT_URL: getEnv('CLIENT_URL', 'http://localhost:5173'),

  // Supabase
  SUPABASE_URL: getEnv('SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY'),

  // Razorpay
  RAZORPAY_KEY_ID: getEnv('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: getEnv('RAZORPAY_KEY_SECRET'),

  // Application
  APP_NAME: getEnv('APP_NAME', 'Digital Heroes PrintForge'),

  // Storage
  STORAGE_BUCKET: getEnv('STORAGE_BUCKET', 'printforge-files'),
};

export function validateEnv() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  if (!Number.isInteger(env.PORT) || env.PORT < 1 || env.PORT > 65535) {
    throw new Error('PORT must be a valid port number.');
  }

  if (
    env.NODE_ENV === 'production' &&
    (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET)
  ) {
    throw new Error(
      'Razorpay credentials are required in production.'
    );
  }
}

export { getEnv, requireEnv };
