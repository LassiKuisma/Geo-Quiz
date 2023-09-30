import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class CountryNeighbour extends Model<
  InferAttributes<CountryNeighbour>,
  InferCreationAttributes<CountryNeighbour>
> {
  declare firstCountryId: number;
  declare secondCountryId: number;
}

CountryNeighbour.init(
  {
    firstCountryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
    secondCountryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'countries', key: 'id' },
    },
  },
  {
    sequelize,
    modelName: 'country_neighbour',
  }
);

export { CountryNeighbour };
