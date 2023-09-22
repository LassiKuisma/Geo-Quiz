import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../util/db';

class CountryLanguage extends Model<
  InferAttributes<CountryLanguage>,
  InferCreationAttributes<CountryLanguage>
> {
  declare countryId: number;
  declare languageId: number;
}

CountryLanguage.init(
  {
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
  },
  {
    sequelize,
    modelName: 'country_language',
  }
);

export { CountryLanguage };
