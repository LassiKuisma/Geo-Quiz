import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('country_languages', {
    countryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    languageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'languages', key: 'id' },
    },
  });

  await queryInterface.createTable('country_continents', {
    countryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    continentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'continents', key: 'id' },
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('country_languages');
  await queryInterface.dropTable('country_continents');
};
