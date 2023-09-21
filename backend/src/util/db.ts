import { Sequelize } from 'sequelize';
import 'dotenv/config';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log('database url not set');
  process.exit(1);
}

const sequelize = new Sequelize(dbUrl);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('connected to database');
  } catch (err) {
    console.log('failed to connect to database:', err);
    return process.exit(1);
  }
};
