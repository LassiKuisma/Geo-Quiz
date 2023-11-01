import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('moves', {
    moveId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'games', key: 'gameId' },
    },
    guessedCountry: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
  });

  await queryInterface.removeColumn('games', 'guessCount');
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('games', 'guessCount', {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  });

  await queryInterface.dropTable('moves');
};
