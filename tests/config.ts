import 'dotenv/config';

interface Config {
  dbUrl: string;
}

export const loadConfig = (): Config => {
  const pgUser = process.env.POSTGRES_USER;
  if (!pgUser) {
    console.error('Postgres user is missing from env');
    process.exit(1);
  }

  const pgPassword = process.env.POSTGRES_PASSWORD;
  if (!pgPassword) {
    console.error('Postgres password is missing from env');
    process.exit(1);
  }

  const pgHost = process.env.POSTGRES_HOST;
  if (!pgHost) {
    console.error('Postgres host is missing from env');
    process.exit(1);
  }

  const pgPort = process.env.POSTGRES_PORT;
  if (!pgPort) {
    console.error('Postgres port is missing from env');
    process.exit(1);
  }

  const pgDbName = process.env.POSTGRES_DB;
  if (!pgDbName) {
    console.error('Postgres database name is missing from env');
    process.exit(1);
  }

  return {
    dbUrl: `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDbName}`,
  };
};
