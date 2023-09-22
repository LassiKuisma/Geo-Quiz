import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class CountryContinent extends Model<
  InferAttributes<CountryContinent>,
  InferCreationAttributes<CountryContinent>
> {
  declare countryId: number;
  declare continentId: number;
}

CountryContinent.init(
  {
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
  },
  {
    sequelize,
    modelName: 'country_continent',
  }
);

export { CountryContinent };
