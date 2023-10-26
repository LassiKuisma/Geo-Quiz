import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

import { DrivingSide } from './drivingSide';
import { Region } from './region';
import { Subregion } from './subregion';

class CountryModel extends Model<
  InferAttributes<CountryModel>,
  InferCreationAttributes<CountryModel>
> {
  declare id: CreationOptional<number>;
  declare area: number;
  declare countryCode: string;
  declare landlocked: boolean;
  declare name: string;
  declare population: number;
  declare location_lat: number;
  declare location_lng: number;
  declare capital: string;

  declare regionId: ForeignKey<Region['id']>;
  declare subregionId: ForeignKey<Subregion['id']>;
  declare drivingSideId: ForeignKey<DrivingSide['id']>;
}

CountryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    area: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
    location_lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    location_lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'country',
  }
);

export { CountryModel };
