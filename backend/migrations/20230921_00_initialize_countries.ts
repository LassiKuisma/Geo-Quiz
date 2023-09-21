import { DataTypes } from 'sequelize';
import { Migration } from '../src/util/db';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('driving_sides', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    side: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  await queryInterface.createTable('regions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    regionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  await queryInterface.createTable('subregions', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    subregionName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  await queryInterface.createTable('continents', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    continentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  await queryInterface.createTable('languages', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    languageName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

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

  await queryInterface.createTable('countries', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      autoIncrement: true,
      primaryKey: true,
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    drivingSide: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'driving_sides',
        key: 'id',
      },
    },
    landlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    location: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    population: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'regions',
        key: 'id',
      },
    },
    subregion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subregions',
        key: 'id',
      },
    },
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('countries');
  await queryInterface.dropTable('driving_sides');
  await queryInterface.dropTable('regions');
  await queryInterface.dropTable('subregions');
  await queryInterface.dropTable('continents');
  await queryInterface.dropTable('languages');
  await queryInterface.dropTable('locations');
};
