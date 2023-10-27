import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('games', 'created_at', {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  });

  await queryInterface.addColumn('moves', 'created_at', {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('games', 'created_at');
  await queryInterface.removeColumn('moves', 'created_at');
};
