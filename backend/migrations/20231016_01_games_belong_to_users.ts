import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('games', 'userId', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('games', 'userId');
};
