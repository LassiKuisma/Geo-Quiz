import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { DATABASE_URL } from './config';
import logger from './logger';

export const sequelize = new Sequelize(DATABASE_URL, {
  define: {
    underscored: false,
    timestamps: false,
    createdAt: false,
    updatedAt: false,
  },
  logging: false,
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    logger.info('connected to database');
  } catch (err) {
    logger.error('failed to connect to database:', err);
    return process.exit(1);
  }
};

const migrationConf = {
  migrations: {
    glob: 'migrations/*.ts',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
};

export const migrator = new Umzug(migrationConf);
export type Migration = typeof migrator._types.migration;

const runMigrations = async () => {
  const migrations = await migrator.up();
  logger.info('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  await sequelize.authenticate();
  await migrator.down();
};
