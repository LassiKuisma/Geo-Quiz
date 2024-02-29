/* eslint-disable no-console */
import fs from 'node:fs';

import 'dotenv/config';
import { LoggingLevel } from '../types/logging';

let dbUrl;
// if the argument '--db-url-file=<file>' is given, load db url from that file
// instead of .env
const dbUrlFile = process.env.npm_config_db_url_file;
if (dbUrlFile) {
  try {
    dbUrl = fs.readFileSync(dbUrlFile, 'utf-8').trim();
  } catch (err) {
    console.log(`Failed to load database url from '${dbUrlFile}'`);
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log(err);
    }

    process.exit(1);
  }
} else {
  dbUrl = process.env.DATABASE_URL;
}

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
