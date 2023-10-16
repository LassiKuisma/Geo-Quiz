import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  // there might be a way to convert the legacy games into new table
  // that has auto-increment but let's take the easy way and "drop" them
  await queryInterface.renameTable('games', 'legacy_games');

  await queryInterface.createTable('games', {
    gameId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true,
      autoIncrement: true,
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    guessCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('games');

  await queryInterface.renameTable('legacy_games', 'games');
};
