import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('countries', 'area', {
    type: DataTypes.FLOAT,
  });
  await queryInterface.changeColumn('countries', 'location_lat', {
    type: DataTypes.FLOAT,
  });
  await queryInterface.changeColumn('countries', 'location_lng', {
    type: DataTypes.FLOAT,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.changeColumn('countries', 'area', {
    type: DataTypes.INTEGER,
  });
  await queryInterface.changeColumn('countries', 'location_lat', {
    type: DataTypes.INTEGER,
  });
  await queryInterface.changeColumn('countries', 'location_lng', {
    type: DataTypes.INTEGER,
  });
};
