import * as dotenv from 'dotenv';
import path from 'path';

// Load variables from qa.env
dotenv.config({ path: path.resolve(process.cwd(), 'qa.env') });

export const env = {
  BASE_URL: process.env.BASE_URL || '',
  USERNAME: process.env.APP_USERNAME || '',
  PASSWORD: process.env.APP_PASSWORD || '',
};
