import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('countries', 'location');

  await queryInterface.dropTable('locations');

  await queryInterface.addColumn('countries', 'location_lat', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });

  await queryInterface.addColumn('countries', 'location_lng', {
    type: DataTypes.INTEGER,
    allowNull: false,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('countries', 'location_lat');
  await queryInterface.removeColumn('countries', 'location_lng');

  await queryInterface.createTable('locations', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    latitude: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  await queryInterface.addColumn('countries', 'location', {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'id',
    },
  });
};
