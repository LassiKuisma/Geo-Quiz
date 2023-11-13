import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('games', 'difficulty', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('games', 'difficulty');
};
