import { Client } from 'pg';
import { loadConfig } from '../config';
import fs from 'node:fs';

export const insertCountryData = async () => {
  const config = loadConfig();
  const client = new Client({
    connectionString: config.dbUrl,
  });

  await client.connect();

  const queryString = loadString('util/insert_query.sql');
  await client.query(queryString);

  await client.end();
};

export const clearDatabase = async () => {
  const config = loadConfig();
  const client = new Client({
    connectionString: config.dbUrl,
  });

  await client.connect();
  const clear = loadString('util/clear_db.sql');
  await client.query(clear);
  await client.end();
};

const loadString = (path: string): string => {
  return fs.readFileSync(path, 'utf-8');
};
