/*
    These are the environment specific variables, these can also be pulled from secrest server
*/
import path from 'path';
import dotenv from 'dotenv';

const env = process.env.ENV || 'dev';
console.log(`Running tests against against ${env}`);

const envVarPath = path.join(`./.env.${env}`);
dotenv.config({ path: envVarPath });

function requiredEnvVars(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

const config = {
  appUrl: requiredEnvVars('APP_URL'),
  authService: requiredEnvVars('AUTH_SERVICE'),
  email: requiredEnvVars('EMAIL'),
  password: requiredEnvVars('PASSWORD'),
  /* Add additional config from .env files here */
  //usersUrl: requiredEnvVars('USERS_SERVICE'),
};

export { config };
