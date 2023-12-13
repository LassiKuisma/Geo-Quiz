/* eslint-disable no-console */

import 'dotenv/config';
import { LoggingLevel } from '../types/internal';

const dbUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.NODE_ENV === 'development'
    ? process.env.DATABASE_URL_DEVELOPMENT
    : process.env.DATABASE_URL_TEST;

if (!dbUrl) {
  console.error('Database url missing');
  process.exit(1);
}

// it seems that ts can't figure out that dbUrl is a string (due to process.exit)
// using a second variable seems to fix this
const DATABASE_URL = dbUrl;

const PORT = process.env.PORT || 3003;

const jwt = process.env.JWT_SECRET;
if (!jwt) {
  console.error('JWT secret missing');
  process.exit(1);
}

const JWT_SECRET = jwt;

const logLevel = process.env.LOGGING_LEVEL;
let LOGGING_LEVEL: LoggingLevel = 'info';

if (logLevel) {
  if (logLevel !== 'info' && logLevel !== 'error') {
    console.error(`invalid logging level: '${logLevel}'`);
    process.exit(1);
  }

  LOGGING_LEVEL = logLevel;
}

export { DATABASE_URL, JWT_SECRET, PORT, LOGGING_LEVEL };
